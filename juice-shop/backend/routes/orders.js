import express from 'express';
import pool from '../config/database.js';
import { authenticate, authorizeAdmin, optionalAuthenticate } from '../middleware/auth.js';

const router = express.Router();

// Create new order (with stock deduction)
router.post('/', optionalAuthenticate, async (req, res) => {
  const client = await pool.connect();
  
  try {
    const {
      items,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      customerName,
      customerEmail,
      customerPhone,
      notes
    } = req.body;

    const userId = req.user?.id || null; // Allow guest checkout

    await client.query('BEGIN');

    // Validate stock availability for all items
    for (const item of items) {
      const stockCheck = await client.query(
        'SELECT stock_quantity FROM product_sizes WHERE id = $1',
        [item.productSizeId]
      );

      if (stockCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: `Product size ${item.productSizeId} not found` });
      }

      const availableStock = stockCheck.rows[0].stock_quantity;

      if (availableStock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: `Insufficient stock for ${item.productName} (${item.size})`,
          available: availableStock,
          requested: item.quantity
        });
      }
    }

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders 
       (user_id, total_amount, status, payment_method, delivery_address, customer_name, customer_email, customer_phone, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, created_at`,
      [userId, totalAmount, 'pending', paymentMethod, deliveryAddress, customerName, customerEmail, customerPhone, notes]
    );

    const orderId = orderResult.rows[0].id;

    // Create order items and deduct stock
    for (const item of items) {
      // Get product_id from product_size_id
      const productInfo = await client.query(
        'SELECT product_id FROM product_sizes WHERE id = $1',
        [item.productSizeId]
      );
      const productId = productInfo.rows[0]?.product_id || null;

      // Insert order item
      await client.query(
        `INSERT INTO order_items 
         (order_id, product_id, product_size_id, product_name, size, quantity, price)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [orderId, productId, item.productSizeId, item.productName, item.size, item.quantity, item.price]
      );

      // Get current stock
      const currentStock = await client.query(
        'SELECT stock_quantity FROM product_sizes WHERE id = $1',
        [item.productSizeId]
      );

      const previousStock = currentStock.rows[0].stock_quantity;
      const newStock = previousStock - item.quantity;

      // Deduct stock
      await client.query(
        'UPDATE product_sizes SET stock_quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [newStock, item.productSizeId]
      );

      // Log stock change
      await client.query(
        `INSERT INTO stock_history 
         (product_size_id, previous_stock, new_stock, change_amount, change_type, changed_by, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          item.productSizeId,
          previousStock,
          newStock,
          -item.quantity,
          'sale',
          userId,
          `Order #${orderId}`
        ]
      );
    }

    await client.query('COMMIT');

    // Generate order number
    const orderNumber = `ORD-${orderId.toString().padStart(6, '0')}`;

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: orderId,
        order_number: orderNumber,
        created_at: orderResult.rows[0].created_at,
        status: 'pending',
        total_amount: totalAmount
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    client.release();
  }
});

// Get user's orders
router.get('/my-orders', authenticate, async (req, res) => {
  try {
    console.log('Fetching orders for user:', req.user.id);
    
    const result = await pool.query(
      `SELECT 
        o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'productName', oi.product_name,
            'size', oi.size,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    console.log('Found orders:', result.rows.length);
    console.log('Orders data:', JSON.stringify(result.rows, null, 2));

    res.json({ orders: result.rows });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order details
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'productName', oi.product_name,
            'size', oi.size,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.id = $1 AND (o.user_id = $2 OR $3 = 'admin')
       GROUP BY o.id`,
      [id, req.user.id, req.user.role]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order: result.rows[0] });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Admin: Get all orders
router.get('/admin/all', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        o.id,
        o.total_amount,
        o.status,
        o.payment_method,
        o.delivery_address,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.estimated_delivery_date,
        o.created_at,
        o.updated_at,
        COUNT(oi.id) as item_count,
        json_agg(
          json_build_object(
            'id', oi.id,
            'productName', oi.product_name,
            'size', oi.size,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       GROUP BY o.id
       ORDER BY o.created_at DESC`
    );

    res.json({ orders: result.rows });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Admin: Update order status
router.patch('/admin/:id/status', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, estimatedDeliveryDate } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    let query, params;
    if (estimatedDeliveryDate) {
      query = 'UPDATE orders SET status = $1, estimated_delivery_date = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *';
      params = [status, estimatedDeliveryDate, id];
    } else {
      query = 'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
      params = [status, id];
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order: result.rows[0] });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;
