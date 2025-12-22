import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function checkStock() {
  try {
    const client = await pool.connect();
    
    // Check product stock
    const result = await client.query(`
      SELECT 
        p.id,
        p.name,
        ps.size,
        ps.stock_quantity,
        CASE WHEN ps.stock_quantity > 0 THEN true ELSE false END as in_stock
      FROM products p
      LEFT JOIN product_sizes ps ON p.id = ps.product_id
      WHERE p.is_active = true
      ORDER BY p.id, ps.size
      LIMIT 20
    `);
    
    console.log('\n📦 Product Stock Status:');
    console.log('='.repeat(80));
    
    let currentProduct = null;
    result.rows.forEach(row => {
      if (currentProduct !== row.name) {
        console.log(`\n${row.name} (ID: ${row.id})`);
        currentProduct = row.name;
      }
      const stockStatus = row.in_stock ? '✅ IN STOCK' : '❌ OUT OF STOCK';
      console.log(`  ${row.size}: ${row.stock_quantity} units - ${stockStatus}`);
    });
    
    // Summary
    const summary = await client.query(`
      SELECT 
        COUNT(DISTINCT ps.product_id) as total_products,
        COUNT(CASE WHEN ps.stock_quantity > 0 THEN 1 END) as in_stock_sizes,
        COUNT(CASE WHEN ps.stock_quantity = 0 THEN 1 END) as out_of_stock_sizes
      FROM product_sizes ps
      JOIN products p ON ps.product_id = p.id
      WHERE p.is_active = true
    `);
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 Summary:');
    console.log(`Total Products: ${summary.rows[0].total_products}`);
    console.log(`In Stock Sizes: ${summary.rows[0].in_stock_sizes}`);
    console.log(`Out of Stock Sizes: ${summary.rows[0].out_of_stock_sizes}`);
    
    client.release();
    await pool.end();
  } catch (error) {
    console.error('❌ Error checking stock:', error);
    await pool.end();
    process.exit(1);
  }
}

checkStock();
