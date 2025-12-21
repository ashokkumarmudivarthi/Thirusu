import express from 'express';
import pool from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all addresses for a user
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

// Get a single address
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM addresses WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get address error:', error);
    res.status(500).json({ error: 'Failed to fetch address' });
  }
});

// Create a new address
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      label,
      full_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      is_default
    } = req.body;

    // Validate required fields
    if (!full_name || !phone || !address_line1 || !city || !state || !postal_code) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // If this is set as default, unset other defaults
    if (is_default) {
      await pool.query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1',
        [req.user.id]
      );
    }

    const result = await pool.query(
      `INSERT INTO addresses (
        user_id, label, full_name, phone, address_line1, address_line2,
        city, state, postal_code, country, is_default
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        req.user.id,
        label || 'Home',
        full_name,
        phone,
        address_line1,
        address_line2 || '',
        city,
        state,
        postal_code,
        country || 'USA',
        is_default || false
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({ error: 'Failed to create address' });
  }
});

// Update an address
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      label,
      full_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      is_default
    } = req.body;

    // Check if address belongs to user
    const addressCheck = await pool.query(
      'SELECT * FROM addresses WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (addressCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // If this is set as default, unset other defaults
    if (is_default) {
      await pool.query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1 AND id != $2',
        [req.user.id, id]
      );
    }

    const result = await pool.query(
      `UPDATE addresses SET
        label = COALESCE($1, label),
        full_name = COALESCE($2, full_name),
        phone = COALESCE($3, phone),
        address_line1 = COALESCE($4, address_line1),
        address_line2 = COALESCE($5, address_line2),
        city = COALESCE($6, city),
        state = COALESCE($7, state),
        postal_code = COALESCE($8, postal_code),
        country = COALESCE($9, country),
        is_default = COALESCE($10, is_default),
        updated_at = NOW()
      WHERE id = $11 AND user_id = $12
      RETURNING *`,
      [
        label,
        full_name,
        phone,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        is_default,
        id,
        req.user.id
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ error: 'Failed to update address' });
  }
});

// Delete an address
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

// Set address as default
router.patch('/:id/set-default', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if address belongs to user
    const addressCheck = await pool.query(
      'SELECT * FROM addresses WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (addressCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // Unset all defaults
    await pool.query(
      'UPDATE addresses SET is_default = false WHERE user_id = $1',
      [req.user.id]
    );

    // Set this as default
    const result = await pool.query(
      'UPDATE addresses SET is_default = true, updated_at = NOW() WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({ error: 'Failed to set default address' });
  }
});

export default router;
