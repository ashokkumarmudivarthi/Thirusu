import pool from '../config/database.js';

const setupDatabase = async () => {
  try {
    console.log('🚀 Setting up database schema...');

    // Create Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created');

    // Create Products table with stock
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        short_description VARCHAR(500),
        long_description TEXT,
        category VARCHAR(100),
        base_price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Products table created');

    // Create Product Sizes table (250ml, 500ml, 1L)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS product_sizes (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        size VARCHAR(50) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        stock_quantity INTEGER DEFAULT 0,
        calories INTEGER,
        protein VARCHAR(20),
        carbs VARCHAR(20),
        sugar VARCHAR(20),
        vitamin_c VARCHAR(20),
        serving_size VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(product_id, size)
      );
    `);
    console.log('✅ Product Sizes table created');

    // Create Product Ingredients table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS product_ingredients (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        ingredient VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Product Ingredients table created');

    // Create Orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        payment_method VARCHAR(100),
        delivery_address TEXT,
        customer_name VARCHAR(255),
        customer_email VARCHAR(255),
        customer_phone VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Orders table created');

    // Create Order Items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        product_size_id INTEGER REFERENCES product_sizes(id),
        product_name VARCHAR(255),
        size VARCHAR(50),
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Order Items table created');

    // Create Stock History table (for admin tracking)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stock_history (
        id SERIAL PRIMARY KEY,
        product_size_id INTEGER REFERENCES product_sizes(id),
        previous_stock INTEGER,
        new_stock INTEGER,
        change_amount INTEGER,
        change_type VARCHAR(50),
        changed_by INTEGER REFERENCES users(id),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Stock History table created');

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
      CREATE INDEX IF NOT EXISTS idx_product_sizes_product_id ON product_sizes(product_id);
      CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
      CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
    `);
    console.log('✅ Indexes created');

    console.log('🎉 Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
};

setupDatabase();
