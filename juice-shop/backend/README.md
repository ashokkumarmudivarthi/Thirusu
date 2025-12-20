# ThiruSu Juice Shop - Backend API

Production-ready Express.js + PostgreSQL backend for e-commerce juice shop with real-time stock management.

## Features

✅ **User Authentication** - JWT-based auth with bcrypt password hashing
✅ **Stock Management** - Real-time inventory tracking with stock deduction on orders  
✅ **Admin Panel** - Stock updates, bulk operations, history tracking
✅ **Order Processing** - Automated stock deduction on purchase
✅ **PostgreSQL Database** - Relational database for data integrity
✅ **Secure API** - Helmet, CORS, input validation

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- PostgreSQL database created (name: `juice_shop`)

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Edit `.env` file and update your PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=juice_shop
DB_USER=postgres
DB_PASSWORD=your_actual_password
```

### 3. Create PostgreSQL Database

Open PostgreSQL command line (psql) or pgAdmin and run:

```sql
CREATE DATABASE juice_shop;
```

### 4. Setup Database Schema

```bash
npm run db:setup
```

This creates all tables:
- `users` - Customer and admin accounts
- `products` - Product catalog
- `product_sizes` - Size variants (250ml, 500ml, 1L) with stock
- `product_ingredients` - Fruit ingredients for filtering
- `orders` - Customer orders
- `order_items` - Individual order line items
- `stock_history` - Stock change audit log

### 5. Seed Initial Data

```bash
npm run db:seed
```

This creates:
- Admin user account
- 5 sample products with stock
- All size variants with initial stock quantities

**Default Admin Credentials:**
- Email: `admin@thirusu.com`
- Password: `admin123`

⚠️ **Change this password after first login!**

### 6. Start Development Server

```bash
npm run dev
```

Server runs on: `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | Get all products with stock | No |
| GET | `/api/products/:id` | Get single product | No |
| PUT | `/api/products/stock/:productSizeId` | Update stock (admin) | Admin |
| POST | `/api/products/stock/bulk-update` | Bulk stock update (admin) | Admin |
| GET | `/api/products/stock/history/:productSizeId` | Stock history (admin) | Admin |

### Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders` | Create order (auto deducts stock) | Optional |
| GET | `/api/orders/my-orders` | Get user's orders | Yes |
| GET | `/api/orders/:id` | Get order details | Yes |

## API Request Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@thirusu.com",
    "password": "admin123"
  }'
```

### Get Products with Stock
```bash
curl http://localhost:5000/api/products
```

### Update Stock (Admin)
```bash
curl -X PUT http://localhost:5000/api/products/stock/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "stockQuantity": 50,
    "notes": "Daily restock"
  }'
```

### Create Order (Deducts Stock)
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": 1,
        "productSizeId": 2,
        "productName": "Apple Juice Cleanse",
        "size": "500ml",
        "quantity": 2,
        "price": 499
      }
    ],
    "totalAmount": 998,
    "paymentMethod": "card",
    "deliveryAddress": "123 Main St",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "9876543210"
  }'
```

## Stock Management Flow

### When Customer Orders:

1. **Validation** - Check if stock available for all items
2. **Insufficient Stock** - Return error with available quantity
3. **Create Order** - Insert order record
4. **Deduct Stock** - Automatically reduce inventory
5. **Log History** - Track stock changes in `stock_history` table
6. **Out of Stock** - Product size shows "Out of Stock" when quantity = 0

### Admin Daily Stock Update:

1. Login as admin
2. Call `/api/products/stock/:productSizeId` to update stock
3. Stock history automatically logged
4. Customers immediately see updated availability

## Database Schema

```
users
├── id (PK)
├── name
├── email (unique)
├── password (bcrypt hashed)
└── role (customer/admin)

products
├── id (PK)
├── name
├── category
└── base_price

product_sizes
├── id (PK)
├── product_id (FK)
├── size (250ml/500ml/1L)
├── price
└── stock_quantity ← REAL-TIME INVENTORY

orders
├── id (PK)
├── user_id (FK)
├── total_amount
└── status

order_items
├── id (PK)
├── order_id (FK)
├── product_size_id (FK)
└── quantity ← DEDUCTED FROM STOCK

stock_history
├── id (PK)
├── product_size_id (FK)
├── previous_stock
├── new_stock
└── change_type (sale/restock/adjustment)
```

## Production Deployment

### Environment Variables

Update `.env` for production:
- Change `JWT_SECRET` to strong random string
- Update `DB_PASSWORD` 
- Set `NODE_ENV=production`
- Configure CORS origin to your domain

### Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS only
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Monitor stock levels

## Troubleshooting

### Database Connection Error
- Check PostgreSQL is running: `pg_isready`
- Verify credentials in `.env`
- Ensure database `juice_shop` exists

### Port Already in Use
- Change `PORT` in `.env` to different number
- Kill existing process: `npx kill-port 5000`

### JWT Token Invalid
- Check token in Authorization header: `Bearer YOUR_TOKEN`
- Token expires after 7 days (configurable in `.env`)

## Next Steps

1. ✅ Backend running
2. Connect React frontend to backend API
3. Create admin dashboard for stock management
4. Add payment gateway integration
5. Deploy to production server

---

**Need help?** Check the code comments or create an issue.
