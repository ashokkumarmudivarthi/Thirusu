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

    // Create Scrolling Offers table (for top banner)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS scrolling_offers (
        id SERIAL PRIMARY KEY,
        text VARCHAR(500) NOT NULL,
        icon VARCHAR(50),
        is_active BOOLEAN DEFAULT true,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Scrolling Offers table created');

    // Create Password Reset Tokens table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Password Reset Tokens table created');

    // Insert default offers if table is empty
    const { rows: existingOffers } = await pool.query('SELECT COUNT(*) FROM scrolling_offers');
    if (parseInt(existingOffers[0].count) === 0) {
      await pool.query(`
        INSERT INTO scrolling_offers (text, icon, is_active, display_order) VALUES
        ('FREE SHIPPING ON ORDERS OVER $50', '🎉', true, 1),
        ('FRESH COLD-PRESSED DAILY', '🍹', true, 2),
        ('100% ORGANIC INGREDIENTS', '💚', true, 3),
        ('LIMITED TIME: 20% OFF YOUR FIRST ORDER', '⚡', true, 4),
        ('SUBSCRIBE & SAVE UP TO 25%', '🎁', true, 5),
        ('SAME DAY DELIVERY AVAILABLE', '🚀', true, 6),
        ('NEW FLAVORS EVERY WEEK', '🌟', true, 7);
      `);
      console.log('✅ Default offers inserted');
    }

    // Create Chat Sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES users(id),
        agent_id INTEGER REFERENCES users(id),
        customer_name VARCHAR(255),
        customer_email VARCHAR(255),
        status VARCHAR(50) DEFAULT 'waiting',
        subject VARCHAR(255),
        last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        closed_at TIMESTAMP
      );
    `);
    console.log('✅ Chat Sessions table created');

    // Create Chat Messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        session_id INTEGER REFERENCES chat_sessions(id) ON DELETE CASCADE,
        sender_id INTEGER REFERENCES users(id),
        sender_type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Chat Messages table created');

    // Create Agent Status table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS agent_status (
        id SERIAL PRIMARY KEY,
        agent_id INTEGER REFERENCES users(id) UNIQUE,
        is_online BOOLEAN DEFAULT false,
        last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        active_chats INTEGER DEFAULT 0,
        max_chats INTEGER DEFAULT 5,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Agent Status table created');

    // Create Predefined Queries table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS predefined_queries (
        id SERIAL PRIMARY KEY,
        question VARCHAR(500) NOT NULL,
        answer TEXT NOT NULL,
        category VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Predefined Queries table created');

    // Insert default predefined queries
    const { rows: existingQueries } = await pool.query('SELECT COUNT(*) FROM predefined_queries');
    if (parseInt(existingQueries[0].count) === 0) {
      await pool.query(`
        INSERT INTO predefined_queries (question, answer, category, is_active, display_order) VALUES
        ('What are your delivery hours?', 'We deliver from 8 AM to 10 PM daily. Same-day delivery is available for orders placed before 2 PM.', 'Delivery', true, 1),
        ('How do I track my order?', 'You can track your order by logging into your account and visiting the "My Orders" page. You''ll see real-time updates on your order status.', 'Orders', true, 2),
        ('What is your return policy?', 'We offer a 100% satisfaction guarantee. If you''re not happy with your juice, contact us within 24 hours for a full refund.', 'Returns', true, 3),
        ('Are your juices really organic?', 'Yes! All our juices are made from 100% certified organic ingredients. We cold-press them fresh daily.', 'Products', true, 4),
        ('Do you offer subscriptions?', 'Yes! Subscribe and save up to 25%. You can customize your delivery frequency and cancel anytime.', 'Subscriptions', true, 5),
        ('What sizes do you offer?', 'We offer 250ml, 500ml, and 1L bottles. Perfect for any occasion!', 'Products', true, 6);
      `);
      console.log('✅ Default predefined queries inserted');
    }

    // Create Addresses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS addresses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        label VARCHAR(100),
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        address_line1 VARCHAR(255) NOT NULL,
        address_line2 VARCHAR(255),
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        country VARCHAR(100) DEFAULT 'USA',
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Addresses table created');

    // Create Coupons table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS coupons (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        discount_type VARCHAR(20) NOT NULL,
        discount_value DECIMAL(10, 2) NOT NULL,
        min_order_value DECIMAL(10, 2) DEFAULT 0,
        max_discount DECIMAL(10, 2),
        usage_limit INTEGER,
        used_count INTEGER DEFAULT 0,
        valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        valid_until TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Coupons table created');

    // Create Coupon Usage table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS coupon_usage (
        id SERIAL PRIMARY KEY,
        coupon_id INTEGER REFERENCES coupons(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id),
        order_id INTEGER REFERENCES orders(id),
        discount_amount DECIMAL(10, 2) NOT NULL,
        used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Coupon Usage table created');

    // Insert default coupons
    const { rows: existingCoupons } = await pool.query('SELECT COUNT(*) FROM coupons');
    if (parseInt(existingCoupons[0].count) === 0) {
      await pool.query(`
        INSERT INTO coupons (code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, valid_until) VALUES
        ('WELCOME20', 'Welcome! Get 20% off your first order', 'percentage', 20.00, 30.00, 50.00, 1000, NOW() + INTERVAL '30 days'),
        ('SAVE10', 'Save $10 on orders over $50', 'fixed', 10.00, 50.00, NULL, NULL, NOW() + INTERVAL '60 days'),
        ('FRESH25', 'Fresh juice lovers get 25% off', 'percentage', 25.00, 100.00, 75.00, 500, NOW() + INTERVAL '90 days'),
        ('FREESHIP', 'Free shipping on orders over $40', 'percentage', 100.00, 40.00, 15.00, NULL, NOW() + INTERVAL '180 days');
      `);
      console.log('✅ Default coupons inserted');
    }

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
      CREATE INDEX IF NOT EXISTS idx_product_sizes_product_id ON product_sizes(product_id);
      CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
      CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
      CREATE INDEX IF NOT EXISTS idx_scrolling_offers_active ON scrolling_offers(is_active, display_order);
      CREATE INDEX IF NOT EXISTS idx_chat_sessions_customer ON chat_sessions(customer_id);
      CREATE INDEX IF NOT EXISTS idx_chat_sessions_agent ON chat_sessions(agent_id);
      CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
      CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
      CREATE INDEX IF NOT EXISTS idx_agent_status_online ON agent_status(is_online);
      CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);
      CREATE INDEX IF NOT EXISTS idx_addresses_default ON addresses(is_default);
      CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
      CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active, valid_until);
      CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon ON coupon_usage(coupon_id);
      CREATE INDEX IF NOT EXISTS idx_coupon_usage_user ON coupon_usage(user_id);
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
