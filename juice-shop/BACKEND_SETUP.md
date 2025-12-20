# Backend Setup Complete! 🎉

## What's Been Created

### Backend Structure
```
backend/
├── config/
│   └── database.js          # PostgreSQL connection
├── middleware/
│   └── auth.js              # JWT authentication & admin authorization
├── routes/
│   ├── auth.js              # User signup/login
│   ├── products.js          # Products with stock management
│   └── orders.js            # Orders with auto stock deduction
├── scripts/
│   ├── setupDatabase.js     # Creates all tables
│   └── seedData.js          # Inserts sample data
├── server.js                # Main Express server
├── package.json             # Dependencies
├── .env                     # Configuration (update DB password!)
└── README.md                # Full documentation
```

## Quick Start Guide

### Step 1: Update PostgreSQL Password

Edit `backend/.env` and set your actual PostgreSQL password:
```env
DB_PASSWORD=your_actual_postgres_password
```

### Step 2: Create Database

Open PostgreSQL (pgAdmin or command line) and run:
```sql
CREATE DATABASE juice_shop;
```

### Step 3: Setup Tables

```bash
cd backend
npm run db:setup
```

### Step 4: Seed Sample Data

```bash
npm run db:seed
```

This creates:
- Admin user: `admin@thirusu.com` / `admin123`
- 5 sample products with stock (20, 15, 10 units per size)

### Step 5: Start Backend Server

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

## Test API

### Check Health
```bash
curl http://localhost:5000/api/health
```

### Get Products with Stock
```bash
curl http://localhost:5000/api/products
```

Response will show stock for each size:
```json
{
  "sizes": [
    {
      "size": "250ml",
      "price": 299,
      "stock": 20,
      "inStock": true
    },
    {
      "size": "500ml", 
      "price": 499,
      "stock": 0,
      "inStock": false  ← OUT OF STOCK
    }
  ]
}
```

### Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@thirusu.com","password":"admin123"}'
```

Copy the `token` from response for admin operations.

### Update Stock (Admin Only)
```bash
curl -X PUT http://localhost:5000/api/products/stock/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"stockQuantity": 50, "notes": "Daily restock"}'
```

## How Stock Management Works

### Customer Flow:
1. Customer views products → Sees "In Stock" or "Out of Stock"
2. Adds to cart → Only if stock available
3. Places order → Stock automatically deducted
4. If stock = 0 → Shows "Out of Stock" (can't order)

### Admin Flow:
1. Admin logs in
2. Updates stock for each product size
3. Changes are immediate for all customers
4. Stock history tracked automatically

## Database Tables

- **users** - Customer and admin accounts
- **products** - Product catalog (46 products)
- **product_sizes** - Size variants with STOCK QUANTITY
- **orders** - Customer orders
- **order_items** - Order details (auto deducts stock)
- **stock_history** - Audit trail of all stock changes

## Next Step: Connect Frontend

I'll create an API service file for your React app to connect to this backend. The frontend will:
- Fetch products with real-time stock
- Show "In Stock" / "Out of Stock" badges
- Block orders when stock = 0
- Let admin update stock

Ready to proceed with frontend integration?
