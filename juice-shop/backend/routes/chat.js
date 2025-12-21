import express from 'express';
import pool from '../config/database.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';

const router = express.Router();

// Get predefined queries (public)
router.get('/predefined-queries', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM predefined_queries WHERE is_active = true ORDER BY display_order ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching predefined queries:', error);
    res.status(500).json({ error: 'Failed to fetch queries' });
  }
});

// Check agent availability
router.get('/agent-availability', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) as available_agents, 
             SUM(max_chats - active_chats) as available_slots
      FROM agent_status 
      WHERE is_online = true AND active_chats < max_chats
    `);
    
    const availableAgents = parseInt(result.rows[0].available_agents) || 0;
    const availableSlots = parseInt(result.rows[0].available_slots) || 0;
    
    res.json({ 
      available: availableAgents > 0 && availableSlots > 0,
      agents: availableAgents,
      slots: availableSlots
    });
  } catch (error) {
    console.error('Error checking agent availability:', error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

// Create new chat session
router.post('/sessions', optionalAuthenticate, async (req, res) => {
  try {
    const { subject, customerName, customerEmail } = req.body;
    const customerId = req.user?.id || null;

    // Find available agent
    const agentResult = await pool.query(`
      SELECT agent_id FROM agent_status 
      WHERE is_online = true AND active_chats < max_chats 
      ORDER BY active_chats ASC, last_active ASC 
      LIMIT 1
    `);

    const agentId = agentResult.rows[0]?.agent_id || null;
    const status = agentId ? 'active' : 'waiting';

    // Create session
    const sessionResult = await pool.query(
      `INSERT INTO chat_sessions 
       (customer_id, agent_id, customer_name, customer_email, subject, status) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [customerId, agentId, customerName || req.user?.name, customerEmail || req.user?.email, subject, status]
    );

    // Update agent's active chats count if assigned
    if (agentId) {
      await pool.query(
        'UPDATE agent_status SET active_chats = active_chats + 1 WHERE agent_id = $1',
        [agentId]
      );
    }

    res.status(201).json(sessionResult.rows[0]);
  } catch (error) {
    console.error('Error creating chat session:', error);
    res.status(500).json({ error: 'Failed to create chat session' });
  }
});

