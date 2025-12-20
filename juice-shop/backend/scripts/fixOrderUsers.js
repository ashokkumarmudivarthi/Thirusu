import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'thirusu',
  password: 'admin',
  port: 5432
});

async function fixOrderUsers() {
  try {
    // Update orders to link them to users based on email
    const updateResult = await pool.query(`
      UPDATE orders o 
      SET user_id = u.id 
      FROM users u 
      WHERE o.customer_email = u.email 
      AND o.user_id IS NULL
    `);
    
    console.log('✅ Updated', updateResult.rowCount, 'orders with user_id');
    
    // Show all orders
    const ordersResult = await pool.query(`
      SELECT id, customer_email, customer_name, user_id 
      FROM orders 
      ORDER BY id
    `);
    
    console.log('\nOrders after update:');
    ordersResult.rows.forEach(row => {
      console.log(`  Order #${row.id}: ${row.customer_name} (${row.customer_email}) - user_id=${row.user_id}`);
    });
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

fixOrderUsers();
