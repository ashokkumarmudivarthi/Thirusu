import express from 'express';
import pool from '../config/database.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all products with stock information, search, filters, and sorting
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      inStockOnly,
      sortBy = 'id', // id, name, price_low, price_high, newest
      limit = 100,
      offset = 0
    } = req.query;

    let whereConditions = ['p.is_active = true'];
    let queryParams = [];
    let paramIndex = 1;

    // Search by name or description
    if (search) {
      whereConditions.push(`(LOWER(p.name) LIKE $${paramIndex} OR LOWER(p.description) LIKE $${paramIndex})`);
      queryParams.push(`%${search.toLowerCase()}%`);
      paramIndex++;
    }

    // Filter by category
    if (category && category !== 'all') {
      whereConditions.push(`LOWER(p.category) = $${paramIndex}`);
      queryParams.push(category.toLowerCase());
      paramIndex++;
    }

    // Filter by price range (using base_price)
    if (minPrice) {
      whereConditions.push(`p.base_price >= $${paramIndex}`);
      queryParams.push(parseFloat(minPrice));
      paramIndex++;
    }

    if (maxPrice) {
      whereConditions.push(`p.base_price <= $${paramIndex}`);
      queryParams.push(parseFloat(maxPrice));
      paramIndex++;
    }

    // Build WHERE clause
    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    // Determine ORDER BY clause
    let orderByClause;
    switch (sortBy) {
      case 'name':
        orderByClause = 'ORDER BY p.name ASC';
        break;
      case 'price_low':
        orderByClause = 'ORDER BY p.base_price ASC';
        break;
      case 'price_high':
        orderByClause = 'ORDER BY p.base_price DESC';
        break;
      case 'newest':
        orderByClause = 'ORDER BY p.created_at DESC';
        break;
      default:
        orderByClause = 'ORDER BY p.id';
    }

    // Add LIMIT and OFFSET to params
    queryParams.push(parseInt(limit));
    const limitParam = paramIndex++;
    queryParams.push(parseInt(offset));
    const offsetParam = paramIndex++;

    const query = `
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
        p.created_at,
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
      ${whereClause}
      ${orderByClause}
      LIMIT $${limitParam} OFFSET $${offsetParam}
    `;

    const result = await pool.query(query, queryParams);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      ${whereClause}
    `;
    const countResult = await pool.query(countQuery, queryParams.slice(0, -2)); // Remove limit and offset params

    // Filter out products with no stock if inStockOnly is true
    let products = result.rows;
    if (inStockOnly === 'true') {
      products = products.filter(product => 
        product.sizes && product.sizes.some(size => size.inStock)
      );
    }

    res.json({ 
      products,
      total: parseInt(countResult.rows[0].total),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Search suggestions for autocomplete
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    const result = await pool.query(`
      SELECT 
        id,
        name,
        category,
        base_price,
        image_url
      FROM products
      WHERE is_active = true 
        AND (LOWER(name) LIKE $1 OR LOWER(category) LIKE $1)
      ORDER BY name ASC
      LIMIT 10
    `, [`%${q.toLowerCase()}%`]);

    res.json({ suggestions: result.rows });
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
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
