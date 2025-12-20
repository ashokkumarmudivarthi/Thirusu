import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'thirusu',
  password: 'admin',
  port: 5432
});

async function checkOrders() {
  try {
    const userId = 2; // The user you're logged in as
    
    // Check orders for this user
    const result = await pool.query(`
      SELECT 
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
       ORDER BY o.created_at DESC
    `, [userId]);
    
    console.log(`Found ${result.rows.length} orders for user ${userId}`);
    console.log('Orders:', JSON.stringify(result.rows, null, 2));
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error);
    await pool.end();
    process.exit(1);
  }
}

checkOrders();
