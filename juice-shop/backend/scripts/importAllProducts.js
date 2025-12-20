import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Import the products data by reading the frontend file
const productsFilePath = join(__dirname, '../../src/utils/products.js');
const productsFileContent = fs.readFileSync(productsFilePath, 'utf-8');

// Extract the products array using regex
const productsMatch = productsFileContent.match(/export const products = (\[[\s\S]*?\]);/);
if (!productsMatch) {
  console.error('❌ Could not parse products.js file');
  process.exit(1);
}

// Safely evaluate the products array
const productsArrayString = productsMatch[1];
const products = eval(productsArrayString);

async function importAllProducts() {
  try {
    console.log('🚀 Starting import of all products...\n');

    // Connect to database
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database\n');

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      try {
        // Check if product already exists
        const existingProduct = await client.query(
          'SELECT id FROM products WHERE name = $1',
          [product.name]
        );

        let productId;

        if (existingProduct.rows.length > 0) {
          // Update existing product
          productId = existingProduct.rows[0].id;
          
          await client.query(
            `UPDATE products 
             SET description = $1, 
                 short_description = $2, 
                 long_description = $3, 
                 category = $4, 
                 base_price = $5, 
                 image_url = $6,
                 updated_at = NOW()
             WHERE id = $7`,
            [
              product.long || product.short,
              product.short,
              product.long,
              product.category,
              product.price,
              product.image,
              productId
            ]
          );
          updated++;
          console.log(`🔄 Updated: ${product.name}`);
        } else {
          // Insert new product
          const result = await client.query(
            `INSERT INTO products (name, description, short_description, long_description, category, base_price, image_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id`,
            [
              product.name,
              product.long || product.short,
              product.short,
              product.long,
              product.category,
              product.price,
              product.image
            ]
          );
          productId = result.rows[0].id;
          imported++;
          console.log(`✅ Imported: ${product.name}`);
        }

        // Delete existing sizes and ingredients to re-import fresh
        await client.query('DELETE FROM product_sizes WHERE product_id = $1', [productId]);
        await client.query('DELETE FROM product_ingredients WHERE product_id = $1', [productId]);

        // Insert sizes with initial stock
        if (product.sizes && product.sizes.length > 0) {
          for (const size of product.sizes) {
            // Set initial stock based on size
            let initialStock = 20; // Default
            if (size.size === '250ml') initialStock = 25;
            if (size.size === '500ml') initialStock = 18;
            if (size.size === '1L') initialStock = 12;

            await client.query(
              `INSERT INTO product_sizes 
               (product_id, size, price, stock_quantity, calories, protein, carbs, sugar, vitamin_c, serving_size)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
              [
                productId,
                size.size,
                size.price,
                initialStock,
                size.calories || null,
                size.protein || null,
                size.carbs || null,
                size.sugar || null,
                size.vitaminC || null,
                size.servingSize || size.size
              ]
            );
          }
          console.log(`   → Added ${product.sizes.length} size variants with stock`);
        }

        // Insert fruit ingredients
        if (product.fruitIngredients && product.fruitIngredients.length > 0) {
          for (const ingredient of product.fruitIngredients) {
            await client.query(
              'INSERT INTO product_ingredients (product_id, ingredient) VALUES ($1, $2)',
              [productId, ingredient]
            );
          }
          console.log(`   → Added ${product.fruitIngredients.length} ingredients`);
        }

      } catch (err) {
        console.error(`❌ Error importing ${product.name}:`, err.message);
        skipped++;
      }
    }

    client.release();

    console.log('\n' + '='.repeat(50));
    console.log('📊 Import Summary:');
    console.log('='.repeat(50));
    console.log(`✅ New products imported: ${imported}`);
    console.log(`🔄 Existing products updated: ${updated}`);
    console.log(`❌ Products skipped (errors): ${skipped}`);
    console.log(`📦 Total products in file: ${products.length}`);
    console.log('='.repeat(50));
    console.log('\n🎉 Product import completed successfully!\n');

  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

importAllProducts();
