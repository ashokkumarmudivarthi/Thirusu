import express from 'express';
import pool from '../config/database.js';
import { authenticate, authorizeAdmin, optionalAuthenticate } from '../middleware/auth.js';

const router = express.Router();

// Validate and apply coupon code
router.post('/validate', optionalAuthenticate, async (req, res) => {
  try {
    const { code, orderValue } = req.body;
    const userId = req.user?.id || null;

    if (!code || !orderValue) {
      return res.status(400).json({ error: 'Coupon code and order value are required' });
    }

    // Find the coupon
    const couponResult = await pool.query(
      `SELECT * FROM coupons 
       WHERE UPPER(code) = UPPER($1) 
       AND is_active = true 
       AND (valid_until IS NULL OR valid_until > NOW())
       AND (valid_from IS NULL OR valid_from <= NOW())`,
      [code]
    );

    if (couponResult.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid or expired coupon code' });
    }

    const coupon = couponResult.rows[0];

    // Check minimum order value
    if (orderValue < coupon.min_order_value) {
      return res.status(400).json({ 
        error: `Minimum order value of $${coupon.min_order_value} required` 
      });
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return res.status(400).json({ error: 'This coupon has reached its usage limit' });
    }

    // Check user-specific usage (for first-order coupons like WELCOME20)
    if (userId && coupon.code.toUpperCase().includes('WELCOME')) {
      const userUsage = await pool.query(
        'SELECT COUNT(*) FROM coupon_usage WHERE coupon_id = $1 AND user_id = $2',
        [coupon.id, userId]
      );

      if (parseInt(userUsage.rows[0].count) > 0) {
        return res.status(400).json({ error: 'This welcome coupon can only be used once per user' });
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (orderValue * coupon.discount_value) / 100;
      if (coupon.max_discount) {
        discountAmount = Math.min(discountAmount, coupon.max_discount);
      }
    } else if (coupon.discount_type === 'fixed') {
      discountAmount = coupon.discount_value;
    }

    // Ensure discount doesn't exceed order value
    discountAmount = Math.min(discountAmount, orderValue);

    res.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount_amount: Number(discountAmount.toFixed(2)),
        final_amount: Number((orderValue - discountAmount).toFixed(2))
      }
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ error: 'Failed to validate coupon' });
  }
});

// Record coupon usage when order is placed
router.post('/use', optionalAuthenticate, async (req, res) => {
  try {
    const { couponId, orderId, discountAmount } = req.body;
    const userId = req.user?.id || null;

    if (!couponId || !discountAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Record usage
    await pool.query(
      `INSERT INTO coupon_usage (coupon_id, user_id, order_id, discount_amount)
       VALUES ($1, $2, $3, $4)`,
      [couponId, userId, orderId, discountAmount]
    );

    // Increment used count
    await pool.query(
      'UPDATE coupons SET used_count = used_count + 1 WHERE id = $1',
      [couponId]
    );

    res.json({ message: 'Coupon usage recorded' });
  } catch (error) {
    console.error('Record coupon usage error:', error);
    res.status(500).json({ error: 'Failed to record coupon usage' });
  }
});

// Get all active coupons (public - for display on site)
router.get('/active', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, code, description, discount_type, discount_value, min_order_value, 
              max_discount, valid_until
       FROM coupons 
       WHERE is_active = true 
       AND (valid_until IS NULL OR valid_until > NOW())
       ORDER BY created_at DESC`
    );

    res.json({ coupons: result.rows });
  } catch (error) {
    console.error('Get active coupons error:', error);
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
});

// Admin: Get all coupons
router.get('/admin/all', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, 
              COUNT(cu.id) as total_usage,
              COALESCE(SUM(cu.discount_amount), 0) as total_discount_given
       FROM coupons c
       LEFT JOIN coupon_usage cu ON c.id = cu.coupon_id
       GROUP BY c.id
       ORDER BY c.created_at DESC`
    );

    res.json({ coupons: result.rows });
  } catch (error) {
    console.error('Get all coupons error:', error);
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
});

// Admin: Create coupon
router.post('/admin/create', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const {
      code,
      description,
      discount_type,
      discount_value,
      min_order_value,
      max_discount,
      usage_limit,
      valid_until
    } = req.body;

    if (!code || !discount_type || !discount_value) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['percentage', 'fixed'].includes(discount_type)) {
      return res.status(400).json({ error: 'Invalid discount type' });
    }

    const result = await pool.query(
      `INSERT INTO coupons 
       (code, description, discount_type, discount_value, min_order_value, 
        max_discount, usage_limit, valid_until)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        code.toUpperCase(),
        description,
        discount_type,
        discount_value,
        min_order_value || 0,
        max_discount || null,
        usage_limit || null,
        valid_until || null
      ]
    );

    res.status(201).json({ 
      message: 'Coupon created successfully',
      coupon: result.rows[0] 
    });
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ error: 'Coupon code already exists' });
    }
    console.error('Create coupon error:', error);
    res.status(500).json({ error: 'Failed to create coupon' });
  }
});

// Admin: Update coupon
router.put('/admin/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      description,
      discount_type,
      discount_value,
      min_order_value,
      max_discount,
      usage_limit,
      valid_until,
      is_active
    } = req.body;

    const result = await pool.query(
      `UPDATE coupons SET
        description = COALESCE($1, description),
        discount_type = COALESCE($2, discount_type),
        discount_value = COALESCE($3, discount_value),
        min_order_value = COALESCE($4, min_order_value),
        max_discount = COALESCE($5, max_discount),
        usage_limit = COALESCE($6, usage_limit),
        valid_until = COALESCE($7, valid_until),
        is_active = COALESCE($8, is_active),
        updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [
        description,
        discount_type,
        discount_value,
        min_order_value,
        max_discount,
        usage_limit,
        valid_until,
        is_active,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    res.json({ 
      message: 'Coupon updated successfully',
      coupon: result.rows[0] 
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ error: 'Failed to update coupon' });
  }
});

// Admin: Delete coupon
router.delete('/admin/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM coupons WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ error: 'Failed to delete coupon' });
  }
});

// Admin: Toggle coupon status
router.patch('/admin/:id/toggle', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE coupons SET is_active = NOT is_active, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    res.json({ 
      message: `Coupon ${result.rows[0].is_active ? 'activated' : 'deactivated'}`,
      coupon: result.rows[0] 
    });
  } catch (error) {
    console.error('Toggle coupon error:', error);
    res.status(500).json({ error: 'Failed to toggle coupon status' });
  }
});

export default router;
