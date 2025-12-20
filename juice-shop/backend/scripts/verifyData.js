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

async function verify() {
  try {
    const client = await pool.connect();
    
    // Total products
    const productsResult = await client.query('SELECT COUNT(*) as total FROM products');
    console.log(`\n📦 Total products in database: ${productsResult.rows[0].total}`);
    
    // Total sizes
    const sizesResult = await client.query('SELECT COUNT(*) as total FROM product_sizes');
    console.log(`📏 Total product sizes: ${sizesResult.rows[0].total}`);
    
    // Check Apple Juice stock
    const appleResult = await client.query(`
      SELECT p.name, ps.size, ps.stock_quantity, ps.price
      FROM products p 
      JOIN product_sizes ps ON p.id = ps.product_id 
      WHERE p.name LIKE 'Apple%' 
      ORDER BY ps.size
    `);
    
    console.log('\n🍎 Apple Juice Cleanse Stock:');
    appleResult.rows.forEach(row => {
      console.log(`   ${row.size}: ${row.stock_quantity} units @ ₹${row.price}`);
    });
    
    // Check products with zero stock
    const zeroStockResult = await client.query(`
      SELECT p.name, ps.size, ps.stock_quantity
      FROM products p 
      JOIN product_sizes ps ON p.id = ps.product_id 
      WHERE ps.stock_quantity = 0
      LIMIT 5
    `);
    
    if (zeroStockResult.rows.length > 0) {
      console.log('\n⚠️  Products with ZERO stock:');
      zeroStockResult.rows.forEach(row => {
        console.log(`   ${row.name} (${row.size}): ${row.stock_quantity} units`);
      });
    } else {
      console.log('\n✅ All products have stock!');
    }
    
    client.release();
    await pool.end();
    
    console.log('\n✅ Verification complete!\n');
  } catch (error) {
    console.error('❌ Error:', error);
    await pool.end();
  }
}

verify();
