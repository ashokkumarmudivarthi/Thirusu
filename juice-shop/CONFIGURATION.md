# ThiruSu Juice Shop - Configuration Guide

## Environment & Configuration Documentation ⚙️

Complete guide for configuring ThiruSu Juice Shop application.

---

## Table of Contents
1. [Environment Variables](#environment-variables)
2. [Database Configuration](#database-configuration)
3. [Frontend Configuration](#frontend-configuration)
4. [Backend Configuration](#backend-configuration)
5. [Security Configuration](#security-configuration)
6. [Production Settings](#production-settings)
7. [Environment Examples](#environment-examples)

---

## Environment Variables

### Overview
Environment variables store **sensitive configuration** data separately from code:
- Database credentials
- API keys
- Secret tokens
- Server ports
- Environment modes

### Why Use Environment Variables?
- ✅ **Security**: Keep secrets out of source code
- ✅ **Flexibility**: Different configs for dev/prod
- ✅ **Safety**: .env files not committed to Git
- ✅ **Easy updates**: Change without code edits

---

## Database Configuration

### Backend Database (.env)

**File Location:** `backend/.env`

**Required Variables:**

```env
# PostgreSQL Database Connection
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_secure_password_here
DB_NAME=juice_shop

# Database Pool Settings (Optional)
DB_MAX_CONNECTIONS=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=2000
```

### Variable Descriptions

#### DB_HOST
- **Description**: PostgreSQL server hostname
- **Development**: `localhost`
- **Production**: Cloud database URL
  - Example: `my-db.postgresql.database.azure.com`
  - Example: `ec2-xx-xxx-xxx-xx.compute-1.amazonaws.com`
- **Type**: String

#### DB_PORT
- **Description**: PostgreSQL server port
- **Default**: `5432`
- **Type**: Integer
- **Note**: Usually doesn't need changing

#### DB_USER
- **Description**: Database username
- **Development**: `postgres` (default)
- **Production**: Create specific user
  - Example: `juice_shop_user`
- **Type**: String

#### DB_PASSWORD
- **Description**: Database password
- **Development**: Your local PostgreSQL password
- **Production**: **STRONG password required**
  - Minimum 16 characters
  - Mix of uppercase, lowercase, numbers, symbols
  - Example: `Kj8$mP2@xL9#qR5^zN3!`
- **Type**: String
- **⚠️ CRITICAL**: Never commit this to Git!

#### DB_NAME
- **Description**: Database name
- **Value**: `juice_shop`
- **Type**: String
- **Note**: Must match created database

### Database Connection String (Alternative)

Instead of separate variables, some hosts provide a single connection string:

```env
# Alternative: Single connection URL
DATABASE_URL=postgresql://username:password@host:5432/juice_shop

# Use in backend/config/database.js:
# const pool = new Pool({ connectionString: process.env.DATABASE_URL })
```

### Database Pool Configuration

**Optional Advanced Settings:**

```env
# Maximum number of clients in pool
DB_MAX_CONNECTIONS=20

# How long a client can be idle before closing (ms)
DB_IDLE_TIMEOUT=30000

# Connection timeout (ms)
DB_CONNECTION_TIMEOUT=2000

# Allow connections from app even if at max
DB_ALLOW_EXIT_ON_IDLE=true
```

**When to adjust:**
- High traffic: Increase `DB_MAX_CONNECTIONS` (20-50)
- Low traffic: Decrease to save resources (5-10)
- Slow connections: Increase `DB_CONNECTION_TIMEOUT`

---

## Frontend Configuration

### Frontend Environment (.env)

**File Location:** `juice-shop/.env` (root)

**Required Variables:**

```env
# API Base URL
VITE_API_URL=http://localhost:5000/api

# Application Details
VITE_APP_NAME=ThiruSu Juice Shop
VITE_APP_VERSION=1.0.0

# Optional Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_CHAT=true
```

### Variable Descriptions

#### VITE_API_URL
- **Description**: Backend API base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-backend.com/api`
- **Type**: String (URL)
- **⚠️ Important**: Must have `VITE_` prefix for Vite to expose it

**Usage in Code:**
```javascript
// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);
  return response.json();
};
```

#### VITE_APP_NAME
- **Description**: Application display name
- **Value**: `ThiruSu Juice Shop`
- **Type**: String
- **Usage**: Browser title, meta tags

#### VITE_APP_VERSION
- **Description**: Application version number
- **Value**: `1.0.0`
- **Type**: String (semantic versioning)
- **Update**: Increment with releases

### Vite Environment Rules

**Important:**
- All Vite env vars **MUST** start with `VITE_`
- Without prefix, they're not exposed to client
- Access via `import.meta.env.VITE_VARIABLE_NAME`

**Example:**
```env
# ✅ CORRECT - Accessible in frontend
VITE_API_URL=http://localhost:5000/api

# ❌ WRONG - Not accessible (no VITE_ prefix)
API_URL=http://localhost:5000/api
```

---

## Backend Configuration

### Backend Environment (.env)

**File Location:** `backend/.env`

**Complete Configuration:**

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_secure_password_here
DB_NAME=juice_shop

# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=5000
NODE_ENV=development

# ============================================
# SECURITY CONFIGURATION
# ============================================
# JWT Secret Key (Generate random string)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long_random_string

# JWT Token Expiry
JWT_EXPIRES_IN=24h

# bcrypt Salt Rounds (10-12 recommended)
BCRYPT_SALT_ROUNDS=10

# ============================================
# CORS CONFIGURATION
# ============================================
# Allowed Origins (comma-separated)
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# ============================================
# RATE LIMITING (Optional)
# ============================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ============================================
# SESSION CONFIGURATION (Optional)
# ============================================
SESSION_SECRET=your_session_secret_key_here
SESSION_MAX_AGE=86400000

# ============================================
# EMAIL CONFIGURATION (Future Feature)
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@juiceshop.com

# ============================================
# PAYMENT GATEWAY (Future Feature)
# ============================================
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# ============================================
# FILE UPLOAD (Optional)
# ============================================
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# ============================================
# LOGGING
# ============================================
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

### Variable Descriptions

#### PORT
- **Description**: Backend server port
- **Default**: `5000`
- **Type**: Integer
- **Range**: 1024-65535
- **Note**: Must not conflict with frontend (5173)

#### NODE_ENV
- **Description**: Application environment
- **Values**:
  - `development` - Dev mode (verbose logging)
  - `production` - Prod mode (optimized)
  - `test` - Testing mode
- **Type**: String
- **Affects**: Error messages, logging, caching

#### JWT_SECRET
- **Description**: Secret key for signing JWT tokens
- **Requirements**:
  - **Minimum 32 characters**
  - Random and unpredictable
  - Mix of characters
- **Type**: String
- **⚠️ CRITICAL**: 
  - Never share or commit
  - Change if compromised
  - Use strong random generator

**Generate JWT Secret:**
```powershell
# PowerShell - Generate 64 character random string
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})

# Or online: https://randomkeygen.com/
```

**Example:**
```env
JWT_SECRET=8Kx9mP2qR5vN3zL6cJ4fD7hS1wE0aG9bT8yU5iO2xM4nV7lC3pQ6rK1jF0gH9sA
```

#### JWT_EXPIRES_IN
- **Description**: JWT token validity duration
- **Format**: 
  - `24h` - 24 hours
  - `7d` - 7 days
  - `60s` - 60 seconds
- **Default**: `24h`
- **Type**: String (time format)

#### BCRYPT_SALT_ROUNDS
- **Description**: Number of bcrypt hashing rounds
- **Range**: 10-12 recommended
- **Type**: Integer
- **Note**: Higher = more secure but slower
  - 10 = ~100ms per hash
  - 12 = ~300ms per hash

#### CORS_ORIGIN
- **Description**: Allowed frontend origins
- **Development**: `http://localhost:5173`
- **Production**: `https://your-domain.com`
- **Multiple**: Comma-separated
- **Example**: 
  ```env
  CORS_ORIGIN=http://localhost:5173,http://localhost:3000,https://app.example.com
  ```

---

## Security Configuration

### Password Security

**Best Practices:**

```env
# ✅ STRONG Passwords
DB_PASSWORD=Kj8$mP2@xL9#qR5^zN3!wQ7&vB4*cF6
JWT_SECRET=8Kx9mP2qR5vN3zL6cJ4fD7hS1wE0aG9bT8yU5iO2xM4nV7lC3pQ6rK1jF0gH9sA

# ❌ WEAK Passwords (NEVER use these)
DB_PASSWORD=password123
JWT_SECRET=secret
```

**Password Requirements:**
- Length: 16+ characters
- Uppercase letters: A-Z
- Lowercase letters: a-z
- Numbers: 0-9
- Symbols: !@#$%^&*()
- No dictionary words
- No personal information

### Secret Management

**Never commit secrets to Git:**

1. **Add .env to .gitignore:**
   ```gitignore
   # Environment files
   .env
   .env.local
   .env.production
   backend/.env
   ```

2. **Use .env.example template:**
   ```env
   # .env.example (safe to commit)
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret
   ```

3. **Team members copy and fill:**
   ```powershell
   # Copy template
   cp .env.example .env
   
   # Fill in actual values
   notepad .env
   ```

### Production Security

**Additional Production Settings:**

```env
# Production Mode
NODE_ENV=production

# Secure Cookie Settings
COOKIE_SECURE=true
COOKIE_HTTP_ONLY=true
COOKIE_SAME_SITE=strict

# Trust Proxy (if behind load balancer)
TRUST_PROXY=true

# Helmet Security Headers
HELMET_ENABLED=true

# Hide Stack Traces
HIDE_ERROR_DETAILS=true
```

---

## Production Settings

### Production .env Configuration

**Backend Production (.env):**

```env
# ============================================
# PRODUCTION CONFIGURATION
# ============================================

# Database (Cloud PostgreSQL)
DB_HOST=production-db.postgres.database.azure.com
DB_PORT=5432
DB_USER=juice_shop_prod_user
DB_PASSWORD=STRONG_PRODUCTION_PASSWORD_HERE
DB_NAME=juice_shop_production

# Server
PORT=5000
NODE_ENV=production

# Security
JWT_SECRET=PRODUCTION_JWT_SECRET_64_CHARACTERS_LONG_RANDOM_STRING
JWT_EXPIRES_IN=24h
BCRYPT_SALT_ROUNDS=12

# CORS (Production domains only)
CORS_ORIGIN=https://juiceshop.com,https://www.juiceshop.com

# SSL/TLS
FORCE_HTTPS=true

# Rate Limiting (Stricter)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=60

# Logging
LOG_LEVEL=error
LOG_FILE=/var/log/juice-shop/app.log

# Sessions
SESSION_SECRET=PRODUCTION_SESSION_SECRET_HERE
SESSION_MAX_AGE=86400000

# Email (Production SMTP)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
EMAIL_FROM=noreply@juiceshop.com
```

**Frontend Production (.env):**

```env
# Production API
VITE_API_URL=https://api.juiceshop.com/api

# App Details
VITE_APP_NAME=ThiruSu Juice Shop
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CHAT=true

# Analytics (if using)
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

### Environment-Specific Files

**Multiple environment files:**

```
# Development
.env.development

# Production
.env.production

# Testing
.env.test

# Local overrides (not committed)
.env.local
```

**Load specific environment:**
```powershell
# Windows - Set environment first
$env:NODE_ENV="production"
node server.js

# Or use cross-env package
npm install --save-dev cross-env

# In package.json:
"scripts": {
  "dev": "cross-env NODE_ENV=development nodemon server.js",
  "prod": "cross-env NODE_ENV=production node server.js"
}
```

---

## Environment Examples

### Development Environment

**Complete Development Setup:**

**backend/.env:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres123
DB_NAME=juice_shop

PORT=5000
NODE_ENV=development

JWT_SECRET=dev_jwt_secret_key_minimum_32_characters_for_development
JWT_EXPIRES_IN=24h
BCRYPT_SALT_ROUNDS=10

CORS_ORIGIN=http://localhost:5173,http://localhost:3000

LOG_LEVEL=debug
```

**juice-shop/.env:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=ThiruSu Juice Shop (Dev)
VITE_APP_VERSION=1.0.0-dev
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_CHAT=true
```

### Staging Environment

**backend/.env.staging:**
```env
DB_HOST=staging-db.example.com
DB_PORT=5432
DB_USER=juice_shop_staging
DB_PASSWORD=staging_secure_password
DB_NAME=juice_shop_staging

PORT=5000
NODE_ENV=staging

JWT_SECRET=staging_jwt_secret_64_chars_long
JWT_EXPIRES_IN=24h
BCRYPT_SALT_ROUNDS=11

CORS_ORIGIN=https://staging.juiceshop.com

LOG_LEVEL=info
```

### Production Environment

**backend/.env.production:**
```env
DB_HOST=prod-db.postgres.database.azure.com
DB_PORT=5432
DB_USER=juice_shop_prod
DB_PASSWORD=VERY_STRONG_PRODUCTION_PASSWORD
DB_NAME=juice_shop_production

PORT=5000
NODE_ENV=production

JWT_SECRET=PRODUCTION_JWT_SECRET_MINIMUM_64_CHARACTERS_RANDOM
JWT_EXPIRES_IN=24h
BCRYPT_SALT_ROUNDS=12

CORS_ORIGIN=https://juiceshop.com,https://www.juiceshop.com

LOG_LEVEL=error
HIDE_ERROR_DETAILS=true
```

---

## Configuration Files

### Database Config (backend/config/database.js)

**Using Environment Variables:**

```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: parseInt(process.env.DB_MAX_CONNECTIONS) || 20,
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000,
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 2000,
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    console.log('✅ Connected to PostgreSQL database');
  }
});

module.exports = { pool };
```

### Server Config (backend/server.js)

**Loading Environment:**

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN.split(','),
  credentials: true
};
app.use(cors(corsOptions));

// Port Configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});
```

### Vite Config (vite.config.js)

**Environment Integration:**

```javascript
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true
        }
      }
    },
    define: {
      'import.meta.env.VITE_APP_NAME': JSON.stringify(env.VITE_APP_NAME),
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(env.VITE_APP_VERSION)
    }
  }
})
```

---

## Validating Configuration

### Check Environment Variables

**Backend Check Script (backend/scripts/checkEnv.js):**

```javascript
require('dotenv').config();

const requiredEnvVars = [
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET',
  'PORT',
  'NODE_ENV'
];

console.log('🔍 Checking environment variables...\n');

let allPresent = true;

requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`❌ ${varName}: MISSING`);
    allPresent = false;
  }
});

if (allPresent) {
  console.log('\n✅ All required environment variables are set!');
} else {
  console.log('\n❌ Some environment variables are missing!');
  process.exit(1);
}

// Validate JWT_SECRET length
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  console.log('\n⚠️  WARNING: JWT_SECRET should be at least 32 characters!');
}
```

**Run check:**
```powershell
node backend/scripts/checkEnv.js
```

---

## Troubleshooting Configuration

### Common Issues

#### 1. "Cannot connect to database"

**Check:**
```powershell
# Verify PostgreSQL running
Get-Service postgresql*

# Test connection
psql -h localhost -U postgres -d juice_shop

# Check .env file exists
Test-Path backend\.env

# Verify variables
Get-Content backend\.env
```

**Fix:**
- Ensure PostgreSQL service running
- Check DB_HOST, DB_PORT, DB_USER, DB_PASSWORD
- Verify database exists: `juice_shop`

#### 2. "VITE_ variables not accessible"

**Issue:** Variables without `VITE_` prefix not exposed

**Fix:**
```env
# Wrong
API_URL=http://localhost:5000/api

# Correct
VITE_API_URL=http://localhost:5000/api
```

#### 3. "JWT token invalid"

**Check JWT_SECRET:**
```javascript
console.log('JWT Secret length:', process.env.JWT_SECRET.length);
// Should be 32+
```

**Fix:**
- Ensure JWT_SECRET is set
- Minimum 32 characters
- Same secret in all app instances

#### 4. "CORS error"

**Check CORS_ORIGIN:**
```env
# Make sure frontend URL included
CORS_ORIGIN=http://localhost:5173
```

**Fix:**
- Add frontend URL to CORS_ORIGIN
- Include all domains (dev, staging, prod)
- No trailing slash

---

## Configuration Best Practices

### Security Checklist

- ✅ Never commit .env files to Git
- ✅ Use strong, random secrets (32+ chars)
- ✅ Different secrets for dev/prod
- ✅ Rotate secrets regularly
- ✅ Use .env.example templates
- ✅ Restrict file permissions (chmod 600)
- ✅ Use secret management in production
- ✅ Enable HTTPS in production
- ✅ Set secure cookie flags
- ✅ Validate environment on startup

### Organization Tips

- 📁 Group related variables
- 📝 Add comments for clarity
- 🔤 Use UPPER_SNAKE_CASE naming
- 📋 Maintain .env.example file
- 🔄 Document changes in README
- ✏️ Use descriptive variable names
- 🎯 Keep .env file clean and organized

---

## Quick Reference

### Essential Variables

**Backend:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=juice_shop
PORT=5000
NODE_ENV=development
JWT_SECRET=minimum_32_character_random_string
CORS_ORIGIN=http://localhost:5173
```

**Frontend:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=ThiruSu Juice Shop
VITE_APP_VERSION=1.0.0
```

### File Locations
- Backend env: `backend/.env`
- Frontend env: `juice-shop/.env`
- Git ignore: `.gitignore`
- Example: `.env.example`

---

## You're Configured! ⚙️

Complete configuration knowledge for ThiruSu Juice Shop!

**Key Takeaways:**
- ✅ Separate configs for dev/prod
- ✅ Secure secrets management
- ✅ Environment-specific settings
- ✅ Proper validation and testing

**Happy Configuring!** 🚀⚙️
