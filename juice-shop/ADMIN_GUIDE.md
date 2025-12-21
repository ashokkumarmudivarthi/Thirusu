# ThiruSu Juice Shop - Admin Guide

## Admin Panel Documentation 🛠️

Complete guide for administrators to manage the juice shop platform.

---

## Table of Contents
1. [Admin Access](#admin-access)
2. [Dashboard Overview](#dashboard-overview)
3. [Product Management](#product-management)
4. [Order Management](#order-management)
5. [Scrolling Offers Management](#scrolling-offers-management)
6. [Customer Support](#customer-support)
7. [Notifications](#notifications)
8. [Best Practices](#best-practices)

---

## Admin Access

### Logging In as Admin
1. Navigate to: `http://localhost:5173/login`
2. Use **admin credentials**:
   - Email: Your admin email
   - Password: Your admin password
3. Click **"Login"**
4. If role is **'admin'**, you'll have full access

### Admin Role Requirements
- User account must have `role: 'admin'` in database
- Check user role in database:
  ```sql
  SELECT id, name, email, role FROM users WHERE email = 'admin@example.com';
  ```

### Creating Admin User
Use the backend script or manually update database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'youremail@example.com';
```

### Accessing Admin Panel
- Once logged in as admin
- Navigate to: `http://localhost:5173/admin`
- OR click **"Admin"** in the navigation (if available for admin users)

---

## Dashboard Overview

### Admin Dashboard Layout

#### Header Section
- **Title**: "Admin Dashboard"
- **Subtitle**: "Manage products, orders, and inventory"
- **Refresh Button**: Manual refresh for current tab
- **Support Dashboard Button**: Navigate to support-only view

#### Navigation Tabs
Four main tabs at the top:
1. **Products** - Inventory management
2. **Orders** - Order processing
3. **Scrolling Offers** - Banner offers management
4. **Customer Support** - Live chat support

### Dashboard Metrics
- Total products
- Low stock alerts
- Pending orders count
- Active support sessions

---

## Product Management

### Viewing Products

#### Product List
Shows all products with:
- **Product Image**
- **Product Name**
- **Category**
- **Price Range** (all sizes)
- **Total Stock** (sum of all sizes)
- **Stock Status Indicator**:
  - 🟢 Green: Good stock (>20 units)
  - 🟡 Yellow: Low stock (6-20 units)
  - 🔴 Red: Critical (<5 units)

#### Product Sizes
Each product has multiple sizes:
- **250ml** - Small
- **500ml** - Medium
- **1000ml** - Large

Each size shows:
- Price
- Current stock quantity
- Edit controls

### Managing Stock

#### Viewing Stock Levels
1. Navigate to **Products** tab
2. Each product shows total stock
3. Expand to see individual size stock levels

#### Updating Stock
1. Locate the product
2. Find the size (250ml/500ml/1000ml)
3. Click **edit icon** (pencil) next to stock number
4. Input field appears
5. Enter new stock quantity
6. Click **Save** (checkmark icon)
7. Or **Cancel** (X icon) to discard

#### Stock Indicators
- **Input Field**: White background for editing
- **Validation**: Only accepts numbers
- **Save Confirmation**: Success message appears
- **Auto-update**: Total stock recalculates

#### Low Stock Alerts
Products automatically flagged when:
- **Critical**: Total stock < 5 units (Red badge)
- **Low**: Total stock 5-20 units (Yellow badge)  
- **Good**: Total stock > 20 units (Green badge)

### Adding New Products
*(Feature planned - currently products added via database or import script)*

### Product Categories
Standard categories:
- Fresh Juices
- Wellness Shots
- Cleanse Programs
- Meal Plans

---

## Order Management

### Accessing Orders
Click **"Orders"** tab in admin dashboard

### Order Filtering

#### Filter by Status (Dropdown 1)
- **All Orders**: Show everything
- **Pending**: New orders awaiting processing
- **Processing**: Currently being prepared
- **Shipped**: Orders dispatched
- **Delivered**: Successfully completed
- **Cancelled**: Cancelled orders

#### Sort by Time (Dropdown 2)
- **Newest First**: Most recent orders at top (default)
- **Oldest First**: Oldest orders first (priority to old pending)

#### Filter Panel Features
- **Two side-by-side dropdowns** for filtering and sorting
- **Order count display**: "Showing X of Y orders"
- **Real-time filtering**: Updates immediately on selection

### Order List View

Each order card displays:

#### Order Header (Orange/Yellow Gradient)
- **Order ID**: Unique identifier
- **Order Date & Time**: When order was placed
- **Total Amount**: ₹ value
- **Item Count**: Number of items

#### Customer Information
- **Name**: Customer full name
- **Email**: Contact email
- **Phone**: Mobile number

#### Delivery Details
- **Complete Address**: Full delivery location
- **Delivery Date**: Requested delivery date
- **Delivery Status**: Current state

#### Order Items
- **Product Name**
- **Size**: 250ml/500ml/1000ml
- **Quantity**: Units ordered
- **Price**: ₹ per item
- **Subtotal**: Quantity × Price

#### Order Status Badge
Color-coded status indicator:
- 🟡 **Pending**: Yellow badge
- 🔵 **Processing**: Blue badge
- 🟣 **Shipped**: Purple badge
- 🟢 **Delivered**: Green badge
- 🔴 **Cancelled**: Red badge

### Managing Orders

#### Updating Order Status
1. Locate the order
2. Find **"Update Status"** dropdown
3. Select new status:
   - Pending → Processing
   - Processing → Shipped
   - Shipped → Delivered
4. Click **"Update Status"** button
5. Confirmation message appears
6. Order badge updates automatically

#### Updating Delivery Date
1. Find **"Delivery Date"** section
2. Click **edit icon** (calendar/pencil)
3. Date picker appears
4. Select new delivery date
5. Click **Save** (checkmark)
6. Or **Cancel** (X) to discard
7. Success message confirms update

#### Order Processing Workflow
**Recommended flow:**
1. **New Order** → Status: Pending
2. **Verify Stock** → Check product availability
3. **Start Preparing** → Status: Processing
4. **Package Complete** → Status: Shipped
5. **Delivered** → Status: Delivered
6. **Update Delivery Date** if needed

### Order Notifications

#### New Order Alerts
When customer places order:
- **Popup appears** in top-right corner
- **Shows order details**:
  - "🎉 X new order(s) received!"
  - Order #ID
  - Customer name
  - Total amount ₹
- **Auto-dismisses** after 5 seconds
- **Manual close** via X button
- **Works on ALL pages** (global notification)

#### Notification Features
- **Real-time detection**: Checks every 10 seconds
- **Background monitoring**: Works while you're on any page
- **Visible everywhere**: Admin, Support, any other page
- **Sound alert**: (Can be configured)
- **Click to view**: Redirects to Orders tab

### Order Statistics
- **Total Orders**: All time count
- **Pending Orders**: Needing attention
- **Today's Orders**: Orders placed today
- **Revenue**: Total sales value

---

## Scrolling Offers Management

### What are Scrolling Offers?
- Promotional text displayed at **top of website**
- **Scrolls automatically** across screen
- Visible to **all customers**
- Multiple offers rotate
- Eye-catching with icons

### Accessing Offers
Click **"Scrolling Offers"** tab in admin dashboard

### Viewing Offers

#### Offers List
Displays all offers with:
- **Icon**: Emoji/symbol (🎉, 🍹, 🥤, etc.)
- **Offer Text**: Promotional message
- **Status Badge**:
  - 🟢 **Active**: Currently showing
  - 🔴 **Inactive**: Not displayed
- **Action Buttons**: Edit, Toggle, Delete

### Creating New Offers

#### Steps to Create
1. Locate **"Create New Offer"** section at top
2. Fill in the form:
   - **Offer Text**: Promotional message
     - Example: "50% Off on All Wellness Shots!"
     - Keep concise (max ~50 characters for readability)
   - **Icon**: Choose emoji
     - Examples: 🎉 🍹 🥤 🌟 ⭐ 💥 🎊
     - Click to select from list
3. Click **"Create Offer"** button
4. Success message appears
5. Offer added to list as **Active**

#### Offer Best Practices
- **Keep it short**: 30-50 characters ideal
- **Action-oriented**: Use verbs (Get, Save, Try, Order)
- **Include value**: Mention discount or benefit
- **Use emojis**: Visual appeal
- **Urgency**: "Limited time", "Today only"
- **Clear CTA**: What customer should do

### Editing Offers

#### Steps to Edit
1. Find offer in the list
2. Click **"Edit"** button (pencil icon)
3. Edit mode activates:
   - Text input field appears
   - Icon selector shows
4. Modify:
   - **Update text**
   - **Change icon**
5. Click **"Save"** (checkmark icon)
6. Or **"Cancel"** (X icon) to discard
7. Confirmation appears

### Managing Offer Status

#### Toggle Active/Inactive
1. Locate offer
2. Click **"Toggle"** switch/button
3. Status changes:
   - Active → Inactive (stops showing)
   - Inactive → Active (starts showing)
4. Badge color updates
5. Customer site updates immediately

#### Active vs Inactive
- **Active**: 
  - Shows in scrolling banner
  - Green badge
  - Visible to customers
- **Inactive**:
  - Hidden from banner
  - Red badge
  - Not displayed to customers

### Deleting Offers

#### Steps to Delete
1. Find offer to remove
2. Click **"Delete"** button (trash icon)
3. Confirmation dialog: "Are you sure?"
4. Click **"Yes, Delete"** to confirm
5. Or **"Cancel"** to keep
6. Offer removed from list
7. Success message appears

**⚠️ Warning**: Deletion is permanent. Consider making inactive instead.

### Offer Display Order
Offers display in creation order. To reorder:
- Delete and recreate, OR
- Use database to update `display_order` column

### Default Offers
System comes with sample offers:
1. "🎉 Welcome! Get 10% off your first order!"
2. "🍹 Fresh cold-pressed juices delivered daily!"
3. "🥤 New arrivals: Exotic fruit blends now available!"
4. "🌟 Free delivery on orders above ₹500!"
5. "⭐ Try our 3-day cleanse program - Limited offer!"
6. "💥 Buy 2 Get 1 Free on all wellness shots!"
7. "🎊 Subscribe and save 15% on every order!"

---

## Customer Support

### Accessing Support Dashboard

#### Two Ways to Access:

**1. Via Admin Panel Tab**
- Click **"Customer Support"** tab
- Integrated within admin dashboard
- Part of main admin interface

**2. Via Support Dashboard Button**
- Click **"Support Dashboard"** button in header
- Opens dedicated support page (`/support`)
- Full-screen support interface
- **Back to Admin Panel** button to return

### Support Interface Layout

#### Left Panel: Chat Sessions List
Shows all customer chats with:
- **Customer Name/Display Name**
- **Subject**: Chat topic
- **Status Badge**:
  - 🟡 **Waiting**: No agent assigned
  - 🟢 **Active**: Agent connected
  - 🔒 **Closed**: Session ended
- **Unread Count**: New messages (red badge)
- **Last Activity**: Timestamp

#### Right Panel: Chat Window
- **Header**: Customer info and session details
- **Message Area**: Conversation history
- **Input Box**: Reply to customer
- **Send Button**: Send message

### Chat Session Filters

#### Filter Tabs
Two tabs to organize chats:
1. **Active Chats**: Shows Waiting + Active sessions
2. **Closed**: Shows completed/ended sessions

#### Switching Filters
- Click tab name
- List updates immediately
- Counter shows chat count
- Default: **Active Chats**

### Managing Chat Sessions

#### Viewing Sessions
1. **Active Chats tab**: See ongoing conversations
2. **Click on a session** to open chat
3. **Right panel loads** messages
4. **Scroll to view** entire conversation history

#### Session Information Displayed
- **Customer Details**:
  - Name
  - Email (if logged in)
  - Guest or Registered
- **Session Metadata**:
  - Started date/time
  - Last message timestamp
  - Agent assigned (if any)
  - Subject/topic

#### Responding to Customers

**Steps:**
1. Select chat session from list (left panel)
2. Chat opens in right panel
3. Read conversation history
4. Type reply in **input box** at bottom
5. Press **Enter** or click **Send** button
6. Message sent immediately
7. Customer sees your reply in real-time
8. Polling updates every 3 seconds

**Message Features:**
- **Timestamps**: All messages show time
- **Sender Identification**:
  - 👤 Customer messages (blue boxes, left-aligned)
  - 🎧 Your messages (orange boxes, right-aligned)
- **Online Indicator**: Shows when connected
- **Auto-scroll**: Jumps to latest message

#### Taking Over Waiting Sessions
When customer is waiting:
1. **Waiting sessions** show yellow badge
2. Click on the session
3. **Start typing** to assign yourself
4. Status auto-changes to **Active**
5. Customer gets notification: "Agent connected"
6. Your messages appear as agent responses

### Closing Chat Sessions

#### When to Close
- Issue resolved
- Customer satisfied
- No response for extended time
- At end of conversation

#### How to Close
1. Open the chat session
2. Click **"Close Chat Session"** button (bottom of chat window)
3. Confirmation dialog appears
4. Click **"Yes, Close"**
5. Session status → **Closed**
6. Moved to **Closed** tab
7. Chat remains read-only in history

#### After Closing
- Customer can view in their chat history
- Cannot send new messages in closed chat
- Can start new chat if needed
- Agent's active chat count decreases

### Auto-Close Feature
- **Inactive chats** (10+ minutes no messages) auto-close
- Helps clean up abandoned sessions
- Frees up agent capacity
- Runs automatically in background

### Agent Status Management

#### Setting Your Status
**In Support Dashboard page:**
1. Top-right corner shows status button
2. Click to toggle:
   - 🟢 **Online**: Available for chats
   - 🔴 **Offline**: Not taking new chats
3. Status updates immediately

#### Online Status
- **Accepts new chats**
- Auto-assigned to waiting customers
- Shows as available
- Active chats counted

#### Offline Status
- **No new chat assignments**
- Existing chats remain active
- Can still respond to current chats
- Shows as unavailable to customers

### Support Best Practices

#### Response Guidelines
1. **Respond promptly**: Aim for <1 minute
2. **Be professional**: Courteous language
3. **Personalize**: Use customer's name
4. **Be helpful**: Provide complete answers
5. **Clarify**: Ask if they need more help
6. **Close properly**: Confirm resolution before closing

#### Common Support Topics
- **Order Status**: Check in Orders tab
- **Product Questions**: Refer to product details
- **Delivery Issues**: Update delivery dates
- **Stock Queries**: Check inventory in Products
- **Payment**: COD confirmation
- **Account Issues**: Verify in database if needed

#### Handling Multiple Chats
- **Priority**: Waiting chats first
- **Active chats**: Respond in order
- **Queue management**: Don't take too many
- **Quick replies**: Use templates for common answers
- **Escalation**: Mark complex issues

---

## Notifications

### New Order Notifications

#### Global Notification System
**How It Works:**
- Monitors for new orders **every 10 seconds**
- Works **automatically** in background
- Shows popup **on any page** you're viewing
- Available to **Admin and Support roles only**

#### Notification Popup
**Appears when:**
- Customer places a new order
- Order count increases

**Displays:**
- 🎉 Celebration icon
- "X new order(s) received!"
- **Order #ID**
- **Customer Name**
- **Total Amount** (₹)
- **Auto-dismisses** after 5 seconds
- **Manual close** button (X)

#### Popup Position
- **Top-right corner** of screen
- **Fixed position** (z-index 9999)
- **Visible over all content**
- **Smooth slide-in animation**

#### Notification Behavior
- **Persistent across pages**: Works everywhere
- **Real-time**: Appears immediately
- **Non-intrusive**: Auto-hides
- **Clickable**: Can close manually
- **Accumulates**: Shows count if multiple orders

### Viewing After Notification
1. Notification appears
2. Click **"Orders"** tab
3. New order(s) at top (Newest First sorting)
4. Process as needed

### Notification Settings
*(Future feature: Configure notification preferences)*

---

## Best Practices

### Daily Admin Routine

#### Morning Checklist
1. **Login** to admin panel
2. **Check Orders tab**:
   - Filter: Pending
   - Sort: Oldest First
   - Process waiting orders
3. **Review Stock levels**:
   - Check low stock alerts
   - Update inventory as needed
4. **Check Support**:
   - Review waiting chats
   - Set status to Online
5. **Update Offers**:
   - Create daily/weekly promotions
   - Deactivate expired offers

#### Order Processing Flow
1. New order notification arrives
2. Navigate to **Orders** tab
3. Open order details
4. **Verify stock** for all items
5. Update status to **Processing**
6. Prepare order
7. Update status to **Shipped**
8. Confirm delivery date
9. After delivery, mark **Delivered**

#### Stock Management
1. **Weekly stock review**:
   - Products tab
   - Sort by low stock
   - Reorder inventory
2. **Update stock** after receiving supplies
3. **Monitor** popular items
4. **Maintain** minimum levels

#### Customer Support
1. **Set status** to Online during business hours
2. **Respond quickly** to waiting chats
3. **Close resolved** sessions
4. **Review closed** chats for feedback
5. **Set Offline** when unavailable

### Security Best Practices

#### Account Security
- **Strong password**: 12+ characters, mixed case, numbers, symbols
- **Logout** when leaving computer
- **Don't share** admin credentials
- **Regular password** changes

#### Data Protection
- **Verify** customer information before sharing
- **Don't discuss** orders publicly
- **Secure** customer data
- **Follow privacy** policies

### Efficiency Tips

#### Keyboard Shortcuts
- **Tab navigation**: Switch between sections
- **Enter to send**: Chat messages
- **Esc to close**: Modal dialogs

#### Multi-tasking
- **Use filters**: Quickly find specific orders/products
- **Sort options**: Prioritize work
- **Open in tabs**: Multiple admin tabs for different tasks
- **Notifications**: Stay aware without constant checking

#### Batch Operations
- **Update multiple** stocks at once
- **Process orders** in status groups
- **Create offers** for the week
- **Review chats** in batches

---

## Troubleshooting

### Cannot Access Admin Panel?
**Check:**
- User role is 'admin' in database
- Logged in with correct admin account
- URL is correct: `/admin`
- No browser console errors

**Solution:**
```sql
-- Verify/set admin role
SELECT role FROM users WHERE email = 'your@email.com';
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

### Stock Update Not Saving?
- Check network connection
- Verify valid number entered
- Refresh page
- Check browser console for errors

### Orders Not Updating?
- Click Refresh button
- Check filter settings
- Verify database connection
- Check backend logs

### Chat Messages Not Sending?
- Check internet connection
- Verify WebSocket/polling active
- Refresh page
- Check backend server status

### Notifications Not Appearing?
- Verify admin/support role
- Check browser permissions
- Console for errors
- Backend API running

---

## Database Access (Advanced)

### Direct Database Queries

**View all admins:**
```sql
SELECT id, name, email, role FROM users WHERE role = 'admin';
```

**Check order status:**
```sql
SELECT id, customer_name, status, total_amount, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;
```

**View low stock products:**
```sql
SELECT p.name, ps.size, ps.stock 
FROM products p
JOIN product_sizes ps ON p.id = ps.product_id
WHERE ps.stock < 5;
```

**Active chat sessions:**
```sql
SELECT id, customer_name, status, created_at 
FROM chat_sessions 
WHERE status IN ('waiting', 'active')
ORDER BY created_at DESC;
```

---

## API Endpoints (Reference)

### Authentication
- `POST /api/auth/register` - Create user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Product details
- `PATCH /api/products/sizes/:sizeId/stock` - Update stock

### Orders
- `GET /api/orders` - All orders (admin)
- `GET /api/orders/:id` - Order details
- `PATCH /api/orders/:id/status` - Update status
- `PATCH /api/orders/:id/delivery-date` - Update delivery date

### Offers
- `GET /api/offers` - All offers (admin)
- `GET /api/offers/active` - Active offers (public)
- `POST /api/offers` - Create offer
- `PUT /api/offers/:id` - Update offer
- `PATCH /api/offers/:id/toggle` - Toggle active status
- `DELETE /api/offers/:id` - Delete offer

### Chat
- `GET /api/chat/sessions/all` - All sessions (admin/support)
- `GET /api/chat/sessions/:id/messages` - Chat messages
- `POST /api/chat/sessions/:id/messages` - Send message
- `PATCH /api/chat/sessions/:id/close` - Close session
- `POST /api/agent/status` - Set agent online/offline

---

## Support & Maintenance

### Regular Maintenance
- **Daily**: Process orders, respond to chats
- **Weekly**: Review stock, update offers
- **Monthly**: Review analytics, customer feedback

### Backup Procedures
- Database backup recommended daily
- Export order reports weekly
- Archive old chat sessions monthly

### Performance Monitoring
- Check page load times
- Monitor API response times
- Review error logs
- Database query optimization

---

## Quick Reference

### Admin Credentials
- Email: `admin@juiceshop.com` (configure yours)
- Role: `admin` (in database)

### Key URLs
- Admin Panel: `/admin`
- Support Dashboard: `/support`
- Login: `/login`

### Important Settings
- Auto-refresh: 10 seconds (orders)
- Chat polling: 3 seconds
- Notification timeout: 5 seconds
- Auto-close chats: 10 minutes inactive

### Contact Tech Support
- For technical issues
- Database problems
- Feature requests
- Bug reports

---

## You're All Set! 🚀

This guide covers everything you need to effectively manage ThiruSu Juice Shop as an administrator. For questions or additional features, contact technical support.

**Happy Managing!** 🍹✨
