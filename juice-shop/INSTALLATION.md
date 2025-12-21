# ThiruSu Juice Shop - Installation & Setup Guide

## Complete Setup Documentation 🚀

Step-by-step guide to install, configure, and run the ThiruSu Juice Shop application.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [System Requirements](#system-requirements)
3. [Installation Steps](#installation-steps)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [Frontend Setup](#frontend-setup)
7. [Backend Setup](#backend-setup)
8. [Running the Application](#running-the-application)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

#### 1. Node.js
- **Version**: 18.x or higher recommended
- **Download**: [https://nodejs.org/](https://nodejs.org/)
- **Verify installation**:
  ```powershell
  node --version
  # Should show: v18.x.x or higher
  
  npm --version
  # Should show: 9.x.x or higher
  ```

#### 2. PostgreSQL
- **Version**: 14.x or higher
- **Download**: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
- **Verify installation**:
  ```powershell
  psql --version
  # Should show: psql (PostgreSQL) 14.x or higher
  ```

#### 3. Git
- **Version**: Latest
- **Download**: [https://git-scm.com/downloads](https://git-scm.com/downloads)
- **Verify installation**:
  ```powershell
  git --version
  # Should show: git version 2.x.x
  ```

#### 4. Code Editor (Recommended)
- **Visual Studio Code**: [https://code.visualstudio.com/](https://code.visualstudio.com/)
- Or any text editor of your choice

---

## System Requirements

### Minimum Requirements
- **OS**: Windows 10/11, macOS 10.15+, Linux (Ubuntu 20.04+)
- **RAM**: 4 GB minimum (8 GB recommended)
- **Storage**: 2 GB free space
- **Network**: Internet connection for package downloads

### Port Requirements
Application uses these ports:
- **Frontend**: `5173` (Vite dev server)
- **Backend**: `5000` (Express server)
- **PostgreSQL**: `5432` (default)

**Ensure these ports are available** before starting.

---

## Installation Steps

### Step 1: Clone the Repository

#### Using Git
```powershell
# Navigate to your desired directory
cd e:\

# Clone the repository
git clone https://github.com/yourusername/ThiruSu.git
# OR if using SSH
git clone git@github.com:yourusername/ThiruSu.git

# Navigate to project folder
cd ThiruSu\juice-shop
```

#### Verify Directory Structure
```powershell
dir
# Should see: backend/, src/, public/, package.json, etc.
```

### Step 2: Install Dependencies

#### Install Frontend Dependencies
```powershell
# From juice-shop root directory
npm install
```

**Packages installed** (see package.json):
- React 19.2.0
- React Router DOM 7.10.1
- Vite 7.2.4
- Tailwind CSS 4.1.17
- Axios 1.7.9
- Lucide React 0.556.0
- Framer Motion 12.11.14
- And more...

#### Install Backend Dependencies
```powershell
# Navigate to backend folder
cd backend

# Install dependencies
npm install
```

**Packages installed** (see backend/package.json):
- Express 4.18.2
- PostgreSQL (pg) 8.11.3
- bcryptjs 2.4.3
- jsonwebtoken 9.0.2
- cors 2.8.5
- dotenv 16.3.1
- helmet 7.1.0
- express-validator 7.0.1
- nodemon 3.0.2 (dev)

#### Verify Installation
```powershell
# Check node_modules folder exists
dir node_modules

# Should see many packages installed
```

---

## Database Setup

### Step 1: Create PostgreSQL Database

#### Using pgAdmin (GUI)
1. Open **pgAdmin**
2. Right-click **Databases**
3. Select **Create** → **Database**
4. Database name: `juice_shop`
5. Owner: `postgres` (or your user)
6. Click **Save**

#### Using Command Line (psql)
```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE juice_shop;

# Verify
\l
# Should see juice_shop in list

# Exit
\q
```

### Step 2: Configure Database Connection

#### Create .env File in Backend
```powershell
# Navigate to backend folder
cd e:\ThiruSu\juice-shop\backend

# Create .env file (use text editor or command)
notepad .env
```

#### Add Database Configuration
Add these lines to `backend/.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
DB_NAME=juice_shop

# JWT Secret (Generate a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

**Important**: Replace `your_postgres_password_here` with your actual PostgreSQL password!

**Generate JWT Secret** (use random string generator or):
```powershell
# PowerShell - generate random string
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

#### Save and Close .env file

### Step 3: Initialize Database Schema

#### Run Setup Script
```powershell
# Make sure you're in backend folder
cd e:\ThiruSu\juice-shop\backend

# Run database setup
node scripts/setupDatabase.js
```

**What this script does:**
1. Creates all required tables:
   - `users` - Customer and admin accounts
   - `products` - Juice products
   - `product_sizes` - Size variants (250ml, 500ml, 1000ml)
   - `orders` - Customer orders
   - `order_items` - Order line items
   - `stock_history` - Stock tracking
   - `scrolling_offers` - Promotional banners
   - `chat_sessions` - Customer support chats
   - `chat_messages` - Chat conversation
   - `agent_status` - Support agent availability
   - `predefined_queries` - FAQ templates
   - `wishlist` - Customer saved items

2. Seeds default data:
   - Sample products with images
   - Default scrolling offers
   - Predefined chat queries
   - Stock levels

**Expected Output:**
```
Connected to database
Creating tables...
✅ Tables created successfully
Importing products...
✅ Products imported
Creating default offers...
✅ Offers created
Seeding predefined queries...
✅ Queries seeded
✅ Database setup complete!
```

### Step 4: Verify Database

#### Check Tables Created
```powershell
# Connect to database
psql -U postgres -d juice_shop

# List all tables
\dt

# Should see:
# users
# products
# product_sizes
# orders
# order_items
# stock_history
# scrolling_offers
# chat_sessions
# chat_messages
# agent_status
# predefined_queries
# wishlist

# Check product count
SELECT COUNT(*) FROM products;

# Should show multiple products

# Exit
\q
```

### Step 5: Create Admin User (Optional)

#### Using Database Script
```powershell
# In backend folder
node scripts/checkAdmin.js
```

**OR manually in database:**
```sql
-- First register normally, then update role
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

---

## Environment Configuration

### Frontend Environment

#### Create .env File in Root
```powershell
# Navigate to juice-shop root
cd e:\ThiruSu\juice-shop

# Create .env file
notepad .env
```

#### Add Frontend Configuration
```env
# API Base URL
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=ThiruSu Juice Shop
VITE_APP_VERSION=1.0.0
```

**Note**: Vite requires `VITE_` prefix for environment variables.

### Backend Environment

Already created in Database Setup step. Verify `backend/.env` contains:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_actual_password
DB_NAME=juice_shop

JWT_SECRET=your_generated_secret_key

PORT=5000
NODE_ENV=development
```

---

## Frontend Setup

### Step 1: Configure Tailwind CSS

**Already configured** in `tailwind.config.cjs`:
```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Step 2: Configure Vite

**Already configured** in `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

**Proxy configuration** allows frontend to call `/api` routes directly.

### Step 3: Verify Configuration Files

Check these files exist:
- ✅ `package.json` - Dependencies
- ✅ `vite.config.js` - Vite config
- ✅ `tailwind.config.cjs` - Tailwind config
- ✅ `postcss.config.cjs` - PostCSS config
- ✅ `eslint.config.js` - ESLint config
- ✅ `index.html` - Entry HTML
- ✅ `.env` - Environment variables

---

## Backend Setup

### Step 1: Verify File Structure

**Check backend folder has:**
```
backend/
├── config/
│   └── database.js       # Database connection
├── middleware/
│   └── auth.js           # JWT authentication
├── routes/
│   ├── auth.js           # Login/register
│   ├── products.js       # Product APIs
│   ├── orders.js         # Order APIs
│   ├── offers.js         # Scrolling offers
│   └── chat.js           # Customer support
├── scripts/
│   ├── setupDatabase.js  # Database initialization
│   ├── seedData.js       # Sample data
│   └── checkAdmin.js     # Admin utilities
├── server.js             # Main server file
├── package.json          # Dependencies
└── .env                  # Environment config
```

### Step 2: Database Connection Test

**Test database connection:**
```powershell
# In backend folder
node -e "const { pool } = require('./config/database.js'); pool.query('SELECT NOW()').then(res => console.log('✅ DB Connected:', res.rows[0])).catch(err => console.error('❌ DB Error:', err.message));"
```

**Expected output:**
```
✅ DB Connected: { now: 2024-01-15T10:30:00.000Z }
```

### Step 3: Server Configuration

**Verify `backend/server.js`** includes:
- Express app setup
- CORS configuration
- JSON body parser
- Security headers (Helmet)
- Route mounting:
  - `/api/auth`
  - `/api/products`
  - `/api/orders`
  - `/api/offers`
  - `/api/chat`
  - `/api/agent`
- Error handling middleware

---

## Running the Application

### Option 1: Run Both Servers Separately

#### Terminal 1: Backend Server
```powershell
# Navigate to backend
cd e:\ThiruSu\juice-shop\backend

# Start backend server
npm run dev

# Or without nodemon:
# node server.js
```

**Expected output:**
```
🚀 Server running on port 5000
✅ Connected to PostgreSQL database
```

**Backend runs on:** `http://localhost:5000`

#### Terminal 2: Frontend Server
```powershell
# Open new terminal
# Navigate to frontend root
cd e:\ThiruSu\juice-shop

# Start frontend dev server
npm run dev
```

**Expected output:**
```
VITE v7.2.4  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**Frontend runs on:** `http://localhost:5173`

### Option 2: Use Concurrent Commands (Advanced)

Install concurrently package (optional):
```powershell
npm install --save-dev concurrently
```

Add to root `package.json`:
```json
"scripts": {
  "dev": "vite",
  "dev:backend": "cd backend && npm run dev",
  "dev:all": "concurrently \"npm run dev\" \"npm run dev:backend\""
}
```

Run both:
```powershell
npm run dev:all
```

### Accessing the Application

1. **Open browser**
2. Navigate to: `http://localhost:5173`
3. **Home page** should load with:
   - Navbar
   - Hero section
   - Product grid
   - Footer

---

## Testing

### Test Frontend

#### Homepage
```
URL: http://localhost:5173
✅ Navbar visible
✅ Hero slider working
✅ Products loading
✅ Categories showing
✅ Footer present
```

#### Authentication
```
1. Click "Login" in navbar
2. Try registering new user
3. Login with credentials
4. Should redirect to home
5. Navbar shows "Profile" and "Logout"
```

#### Product Features
```
1. Browse products
2. Click product card
3. Product detail page opens
4. Select size
5. Add to cart
6. Cart icon shows count
```

### Test Backend

#### API Endpoints
```powershell
# Test products endpoint
curl http://localhost:5000/api/products

# Should return JSON with products array
```

#### Database Connection
```powershell
# In backend folder
node scripts/verifyData.js

# Shows counts of all data
```

### Test Admin Access

1. Create admin user (see Database Setup Step 5)
2. Login with admin credentials
3. Navigate to `/admin`
4. Should see admin dashboard
5. Test all tabs:
   - Products tab
   - Orders tab
   - Offers tab
   - Support tab

### Test Chat System

#### Customer Side
1. Open chat widget (bottom-right)
2. Try predefined queries
3. Start live chat
4. Send message

#### Admin Side
1. Go to `/support` or admin Support tab
2. See waiting session
3. Respond to message
4. Close session

---

## Troubleshooting

### Common Issues

#### 1. "Cannot connect to database"
**Solution:**
- Check PostgreSQL is running:
  ```powershell
  # Check service
  Get-Service postgresql*
  
  # Start if not running
  Start-Service postgresql-x64-14
  ```
- Verify credentials in `backend/.env`
- Test connection: `psql -U postgres -d juice_shop`

#### 2. "Port 5173 already in use"
**Solution:**
```powershell
# Find process using port
netstat -ano | findstr :5173

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or use different port in vite.config.js
```

#### 3. "Port 5000 already in use"
**Solution:**
```powershell
# Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in backend/.env
```

#### 4. "Module not found" errors
**Solution:**
```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install

# Same for backend
cd backend
Remove-Item -Recurse -Force node_modules
npm install
```

#### 5. Frontend not loading / blank page
**Check:**
- Browser console for errors (F12)
- Backend server running
- CORS enabled in backend
- API URL correct in frontend .env

**Solution:**
```powershell
# Restart both servers
# Clear browser cache
# Hard refresh (Ctrl + Shift + R)
```

#### 6. Database tables not created
**Solution:**
```powershell
# Re-run setup script
cd backend
node scripts/setupDatabase.js

# Check for errors in output
```

#### 7. Images not loading
**Check:**
- Images exist in `public/assets/products/`
- Correct paths in database
- Vite dev server serving public folder

#### 8. JWT authentication errors
**Check:**
- JWT_SECRET set in `backend/.env`
- Token not expired
- Headers include Authorization: Bearer <token>

**Solution:**
```powershell
# Generate new JWT secret
# Update backend/.env
# Restart backend server
```

### Getting Help

#### Check Logs
- **Backend logs**: Terminal running backend
- **Frontend logs**: Browser console (F12)
- **Database logs**: PostgreSQL logs

#### Verify Setup
```powershell
# Check Node version
node --version

# Check npm version
npm --version

# Check PostgreSQL
psql --version

# Test database connection
psql -U postgres -d juice_shop -c "SELECT COUNT(*) FROM products;"
```

---

## Production Deployment

### Environment Variables

#### Update for Production
```env
# Backend .env
NODE_ENV=production
DB_HOST=your_production_db_host
JWT_SECRET=use_very_strong_random_string_here

# Frontend .env
VITE_API_URL=https://your-domain.com/api
```

### Build Frontend
```powershell
cd e:\ThiruSu\juice-shop
npm run build

# Creates dist/ folder with optimized files
```

### Deployment Platforms
- **Frontend**: Vercel, Netlify, Render
- **Backend**: Heroku, Railway, Render, AWS
- **Database**: PostgreSQL on cloud (AWS RDS, Heroku Postgres)

---

## Maintenance

### Regular Tasks

#### Update Dependencies
```powershell
# Check outdated packages
npm outdated

# Update packages
npm update

# For backend too
cd backend
npm update
```

#### Database Backup
```powershell
# Backup database
pg_dump -U postgres juice_shop > backup.sql

# Restore from backup
psql -U postgres juice_shop < backup.sql
```

#### Clear Old Data
```sql
-- Delete old closed chat sessions (older than 30 days)
DELETE FROM chat_sessions 
WHERE status = 'closed' 
AND updated_at < NOW() - INTERVAL '30 days';

-- Archive old orders
-- (Create archive table first)
```

---

## Quick Start Summary

**For first-time setup:**
```powershell
# 1. Install Node.js, PostgreSQL, Git
# 2. Clone repository
git clone <repo-url>
cd ThiruSu\juice-shop

# 3. Install dependencies
npm install
cd backend
npm install

# 4. Configure environment
# Create backend/.env with database credentials

# 5. Setup database
node scripts/setupDatabase.js

# 6. Run application
# Terminal 1:
cd backend
npm run dev

# Terminal 2:
cd ..
npm run dev

# 7. Open browser
# http://localhost:5173
```

---

## System Architecture

### Technology Stack

**Frontend:**
- React 19.2.0
- Vite 7.2.4
- Tailwind CSS 4.1.17
- React Router DOM 7.10.1
- Axios for API calls

**Backend:**
- Node.js
- Express.js 4.18.2
- PostgreSQL 14+
- JWT authentication

**Database:**
- PostgreSQL
- 12 tables
- Relational schema

---

## You're Ready! 🎉

Your ThiruSu Juice Shop is now installed and running!

**Next Steps:**
- Review [CUSTOMER_GUIDE.md](CUSTOMER_GUIDE.md) for user features
- Review [ADMIN_GUIDE.md](ADMIN_GUIDE.md) for admin operations
- Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API reference
- Read [GIT_WORKFLOW.md](GIT_WORKFLOW.md) for version control

**Happy Coding!** 🚀🍹
