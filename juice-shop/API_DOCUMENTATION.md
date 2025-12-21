# ThiruSu Juice Shop - API Documentation

## Complete API Reference 📡

Comprehensive documentation for all backend API endpoints.

---

## Table of Contents
1. [Base URL](#base-url)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Auth Endpoints](#auth-endpoints)
5. [Product Endpoints](#product-endpoints)
6. [Order Endpoints](#order-endpoints)
7. [Scrolling Offers Endpoints](#scrolling-offers-endpoints)
8. [Chat Support Endpoints](#chat-support-endpoints)
9. [Agent Status Endpoints](#agent-status-endpoints)
10. [Wishlist Endpoints](#wishlist-endpoints)

---

## Base URL

### Development
```
http://localhost:5000/api
```

### Production
```
https://your-domain.com/api
```

---

## Authentication

### JWT Authentication

Most endpoints require authentication via **JSON Web Tokens (JWT)**.

#### How It Works
1. User logs in via `/auth/login`
2. Server returns JWT token
3. Client includes token in subsequent requests
4. Server validates token and authorizes access

#### Including Token in Requests

**Authorization Header:**
```
Authorization: Bearer <your-jwt-token>
```

**Example:**
```javascript
fetch('http://localhost:5000/api/products', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
})
```

#### Token Payload
```json
{
  "userId": 1,
  "email": "user@example.com",
  "role": "customer",
  "iat": 1642345678,
  "exp": 1642432078
}
```

### Role-Based Access

Three user roles:
- **customer**: Regular user (shopping, orders)
- **admin**: Full access (products, orders, offers, support)
- **support**: Support access (chat, orders)

**Middleware:**
- `authenticate`: Requires any logged-in user
- `authorizeAdmin`: Requires admin role
- `optionalAuthenticate`: Works with or without authentication

---

## Error Handling

### Standard Error Response
```json
{
  "error": "Error message description",
  "details": "Additional error details (optional)"
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Success |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

### Common Error Examples

**401 Unauthorized:**
```json
{
  "error": "No token provided"
}
```

**403 Forbidden:**
```json
{
  "error": "Access denied. Admin only."
}
```

**400 Bad Request:**
```json
{
  "error": "Validation failed",
  "details": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

---

## Auth Endpoints

### POST /auth/register

Register a new user account.

**URL:** `/api/auth/register`

**Method:** `POST`

**Auth Required:** No

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "9876543210",
  "address": "123 Main St, City, State 12345"
}
```

**Validation Rules:**
- `name`: Required, string, min 2 chars
- `email`: Required, valid email, unique
- `password`: Required, min 6 chars
- `phone`: Required, 10 digits
- `address`: Required, string

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

**Error Responses:**

*400 - Validation Error:*
```json
{
  "error": "Email already exists"
}
```

*500 - Server Error:*
```json
{
  "error": "Registration failed"
}
```

**Example (JavaScript):**
```javascript
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123!',
    phone: '9876543210',
    address: '123 Main St, City'
  })
});

const data = await response.json();
console.log(data);
```

---

### POST /auth/login

Authenticate user and receive JWT token.

**URL:** `/api/auth/login`

**Method:** `POST`

**Auth Required:** No

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTY0MjM0NTY3OCwiZXhwIjoxNjQyNDMyMDc4fQ.abc123...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "123 Main St, City",
    "role": "customer"
  }
}
```

**Token Expiry:** 24 hours

**Error Responses:**

*400 - Invalid Credentials:*
```json
{
  "error": "Invalid credentials"
}
```

*404 - User Not Found:*
```json
{
  "error": "User not found"
}
```

**Example (JavaScript):**
```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'SecurePass123!'
  })
});

const { token, user } = await response.json();
localStorage.setItem('token', token);
```

---

### GET /auth/profile

Get current user profile information.

**URL:** `/api/auth/profile`

**Method:** `GET`

**Auth Required:** Yes

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St, City",
  "role": "customer",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**

*401 - Unauthorized:*
```json
{
  "error": "No token provided"
}
```

**Example (JavaScript):**
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:5000/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const profile = await response.json();
```

---

### PUT /auth/profile

Update user profile information.

**URL:** `/api/auth/profile`

**Method:** `PUT`

**Auth Required:** Yes

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "9999999999",
  "address": "456 New St, City"
}
```

**Success Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "John Updated",
    "email": "john@example.com",
    "phone": "9999999999",
    "address": "456 New St, City",
    "role": "customer"
  }
}
```

---

## Product Endpoints

### GET /products

Get all products with sizes and stock information.

**URL:** `/api/products`

**Method:** `GET`

**Auth Required:** No

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search by name

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "Green Detox Juice",
    "category": "Fresh Juices",
    "description": "A refreshing blend of spinach, kale, cucumber, and apple",
    "image": "/assets/products/green-detox.jpg",
    "sizes": [
      {
        "id": 1,
        "size": "250ml",
        "price": 89.00,
        "stock": 50
      },
      {
        "id": 2,
        "size": "500ml",
        "price": 149.00,
        "stock": 30
      },
      {
        "id": 3,
        "size": "1000ml",
        "price": 249.00,
        "stock": 15
      }
    ]
  },
  {
    "id": 2,
    "name": "Orange Immunity Booster",
    "category": "Wellness Shots",
    "description": "Fresh orange juice with ginger and turmeric",
    "image": "/assets/products/orange-booster.jpg",
    "sizes": [...]
  }
]
```

**Example (JavaScript):**
```javascript
// Get all products
const response = await fetch('http://localhost:5000/api/products');
const products = await response.json();

// Filter by category
const freshJuices = await fetch('http://localhost:5000/api/products?category=Fresh Juices');

// Search products
const searchResults = await fetch('http://localhost:5000/api/products?search=detox');
```

---

### GET /products/:id

Get single product details with sizes.

**URL:** `/api/products/:id`

**Method:** `GET`

**Auth Required:** No

**URL Parameters:**
- `id`: Product ID (integer)

**Success Response (200):**
```json
{
  "id": 1,
  "name": "Green Detox Juice",
  "category": "Fresh Juices",
  "description": "A refreshing blend of spinach, kale, cucumber, and apple",
  "image": "/assets/products/green-detox.jpg",
  "sizes": [
    {
      "id": 1,
      "size": "250ml",
      "price": 89.00,
      "stock": 50
    },
    {
      "id": 2,
      "size": "500ml",
      "price": 149.00,
      "stock": 30
    },
    {
      "id": 3,
      "size": "1000ml",
      "price": 249.00,
      "stock": 15
    }
  ]
}
```

**Error Responses:**

*404 - Not Found:*
```json
{
  "error": "Product not found"
}
```

**Example (JavaScript):**
```javascript
const productId = 1;
const response = await fetch(`http://localhost:5000/api/products/${productId}`);
const product = await response.json();
```

---

### PATCH /products/sizes/:sizeId/stock

Update stock for a specific product size (Admin only).

**URL:** `/api/products/sizes/:sizeId/stock`

**Method:** `PATCH`

**Auth Required:** Yes (Admin)

**URL Parameters:**
- `sizeId`: Product size ID (integer)

**Request Body:**
```json
{
  "stock": 100
}
```

**Success Response (200):**
```json
{
  "message": "Stock updated successfully",
  "size": {
    "id": 1,
    "product_id": 1,
    "size": "250ml",
    "price": 89.00,
    "stock": 100
  }
}
```

**Error Responses:**

*403 - Forbidden:*
```json
{
  "error": "Access denied. Admin only."
}
```

*400 - Invalid Stock:*
```json
{
  "error": "Stock must be a non-negative number"
}
```

**Example (JavaScript):**
```javascript
const token = localStorage.getItem('token');
const sizeId = 1;

const response = await fetch(`http://localhost:5000/api/products/sizes/${sizeId}/stock`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ stock: 100 })
});
```

---

## Order Endpoints

### POST /orders

Create a new order.

**URL:** `/api/orders`

**Method:** `POST`

**Auth Required:** Yes

**Request Body:**
```json
{
  "customerName": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St, City, State 12345",
  "deliveryDate": "2024-01-20",
  "items": [
    {
      "productId": 1,
      "sizeId": 2,
      "quantity": 2,
      "price": 149.00
    },
    {
      "productId": 3,
      "sizeId": 5,
      "quantity": 1,
      "price": 249.00
    }
  ],
  "totalAmount": 547.00
}
```

**Success Response (201):**
```json
{
  "message": "Order placed successfully",
  "orderId": 12,
  "order": {
    "id": 12,
    "customer_name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "123 Main St, City, State 12345",
    "delivery_date": "2024-01-20",
    "total_amount": 547.00,
    "status": "pending",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

*400 - Validation Error:*
```json
{
  "error": "Invalid order data"
}
```

*400 - Insufficient Stock:*
```json
{
  "error": "Insufficient stock for product"
}
```

---

### GET /orders

Get all orders (Admin) or user's orders (Customer).

**URL:** `/api/orders`

**Method:** `GET`

**Auth Required:** Yes

**Query Parameters (Admin only):**
- `status`: Filter by status (pending, processing, shipped, delivered, cancelled)
- `sort`: Sort order (newest, oldest)

**Success Response (200):**

*Admin View (all orders):*
```json
[
  {
    "id": 12,
    "user_id": 1,
    "customer_name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "123 Main St, City",
    "delivery_date": "2024-01-20",
    "total_amount": 547.00,
    "status": "pending",
    "created_at": "2024-01-15T10:30:00.000Z",
    "items": [
      {
        "product_name": "Green Detox Juice",
        "size": "500ml",
        "quantity": 2,
        "price": 149.00,
        "subtotal": 298.00
      },
      {
        "product_name": "Berry Blast",
        "size": "1000ml",
        "quantity": 1,
        "price": 249.00,
        "subtotal": 249.00
      }
    ]
  }
]
```

*Customer View (own orders only):*
```json
[
  {
    "id": 12,
    "customer_name": "John Doe",
    "total_amount": 547.00,
    "status": "pending",
    "created_at": "2024-01-15T10:30:00.000Z",
    "items": [...]
  }
]
```

**Example (JavaScript):**
```javascript
const token = localStorage.getItem('token');

// Get all orders (customer sees own, admin sees all)
const response = await fetch('http://localhost:5000/api/orders', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Admin: Filter and sort
const filtered = await fetch('http://localhost:5000/api/orders?status=pending&sort=oldest', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

### GET /orders/:id

Get specific order details.

**URL:** `/api/orders/:id`

**Method:** `GET`

**Auth Required:** Yes

**URL Parameters:**
- `id`: Order ID (integer)

**Success Response (200):**
```json
{
  "id": 12,
  "user_id": 1,
  "customer_name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St, City",
  "delivery_date": "2024-01-20",
  "total_amount": 547.00,
  "status": "pending",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z",
  "items": [
    {
      "id": 23,
      "product_id": 1,
      "product_name": "Green Detox Juice",
      "size": "500ml",
      "quantity": 2,
      "price": 149.00,
      "subtotal": 298.00
    }
  ]
}
```

**Error Responses:**

*404 - Not Found:*
```json
{
  "error": "Order not found"
}
```

*403 - Forbidden:*
```json
{
  "error": "Access denied"
}
```
(Customer trying to access another customer's order)

---

### PATCH /orders/:id/status

Update order status (Admin only).

**URL:** `/api/orders/:id/status`

**Method:** `PATCH`

**Auth Required:** Yes (Admin)

**URL Parameters:**
- `id`: Order ID (integer)

**Request Body:**
```json
{
  "status": "processing"
}
```

**Valid Status Values:**
- `pending`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

**Success Response (200):**
```json
{
  "message": "Order status updated successfully",
  "order": {
    "id": 12,
    "status": "processing",
    "updated_at": "2024-01-15T11:00:00.000Z"
  }
}
```

**Error Responses:**

*400 - Invalid Status:*
```json
{
  "error": "Invalid status value"
}
```

---

### PATCH /orders/:id/delivery-date

Update order delivery date (Admin only).

**URL:** `/api/orders/:id/delivery-date`

**Method:** `PATCH`

**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "deliveryDate": "2024-01-25"
}
```

**Success Response (200):**
```json
{
  "message": "Delivery date updated successfully",
  "order": {
    "id": 12,
    "delivery_date": "2024-01-25",
    "updated_at": "2024-01-15T11:00:00.000Z"
  }
}
```

---

## Scrolling Offers Endpoints

### GET /offers/active

Get all active scrolling offers (Public).

**URL:** `/api/offers/active`

**Method:** `GET`

**Auth Required:** No

**Success Response (200):**
```json
[
  {
    "id": 1,
    "offer_text": "🎉 Welcome! Get 10% off your first order!",
    "icon": "🎉",
    "is_active": true,
    "created_at": "2024-01-10T00:00:00.000Z"
  },
  {
    "id": 2,
    "offer_text": "🍹 Fresh cold-pressed juices delivered daily!",
    "icon": "🍹",
    "is_active": true,
    "created_at": "2024-01-10T00:00:00.000Z"
  }
]
```

**Example (JavaScript):**
```javascript
const response = await fetch('http://localhost:5000/api/offers/active');
const offers = await response.json();
```

---

### GET /offers

Get all offers including inactive (Admin only).

**URL:** `/api/offers`

**Method:** `GET`

**Auth Required:** Yes (Admin)

**Success Response (200):**
```json
[
  {
    "id": 1,
    "offer_text": "🎉 Welcome! Get 10% off your first order!",
    "icon": "🎉",
    "is_active": true,
    "created_at": "2024-01-10T00:00:00.000Z"
  },
  {
    "id": 5,
    "offer_text": "Expired offer",
    "icon": "❌",
    "is_active": false,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### POST /offers

Create new scrolling offer (Admin only).

**URL:** `/api/offers`

**Method:** `POST`

**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "offerText": "💥 Flash Sale: 50% off all wellness shots!",
  "icon": "💥"
}
```

**Success Response (201):**
```json
{
  "message": "Offer created successfully",
  "offer": {
    "id": 8,
    "offer_text": "💥 Flash Sale: 50% off all wellness shots!",
    "icon": "💥",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### PUT /offers/:id

Update existing offer (Admin only).

**URL:** `/api/offers/:id`

**Method:** `PUT`

**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "offerText": "💥 Updated: 50% off all wellness shots - Today only!",
  "icon": "💥"
}
```

**Success Response (200):**
```json
{
  "message": "Offer updated successfully",
  "offer": {
    "id": 8,
    "offer_text": "💥 Updated: 50% off all wellness shots - Today only!",
    "icon": "💥",
    "is_active": true
  }
}
```

---

### PATCH /offers/:id/toggle

Toggle offer active status (Admin only).

**URL:** `/api/offers/:id/toggle`

**Method:** `PATCH`

**Auth Required:** Yes (Admin)

**Success Response (200):**
```json
{
  "message": "Offer status toggled successfully",
  "offer": {
    "id": 8,
    "is_active": false
  }
}
```

---

### DELETE /offers/:id

Delete offer (Admin only).

**URL:** `/api/offers/:id`

**Method:** `DELETE`

**Auth Required:** Yes (Admin)

**Success Response (200):**
```json
{
  "message": "Offer deleted successfully"
}
```

---

## Chat Support Endpoints

### GET /chat/predefined-queries

Get predefined chat queries (FAQ).

**URL:** `/api/chat/predefined-queries`

**Method:** `GET`

**Auth Required:** No

**Success Response (200):**
```json
[
  {
    "id": 1,
    "query": "What are your delivery timings?",
    "category": "delivery"
  },
  {
    "id": 2,
    "query": "How do I track my order?",
    "category": "orders"
  },
  {
    "id": 3,
    "query": "What payment methods do you accept?",
    "category": "payment"
  }
]
```

---

### POST /chat/sessions

Create new chat session.

**URL:** `/api/chat/sessions`

**Method:** `POST`

**Auth Required:** Optional (works for guest users too)

**Request Body:**
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "subject": "Order delivery question"
}
```

**Success Response (201):**
```json
{
  "message": "Chat session created",
  "session": {
    "id": 25,
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "subject": "Order delivery question",
    "status": "waiting",
    "user_id": 1,
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Status Values:**
- `waiting`: No agent assigned
- `active`: Agent connected
- `closed`: Session ended

---

### GET /chat/sessions/my

Get user's chat sessions (Customer).

**URL:** `/api/chat/sessions/my`

**Method:** `GET`

**Auth Required:** Optional (uses userId if authenticated)

**Query Parameters:**
- `email` (optional): For guest users

**Success Response (200):**
```json
[
  {
    "id": 25,
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "subject": "Order delivery question",
    "status": "closed",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T11:00:00.000Z",
    "message_count": 5
  }
]
```

---

### GET /chat/sessions/all

Get all chat sessions (Admin/Support only).

**URL:** `/api/chat/sessions/all`

**Method:** `GET`

**Auth Required:** Yes (Admin or Support)

**Query Parameters:**
- `status`: Filter by status (active, waiting, closed)

**Success Response (200):**
```json
[
  {
    "id": 25,
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "subject": "Order delivery question",
    "status": "active",
    "user_id": 1,
    "agent_name": "Support Agent",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:45:00.000Z",
    "unread_count": 2
  }
]
```

**Note:** Sessions inactive for 10+ minutes are auto-closed.

---

### GET /chat/sessions/:id/messages

Get messages for a chat session.

**URL:** `/api/chat/sessions/:id/messages`

**Method:** `GET`

**Auth Required:** Optional

**URL Parameters:**
- `id`: Session ID (integer)

**Success Response (200):**
```json
[
  {
    "id": 45,
    "session_id": 25,
    "sender_type": "customer",
    "sender_name": "John Doe",
    "message": "Hello, when will my order be delivered?",
    "created_at": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 46,
    "session_id": 25,
    "sender_type": "agent",
    "sender_name": "Support Agent",
    "message": "Hi John! Let me check your order status.",
    "created_at": "2024-01-15T10:31:00.000Z"
  }
]
```

**Sender Types:**
- `customer`: Message from customer
- `agent`: Message from support agent

---

### POST /chat/sessions/:id/messages

Send message in chat session.

**URL:** `/api/chat/sessions/:id/messages`

**Method:** `POST`

**Auth Required:** Optional

**Request Body:**

*Customer Message:*
```json
{
  "message": "Thank you for the help!",
  "senderType": "customer",
  "senderName": "John Doe"
}
```

*Agent Message:*
```json
{
  "message": "You're welcome! Anything else?",
  "senderType": "agent",
  "senderName": "Support Agent"
}
```

**Success Response (201):**
```json
{
  "message": "Message sent",
  "chatMessage": {
    "id": 47,
    "session_id": 25,
    "sender_type": "customer",
    "sender_name": "John Doe",
    "message": "Thank you for the help!",
    "created_at": "2024-01-15T10:35:00.000Z"
  }
}
```

**Note:** Sending agent message auto-changes session status from 'waiting' to 'active'.

---

### PATCH /chat/sessions/:id/close

Close chat session.

**URL:** `/api/chat/sessions/:id/close`

**Method:** `PATCH`

**Auth Required:** Optional

**Success Response (200):**
```json
{
  "message": "Chat session closed",
  "session": {
    "id": 25,
    "status": "closed",
    "updated_at": "2024-01-15T11:00:00.000Z"
  }
}
```

---

## Agent Status Endpoints

### POST /agent/status

Set agent online/offline status (Admin/Support only).

**URL:** `/api/agent/status`

**Method:** `POST`

**Auth Required:** Yes (Admin or Support)

**Request Body:**
```json
{
  "isOnline": true
}
```

**Success Response (200):**
```json
{
  "message": "Agent status updated",
  "status": {
    "user_id": 2,
    "is_online": true,
    "updated_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### GET /agent/status

Check if any agent is online (Public).

**URL:** `/api/agent/status`

**Method:** `GET`

**Auth Required:** No

**Success Response (200):**
```json
{
  "agentAvailable": true,
  "onlineAgents": 2
}
```

---

## Wishlist Endpoints

### GET /wishlist

Get user's wishlist items.

**URL:** `/api/wishlist`

**Method:** `GET`

**Auth Required:** Yes

**Success Response (200):**
```json
[
  {
    "id": 5,
    "product_id": 3,
    "product_name": "Berry Blast",
    "category": "Fresh Juices",
    "image": "/assets/products/berry-blast.jpg",
    "added_at": "2024-01-14T15:00:00.000Z",
    "sizes": [
      {
        "id": 7,
        "size": "250ml",
        "price": 99.00,
        "stock": 40
      }
    ]
  }
]
```

---

### POST /wishlist

Add product to wishlist.

**URL:** `/api/wishlist`

**Method:** `POST`

**Auth Required:** Yes

**Request Body:**
```json
{
  "productId": 3
}
```

**Success Response (201):**
```json
{
  "message": "Product added to wishlist",
  "wishlistItem": {
    "id": 5,
    "user_id": 1,
    "product_id": 3,
    "added_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

*400 - Already in Wishlist:*
```json
{
  "error": "Product already in wishlist"
}
```

---

### DELETE /wishlist/:productId

Remove product from wishlist.

**URL:** `/api/wishlist/:productId`

**Method:** `DELETE`

**Auth Required:** Yes

**URL Parameters:**
- `productId`: Product ID (integer)

**Success Response (200):**
```json
{
  "message": "Product removed from wishlist"
}
```

---

## Rate Limiting

### Implementation
- **Rate Limit**: 100 requests per 15 minutes per IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

**Response When Limited (429):**
```json
{
  "error": "Too many requests, please try again later"
}
```

---

## CORS Configuration

### Allowed Origins
Development:
```
http://localhost:5173
http://localhost:3000
```

Production:
```
https://your-domain.com
```

### Allowed Methods
- GET
- POST
- PUT
- PATCH
- DELETE

### Allowed Headers
- Content-Type
- Authorization

---

## Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!",
    "phone": "9876543210",
    "address": "123 Test St"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### Get Products
```bash
curl http://localhost:5000/api/products
```

### Get Profile (with token)
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Testing with JavaScript Fetch

### Complete Example
```javascript
// 1. Register
const register = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'Test123!',
    phone: '9876543210',
    address: '123 Test St'
  })
});

// 2. Login
const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'Test123!'
  })
});

const { token } = await loginResponse.json();

// 3. Get Products
const products = await fetch('http://localhost:5000/api/products');
const productList = await products.json();

// 4. Create Order
const order = await fetch('http://localhost:5000/api/orders', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    customerName: 'Test User',
    email: 'test@example.com',
    phone: '9876543210',
    address: '123 Test St',
    deliveryDate: '2024-01-20',
    items: [
      { productId: 1, sizeId: 1, quantity: 2, price: 89.00 }
    ],
    totalAmount: 178.00
  })
});
```

---

## API Best Practices

### Request Headers
Always include:
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <token>' // if authenticated
}
```

### Error Handling
```javascript
try {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = await response.json();
    console.error('API Error:', error.error);
    // Handle error
  }
  
  const data = await response.json();
  // Success
} catch (err) {
  console.error('Network Error:', err);
}
```

### Token Management
```javascript
// Store token
localStorage.setItem('token', token);

// Retrieve token
const token = localStorage.getItem('token');

// Clear token (logout)
localStorage.removeItem('token');

// Check expiry
function isTokenExpired(token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return Date.now() >= payload.exp * 1000;
}
```

---

## Complete API Reference 🎯

You now have full documentation for all ThiruSu Juice Shop API endpoints!

**Endpoint Summary:**
- ✅ 4 Auth endpoints
- ✅ 3 Product endpoints  
- ✅ 5 Order endpoints
- ✅ 5 Scrolling Offers endpoints
- ✅ 7 Chat Support endpoints
- ✅ 2 Agent Status endpoints
- ✅ 3 Wishlist endpoints

**Total: 29 API Endpoints**

**Happy API Integration!** 🚀📡
