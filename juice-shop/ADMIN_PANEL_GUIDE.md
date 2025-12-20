# 🔐 Admin Panel Access Guide

## Admin Panel URL:
```
http://localhost:5174/admin
```

## Login Credentials:
- **Email:** `admin@thirusu.com`
- **Password:** `admin123`

---

## How to Access Admin Panel:

### Step 1: Start Backend Server
```bash
cd E:\ThiruSu\juice-shop\backend
npm run dev
```
✅ Backend will run on http://localhost:5000

### Step 2: Start Frontend Server
```bash
cd E:\ThiruSu\juice-shop
npm run dev
```
✅ Frontend will run on http://localhost:5174

### Step 3: Login as Admin
1. Go to: http://localhost:5174/login
2. Enter email: `admin@thirusu.com`
3. Enter password: `admin123`
4. Click "SIGN IN"

### Step 4: Access Admin Dashboard
After login, go to: http://localhost:5174/admin

OR click on "Admin" in the navigation menu (if added)

---

## What Can You Do in Admin Panel?

### 1. **View All Products**
- See all 48 products in database
- Each product shows all size variants (250ml, 500ml, 1L)
- View current stock levels for each size

### 2. **Update Stock Quantities**
- Click "Update Stock" button on any size variant
- Enter new stock quantity (e.g., 0, 5, 20, 100)
- Click "Save" to update
- Changes reflect immediately on the website

### 3. **Stock Status Indicators**
- 🟢 **Green "In Stock"** - 10+ units available
- 🟡 **Yellow "Low Stock"** - 1-9 units available
- 🔴 **Red "Out of Stock"** - 0 units available

---

## Example: Managing Stock

### Scenario 1: Product Runs Out of Stock
**Initial State:**
- Apple Juice 250ml: 25 units ✅ In Stock

**Customer Orders 25 Units:**
- Stock automatically deducts to: 0 units ❌ Out of Stock
- Product shows red badge on website
- "Add to Cart" button becomes disabled
- Customers cannot purchase until restocked

**Admin Updates Stock:**
1. Go to http://localhost:5174/admin
2. Find "Apple Juice Cleanse" product
3. Find "250ml" size row
4. Click "Update Stock"
5. Enter new quantity: `50`
6. Click "Save"
7. Stock now shows: 50 units ✅ In Stock
8. Product is available for purchase again!

### Scenario 2: Low Stock Alert
**When stock < 10:**
- Status changes to 🟡 Yellow "Low Stock"
- Admin knows to reorder inventory

---

## Admin Panel Features:

✅ **Real-time Updates** - Changes reflect immediately  
✅ **Product Management** - Update all 48 products  
✅ **Size Variants** - Manage stock for each size (250ml, 500ml, 1L)  
✅ **Visual Indicators** - Color-coded status for quick overview  
✅ **Total Stock Count** - See total units per product  
✅ **Refresh Button** - Reload latest data from database

---

## Troubleshooting:

### "Failed to login with admin credentials"
✅ **Solution:** Make sure backend server is running
```bash
cd E:\ThiruSu\juice-shop\backend
npm run dev
```

### "Cannot access /admin page"
✅ **Solution:** You must login first at http://localhost:5174/login

### "All products showing out of stock"
✅ **Solution:** This was fixed! Just refresh the page. Products now load from database with correct stock.

### "Stock not updating"
✅ **Solution:** 
1. Check backend server is running
2. Check browser console for errors
3. Try clicking "Refresh" button in admin panel

---

## Quick Access Checklist:

- [ ] Backend running (http://localhost:5000)
- [ ] Frontend running (http://localhost:5174)
- [ ] Logged in with admin credentials
- [ ] Navigate to http://localhost:5174/admin

---

**Remember:** Any stock changes you make in the admin panel will affect what customers see on the website immediately!
