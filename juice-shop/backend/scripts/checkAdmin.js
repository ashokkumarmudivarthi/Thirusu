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

async function checkAdmin() {
  try {
    const client = await pool.connect();
    
    // Check admin user
    const result = await client.query(
      "SELECT id, name, email, role FROM users WHERE email = 'admin@thirusu.com'"
    );
    
    if (result.rows.length === 0) {
      console.log('❌ Admin user not found in database!');
      console.log('\nTo create admin user, run: npm run db:seed');
    } else {
      const admin = result.rows[0];
      console.log('\n✅ Admin user found:');
      console.log('='.repeat(50));
      console.log(`ID: ${admin.id}`);
      console.log(`Name: ${admin.name}`);
      console.log(`Email: ${admin.email}`);
      console.log(`Role: ${admin.role}`);
      console.log('='.repeat(50));
      
      if (admin.role === 'admin') {
        console.log('\n✅ Role is correctly set to "admin"');
        console.log('\nYou can login with:');
        console.log('  Email: admin@thirusu.com');
        console.log('  Password: admin123');
      } else {
        console.log(`\n❌ ERROR: Role is "${admin.role}" but should be "admin"`);
        console.log('\nFixing role...');
        await client.query(
          "UPDATE users SET role = 'admin' WHERE email = 'admin@thirusu.com'"
        );
        console.log('✅ Role updated to "admin"');
      }
    }
    
    client.release();
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

checkAdmin();