// Get customer's chat sessions
router.get('/sessions/my', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT cs.*, 
              COUNT(cm.id) FILTER (WHERE cm.is_read = false AND cm.sender_type = 'agent') as unread_count
       FROM chat_sessions cs
       LEFT JOIN chat_messages cm ON cs.id = cm.session_id
       WHERE cs.customer_id = $1
       GROUP BY cs.id
       ORDER BY cs.last_message_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching customer sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get all chat sessions (for agents/admins)
router.get('/sessions/all', authenticate, async (req, res) => {
  try {
    // Check if user is admin or support
    if (req.user.role !== 'admin' && req.user.role !== 'support') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Auto-close sessions inactive for 10+ minutes
    await pool.query(`
      UPDATE chat_sessions 
      SET status = 'closed', closed_at = CURRENT_TIMESTAMP 
      WHERE status IN ('waiting', 'active') 
      AND last_message_at < NOW() - INTERVAL '10 minutes'
    `);
    
    // Decrease active chats for agents whose sessions were auto-closed
    await pool.query(`
      UPDATE agent_status 
      SET active_chats = (
        SELECT COUNT(*) 
        FROM chat_sessions 
        WHERE agent_id = agent_status.agent_id 
        AND status = 'active'
      )
    `);

    const { status } = req.query;
    let query = `
      SELECT cs.*, 
             u.name as customer_display_name,
             a.name as agent_name,
             COUNT(cm.id) FILTER (WHERE cm.is_read = false AND cm.sender_type = 'customer') as unread_count
      FROM chat_sessions cs
      LEFT JOIN users u ON cs.customer_id = u.id
      LEFT JOIN users a ON cs.agent_id = a.id
      LEFT JOIN chat_messages cm ON cs.id = cm.session_id
    `;

    const params = [];
    if (status) {
      query += ' WHERE cs.status = $1';
      params.push(status);
    }

    if (req.user.role === 'support') {
      query += params.length > 0 ? ' AND cs.agent_id = $2' : ' WHERE cs.agent_id = $1';
      params.push(req.user.id);
    }

    query += ' GROUP BY cs.id, u.name, a.name ORDER BY cs.last_message_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get a specific session by ID
router.get('/sessions/:sessionId', optionalAuthenticate, async (req, res) => {
  try {
    const { sessionId } = req.params;

    const result = await pool.query(
      `SELECT cs.*, 
              u.name as customer_display_name,
              a.name as agent_name
       FROM chat_sessions cs
       LEFT JOIN users u ON cs.customer_id = u.id
       LEFT JOIN users a ON cs.agent_id = a.id
       WHERE cs.id = $1`,
      [sessionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const session = result.rows[0];
    
    // Check access permissions if user is authenticated
    if (req.user) {
      const hasAccess = 
        session.customer_id === req.user.id ||
        session.agent_id === req.user.id ||
        req.user.role === 'admin';

      if (!hasAccess) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Get messages for a session
router.get('/sessions/:sessionId/messages', optionalAuthenticate, async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Verify user has access to this session
    const sessionCheck = await pool.query(
      'SELECT * FROM chat_sessions WHERE id = $1',
      [sessionId]
    );

    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const session = sessionCheck.rows[0];
    
    // Check access permissions
    if (req.user) {
      const hasAccess = 
        session.customer_id === req.user.id ||
        session.agent_id === req.user.id ||
        req.user.role === 'admin';

      if (!hasAccess) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    // Get messages
    const result = await pool.query(
      `SELECT cm.*, u.name as sender_name 
       FROM chat_messages cm
       LEFT JOIN users u ON cm.sender_id = u.id
       WHERE cm.session_id = $1
       ORDER BY cm.created_at ASC`,
      [sessionId]
    );

    // Mark messages as read for the current user
    if (req.user) {
      const senderType = req.user.role === 'customer' ? 'agent' : 'customer';
      await pool.query(
        `UPDATE chat_messages 
         SET is_read = true 
         WHERE session_id = $1 AND sender_type = $2 AND is_read = false`,
        [sessionId, senderType]
      );
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send message in a session
router.post('/sessions/:sessionId/messages', optionalAuthenticate, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Verify session exists
    const sessionCheck = await pool.query(
      'SELECT * FROM chat_sessions WHERE id = $1',
      [sessionId]
    );

    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const session = sessionCheck.rows[0];
    const senderId = req.user?.id || null;
    const senderType = req.user?.role === 'admin' || req.user?.role === 'support' ? 'agent' : 'customer';

    // Insert message
    const messageResult = await pool.query(
      `INSERT INTO chat_messages (session_id, sender_id, sender_type, message) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [sessionId, senderId, senderType, message.trim()]
    );

    // Update session's last_message_at
    await pool.query(
      'UPDATE chat_sessions SET last_message_at = CURRENT_TIMESTAMP WHERE id = $1',
      [sessionId]
    );

    // If this is the first agent message and session was waiting, update status
    if (senderType === 'agent' && session.status === 'waiting') {
      await pool.query(
        'UPDATE chat_sessions SET status = $1, agent_id = $2 WHERE id = $3',
        ['active', senderId, sessionId]
      );
    }

    res.status(201).json(messageResult.rows[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Assign agent to session
router.patch('/sessions/:sessionId/assign', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'support') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { sessionId } = req.params;
    const agentId = req.user.id;

    // Check agent's capacity
    const capacityCheck = await pool.query(
      'SELECT * FROM agent_status WHERE agent_id = $1 AND active_chats < max_chats',
      [agentId]
    );

    if (capacityCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Agent at maximum capacity' });
    }

    // Assign agent and update status
    await pool.query(
      'UPDATE chat_sessions SET agent_id = $1, status = $2 WHERE id = $3',
      [agentId, 'active', sessionId]
    );

    // Update agent's active chats
    await pool.query(
      'UPDATE agent_status SET active_chats = active_chats + 1 WHERE agent_id = $1',
      [agentId]
    );

    res.json({ message: 'Agent assigned successfully' });
  } catch (error) {
    console.error('Error assigning agent:', error);
    res.status(500).json({ error: 'Failed to assign agent' });
  }
});

// Close chat session
router.patch('/sessions/:sessionId/close', optionalAuthenticate, async (req, res) => {
  try {
    const { sessionId } = req.params;

    const sessionCheck = await pool.query(
      'SELECT * FROM chat_sessions WHERE id = $1',
      [sessionId]
    );

    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const session = sessionCheck.rows[0];

    // Only customer, assigned agent, or admin can close
    if (req.user) {
      const canClose = 
        session.customer_id === req.user.id ||
        session.agent_id === req.user.id ||
        req.user.role === 'admin';

      if (!canClose) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    // For guests (no auth), allow closing any session (they should only know their own session ID)

    // Close session
    await pool.query(
      'UPDATE chat_sessions SET status = $1, closed_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['closed', sessionId]
    );

    // Decrease agent's active chats if there was an agent
    if (session.agent_id) {
      await pool.query(
        'UPDATE agent_status SET active_chats = GREATEST(0, active_chats - 1) WHERE agent_id = $1',
        [session.agent_id]
      );
    }

    res.json({ message: 'Session closed successfully' });
  } catch (error) {
    console.error('Error closing session:', error);
    res.status(500).json({ error: 'Failed to close session' });
  }
});

// Update agent status (online/offline)
router.post('/agent/status', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'support') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { isOnline } = req.body;

    // Upsert agent status
    const result = await pool.query(
      `INSERT INTO agent_status (agent_id, is_online, last_active) 
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (agent_id) 
       DO UPDATE SET is_online = $2, last_active = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [req.user.id, isOnline]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating agent status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Get agent status
router.get('/agent/status', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'support') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      'SELECT * FROM agent_status WHERE agent_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      // Create default status if doesn't exist
      const newStatus = await pool.query(
        `INSERT INTO agent_status (agent_id, is_online) 
         VALUES ($1, false) 
         RETURNING *`,
        [req.user.id]
      );
      return res.json(newStatus.rows[0]);
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching agent status:', error);
    res.status(500).json({ error: 'Failed to fetch status' });
  }
});

export default router;
