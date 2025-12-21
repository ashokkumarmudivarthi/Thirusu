import express from 'express';
import pool from '../config/database.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all active offers (public route)
router.get('/active', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM scrolling_offers WHERE is_active = true ORDER BY display_order ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching active offers:', error);
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

// Get all offers (admin only)
router.get('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM scrolling_offers ORDER BY display_order ASC, id DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

// Create new offer (admin only)
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { text, icon, is_active, display_order } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Offer text is required' });
    }

    const result = await pool.query(
      `INSERT INTO scrolling_offers (text, icon, is_active, display_order) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [text, icon || '', is_active !== false, display_order || 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ error: 'Failed to create offer' });
  }
});

// Update offer (admin only)
router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { text, icon, is_active, display_order } = req.body;

    const result = await pool.query(
      `UPDATE scrolling_offers 
       SET text = COALESCE($1, text),
           icon = COALESCE($2, icon),
           is_active = COALESCE($3, is_active),
           display_order = COALESCE($4, display_order),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [text, icon, is_active, display_order, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).json({ error: 'Failed to update offer' });
  }
});

// Toggle offer active status (admin only)
router.patch('/:id/toggle', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE scrolling_offers 
       SET is_active = NOT is_active,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error toggling offer:', error);
    res.status(500).json({ error: 'Failed to toggle offer' });
  }
});

// Delete offer (admin only)
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM scrolling_offers WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    res.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    console.error('Error deleting offer:', error);
    res.status(500).json({ error: 'Failed to delete offer' });
  }
});

// Reorder offers (admin only)
router.post('/reorder', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { offers } = req.body; // Array of {id, display_order}

    if (!Array.isArray(offers)) {
      return res.status(400).json({ error: 'Offers must be an array' });
    }

    // Update each offer's display order
    for (const offer of offers) {
      await pool.query(
        'UPDATE scrolling_offers SET display_order = $1 WHERE id = $2',
        [offer.display_order, offer.id]
      );
    }

    res.json({ message: 'Offers reordered successfully' });
  } catch (error) {
    console.error('Error reordering offers:', error);
    res.status(500).json({ error: 'Failed to reorder offers' });
  }
});

export default router;
