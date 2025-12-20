import express from 'express';
import pool from '../config/database.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all products with stock information
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.short_description,
        p.long_description,
        p.category,
        p.base_price,
        p.image_url,
        p.is_active,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', ps.id,
                'size', ps.size,
                'price', ps.price,
                'stock', ps.stock_quantity,
                'calories', ps.calories,
                'protein', ps.protein,
                'carbs', ps.carbs,
                'sugar', ps.sugar,
                'vitaminC', ps.vitamin_c,
                'servingSize', ps.serving_size,
                'inStock', CASE WHEN ps.stock_quantity > 0 THEN true ELSE false END
              ) ORDER BY ps.size
            )
            FROM product_sizes ps
            WHERE ps.product_id = p.id
          ),
          '[]'::json
        ) as sizes,
        COALESCE(
          (
            SELECT array_agg(DISTINCT pi.ingredient)
            FROM product_ingredients pi
            WHERE pi.product_id = p.id
          ),
          ARRAY[]::text[]
        ) as ingredients
      FROM products p
      WHERE p.is_active = true
      ORDER BY p.id
    `);

    res.json({ products: result.rows });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product with stock
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.short_description,
        p.long_description,
        p.category,
        p.base_price,
        p.image_url,
        p.is_active,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', ps.id,
                'size', ps.size,
                'price', ps.price,
                'stock', ps.stock_quantity,
                'calories', ps.calories,
                'protein', ps.protein,
                'carbs', ps.carbs,
                'sugar', ps.sugar,
                'vitaminC', ps.vitamin_c,
                'servingSize', ps.serving_size,
                'inStock', CASE WHEN ps.stock_quantity > 0 THEN true ELSE false END
              ) ORDER BY ps.size
            )
            FROM product_sizes ps
            WHERE ps.product_id = p.id
          ),
          '[]'::json
        ) as sizes,
        COALESCE(
          (
            SELECT array_agg(DISTINCT pi.ingredient)
            FROM product_ingredients pi
            WHERE pi.product_id = p.id
          ),
          ARRAY[]::text[]
        ) as ingredients
      FROM products p
      WHERE p.id = $1 AND p.is_active = true
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product: result.rows[0] });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Admin: Update stock for a product size
router.put('/stock/:productSizeId', authenticate, authorizeAdmin, async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { productSizeId } = req.params;
    const { stockQuantity, notes } = req.body;

    await client.query('BEGIN');

    // Get current stock
    const currentStock = await client.query(
      'SELECT stock_quantity FROM product_sizes WHERE id = $1',
      [productSizeId]
    );

    if (currentStock.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Product size not found' });
    }

    const previousStock = currentStock.rows[0].stock_quantity;
    const changeAmount = stockQuantity - previousStock;

    // Update stock
    await client.query(
      'UPDATE product_sizes SET stock_quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [stockQuantity, productSizeId]
    );

    // Log stock history
    await client.query(
      `INSERT INTO stock_history 
       (product_size_id, previous_stock, new_stock, change_amount, change_type, changed_by, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        productSizeId,
        previousStock,
        stockQuantity,
        changeAmount,
        changeAmount > 0 ? 'restock' : 'adjustment',
        req.user.id,
        notes || 'Manual stock update'
      ]
    );

    await client.query('COMMIT');

    res.json({
      message: 'Stock updated successfully',
      previousStock,
      newStock: stockQuantity,
      changeAmount
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update stock error:', error);
    res.status(500).json({ error: 'Failed to update stock' });
  } finally {
    client.release();
  }
});

// Admin: Bulk update stocks for multiple products
router.post('/stock/bulk-update', authenticate, authorizeAdmin, async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { updates } = req.body; // Array of { productSizeId, stockQuantity }

    await client.query('BEGIN');

    const results = [];

    for (const update of updates) {
      const { productSizeId, stockQuantity } = update;

      // Get current stock
      const currentStock = await client.query(
        'SELECT stock_quantity FROM product_sizes WHERE id = $1',
        [productSizeId]
      );

      if (currentStock.rows.length > 0) {
        const previousStock = currentStock.rows[0].stock_quantity;
        const changeAmount = stockQuantity - previousStock;

        // Update stock
        await client.query(
          'UPDATE product_sizes SET stock_quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [stockQuantity, productSizeId]
        );

        // Log history
        await client.query(
          `INSERT INTO stock_history 
           (product_size_id, previous_stock, new_stock, change_amount, change_type, changed_by, notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [productSizeId, previousStock, stockQuantity, changeAmount, 'bulk_update', req.user.id, 'Bulk stock update']
        );

        results.push({ productSizeId, success: true, previousStock, newStock: stockQuantity });
      }
    }

    await client.query('COMMIT');

    res.json({
      message: 'Bulk stock update completed',
      results
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Bulk update stock error:', error);
    res.status(500).json({ error: 'Failed to update stocks' });
  } finally {
    client.release();
  }
});

// Admin: Get stock history
router.get('/stock/history/:productSizeId', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { productSizeId } = req.params;

    const result = await pool.query(`
      SELECT 
        sh.*,
        u.name as changed_by_name,
        p.name as product_name,
        ps.size
      FROM stock_history sh
      LEFT JOIN users u ON sh.changed_by = u.id
      LEFT JOIN product_sizes ps ON sh.product_size_id = ps.id
      LEFT JOIN products p ON ps.product_id = p.id
      WHERE sh.product_size_id = $1
      ORDER BY sh.created_at DESC
      LIMIT 50
    `, [productSizeId]);

    res.json({ history: result.rows });
  } catch (error) {
    console.error('Get stock history error:', error);
    res.status(500).json({ error: 'Failed to fetch stock history' });
  }
});

export default router;
