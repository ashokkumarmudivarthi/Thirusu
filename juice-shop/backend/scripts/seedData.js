import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seeding...');

    await client.query('BEGIN');

    // Create admin user
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    
    await client.query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (email) DO NOTHING`,
      ['Admin User', process.env.ADMIN_EMAIL || 'admin@thirusu.com', hashedPassword, 'admin']
    );
    console.log('✅ Admin user created');

    // Sample products (you can add all 46 later)
    const sampleProducts = [
      {
        name: 'Apple Juice Cleanse',
        description: 'Fresh apple & green goodness',
        short: 'Pure cold-pressed apple juice with a refreshing cleanse.',
        long: 'Our signature apple juice is made from handpicked organic apples, cold-pressed to retain maximum nutrients and natural sweetness.',
        category: 'Detox',
        basePrice: 499,
        imageUrl: '/assets/products/apple.png',
        sizes: [
          { size: '250ml', price: 299, stock: 20, calories: 120, protein: '1g', carbs: '28g', sugar: '24g', vitaminC: '40%', servingSize: '250ml' },
          { size: '500ml', price: 499, stock: 15, calories: 240, protein: '2g', carbs: '56g', sugar: '48g', vitaminC: '80%', servingSize: '500ml' },
          { size: '1L', price: 899, stock: 10, calories: 480, protein: '4g', carbs: '112g', sugar: '96g', vitaminC: '160%', servingSize: '1000ml' },
        ],
        ingredients: ['Apple']
      },
      {
        name: 'Kiwi Fruit Kick',
        description: 'Tangy kiwi & citrus burst',
        short: 'Energizing kiwifruit blend with a zesty citrus kick.',
        long: 'A vibrant combination of kiwi, orange, and lemon for a refreshing and vitamin-packed drink.',
        category: 'Detox',
        basePrice: 549,
        imageUrl: '/assets/products/kiwi.png',
        sizes: [
          { size: '250ml', price: 329, stock: 25, calories: 110, protein: '2g', carbs: '26g', sugar: '22g', vitaminC: '80%', servingSize: '250ml' },
          { size: '500ml', price: 549, stock: 18, calories: 220, protein: '4g', carbs: '52g', sugar: '44g', vitaminC: '160%', servingSize: '500ml' },
          { size: '1L', price: 999, stock: 12, calories: 440, protein: '8g', carbs: '104g', sugar: '88g', vitaminC: '320%', servingSize: '1000ml' },
        ],
        ingredients: ['Kiwi', 'Orange', 'Lemon']
      },
      {
        name: 'Orange Sunrise Boost',
        description: 'Fresh orange & vitamin C',
        short: 'Bright orange juice packed with natural vitamin C.',
        long: 'Freshly squeezed oranges deliver a burst of sunshine in every sip, perfect for your morning boost.',
        category: 'Detox',
        basePrice: 519,
        imageUrl: '/assets/products/orange.png',
        sizes: [
          { size: '250ml', price: 319, stock: 30, calories: 115, protein: '2g', carbs: '27g', sugar: '21g', vitaminC: '100%', servingSize: '250ml' },
          { size: '500ml', price: 519, stock: 20, calories: 230, protein: '4g', carbs: '54g', sugar: '42g', vitaminC: '200%', servingSize: '500ml' },
          { size: '1L', price: 949, stock: 15, calories: 460, protein: '8g', carbs: '108g', sugar: '84g', vitaminC: '400%', servingSize: '1000ml' },
        ],
        ingredients: ['Orange']
      },
      {
        name: 'Mango Magic',
        description: 'Tropical mango delight',
        short: 'Sweet and creamy mango smoothie.',
        long: 'Indulge in the rich, tropical flavor of ripe mangoes blended to perfection.',
        category: 'Smoothies',
        basePrice: 579,
        imageUrl: '/assets/products/mango.png',
        sizes: [
          { size: '250ml', price: 349, stock: 22, calories: 140, protein: '2g', carbs: '34g', sugar: '30g', vitaminC: '50%', servingSize: '250ml' },
          { size: '500ml', price: 579, stock: 16, calories: 280, protein: '4g', carbs: '68g', sugar: '60g', vitaminC: '100%', servingSize: '500ml' },
          { size: '1L', price: 1049, stock: 10, calories: 560, protein: '8g', carbs: '136g', sugar: '120g', vitaminC: '200%', servingSize: '1000ml' },
        ],
        ingredients: ['Mango']
      },
      {
        name: 'Banana Berry Blast',
        description: 'Banana & mixed berries',
        short: 'Creamy banana with berry goodness.',
        long: 'A delicious blend of ripe bananas and fresh strawberries for a satisfying smoothie.',
        category: 'Smoothies',
        basePrice: 559,
        imageUrl: '/assets/products/banana.png',
        sizes: [
          { size: '250ml', price: 339, stock: 18, calories: 135, protein: '3g', carbs: '32g', sugar: '26g', vitaminC: '45%', servingSize: '250ml' },
          { size: '500ml', price: 559, stock: 14, calories: 270, protein: '6g', carbs: '64g', sugar: '52g', vitaminC: '90%', servingSize: '500ml' },
          { size: '1L', price: 1019, stock: 8, calories: 540, protein: '12g', carbs: '128g', sugar: '104g', vitaminC: '180%', servingSize: '1000ml' },
        ],
        ingredients: ['Banana', 'Strawberry']
      }
    ];

    for (const product of sampleProducts) {
      // Insert product
      const productResult = await client.query(
        `INSERT INTO products (name, description, short_description, long_description, category, base_price, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [product.name, product.description, product.short, product.long, product.category, product.basePrice, product.imageUrl]
      );

      const productId = productResult.rows[0].id;

      // Insert sizes with stock
      for (const size of product.sizes) {
        await client.query(
          `INSERT INTO product_sizes 
           (product_id, size, price, stock_quantity, calories, protein, carbs, sugar, vitamin_c, serving_size)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [productId, size.size, size.price, size.stock, size.calories, size.protein, size.carbs, size.sugar, size.vitaminC, size.servingSize]
        );
      }

      // Insert ingredients
      for (const ingredient of product.ingredients) {
        await client.query(
          `INSERT INTO product_ingredients (product_id, ingredient) VALUES ($1, $2)`,
          [productId, ingredient]
        );
      }

      console.log(`✅ Created product: ${product.name}`);
    }

    await client.query('COMMIT');
    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📝 Default admin credentials:');
    console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@thirusu.com'}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log('');
    console.log('⚠️  Please change the admin password after first login!');
    
    process.exit(0);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    client.release();
  }
};

seedDatabase();
