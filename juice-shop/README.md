# 🍹 ThiruSu Juice Shop

A modern, full-stack e-commerce platform for fresh juices, health cleanses, and meal plans built with React, Node.js, Express, and PostgreSQL.

## 🚀 Features

### ✅ Completed Features (Pushed to GitHub)

1. **🔐 Forgot Password & Reset**
   - Email-based password reset flow
   - Secure token generation with 1-hour expiration
   - EmailJS integration for password reset emails
   - Real-time email delivery

2. **📍 Multiple Delivery Addresses**
   - Address book management (CRUD operations)
   - Default address selection
   - Location picker with map integration
   - Save multiple delivery addresses per user

3. **📧 Email Notifications (EmailJS Integration)**
   - Welcome email on user signup
   - Password reset email with secure link
   - Order confirmation email with full details
   - Professional HTML email templates
   - Real-time email delivery to customer inbox

4. **🔍 Product Search & Advanced Filters**
   - Real-time product search
   - Category filtering
   - Price range filtering
   - Sort by price/name/date
   - Autocomplete suggestions

5. **🎟️ Discount Coupons System**
   - Coupon code validation
   - Percentage/fixed amount discounts
   - Usage tracking and limits
   - Expiration date handling
   - Admin coupon management

### 🛠️ In Progress Features

6. **💳 Payment Gateway Integration** - Razorpay integration (planned)
7. **⭐ Product Reviews & Ratings** - Customer reviews system (planned)
8. **📄 Order Invoice/Receipt (PDF)** - PDF generation (planned)
9. **🛒 Guest Checkout** - Checkout without signup (planned)
10. **📊 Admin Analytics Dashboard** - Sales charts & metrics (planned)
11. **❌ Order Cancellation** - Cancel order functionality (planned)
12. **📦 Stock Alerts & Low Stock Warnings** - Inventory management (planned)

## 📧 EmailJS Configuration

### Setup Instructions

1. **EmailJS Account**: https://dashboard.emailjs.com/
2. **Service ID**: `service_ie2l1kg`
3. **Public Key**: `_wCy461WHzxRVNDAm`

### Email Templates Created

| Template ID | Purpose | Status |
|------------|---------|--------|
| `template_7x5i2ei` | Password Reset | ✅ Active |
| `template_t67u4rg` | Order Confirmation | ✅ Active |
| `template_welcome` | Welcome Email | ⏳ To be created |

### Email Features
- ✅ Password reset with secure token
- ✅ Order confirmation with full details (items, pricing, delivery address)
- ✅ Welcome email on signup (implementation ready)
- ✅ Professional HTML templates with branding

For detailed template setup guide, see [EMAILJS_TEMPLATE_GUIDE.md](./EMAILJS_TEMPLATE_GUIDE.md)

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **React Router** - Navigation
- **Axios** - HTTP client
- **EmailJS Browser** - Client-side email integration

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Clone Repository
```bash
git clone <your-repo-url>
cd juice-shop
```

### Frontend Setup
```bash
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Configure database credentials and JWT secret

npm run dev
# Backend runs on http://localhost:5000
```

### Database Setup
```bash
cd backend
node scripts/setupDatabase.js
node scripts/seedData.js
```

## 🗄️ Database Schema

### Tables
- `users` - User accounts (customers & admin)
- `products` - Product catalog
- `orders` - Order information
- `order_items` - Order line items
- `addresses` - User delivery addresses
- `password_reset_tokens` - Password reset tokens
- `coupons` - Discount coupons
- `coupon_usage` - Coupon usage tracking

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/juice_shop
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

## 🚀 Deployment

### Frontend
```bash
npm run build
# Deploy the 'dist' folder to your hosting provider
```

### Backend
```bash
# Set NODE_ENV=production
# Configure production database
# Deploy to your preferred hosting (Heroku, Railway, Render, etc.)
```

## 📝 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Products
- `GET /api/products` - Get all products (with search & filters)
- `GET /api/products/:id` - Get single product

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details

### Addresses
- `GET /api/addresses` - Get user's addresses
- `POST /api/addresses` - Add new address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

### Coupons
- `POST /api/coupons/validate` - Validate coupon code
- `GET /api/coupons` - Get all coupons (admin)
- `POST /api/coupons` - Create coupon (admin)

## 👨‍💼 Admin Features

### Default Admin Credentials
- **Email**: admin@juiceshop.com
- **Password**: admin123

### Admin Capabilities
- View all orders
- Manage products
- Create/manage coupons
- View customer data

## 🧪 Testing

### Test Accounts
- **Customer**: test@example.com / password123
- **Admin**: admin@juiceshop.com / admin123

### Email Testing
1. Use real email for password reset testing
2. Check inbox/spam for EmailJS emails
3. Test order confirmation on checkout

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

For issues or questions, please open a GitHub issue.

---

**Built with ❤️ by ThiruSu Team**

*Last Updated: December 21, 2025*
