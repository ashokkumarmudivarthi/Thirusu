# Admin Panel Troubleshooting Guide

## Issue: Can't Access Admin Panel

### ✅ **SOLUTION - Follow These Steps:**

## Step 1: Make Sure BOTH Servers Are Running

### Start Backend (Terminal 1):
```powershell
cd E:\ThiruSu\juice-shop\backend
npm run dev
```
**Expected output:**
```
🚀 Server running on http://localhost:5000
```

### Start Frontend (Terminal 2):
```powershell
cd E:\ThiruSu\juice-shop
npm run dev
```
**Expected output:**
```
Local: http://localhost:5174
```

---

## Step 2: Clear Browser Cache & Logout

1. Open browser DevTools (F12)
2. Go to **Application** tab
3. Clear **Local Storage**
4. Clear **Session Storage**
5. Refresh page (Ctrl + F5)

---

## Step 3: Login as Admin

1. Go to: http://localhost:5174/login
2. Enter exactly:
   - Email: `admin@thirusu.com`
   - Password: `admin123`
3. Click "SIGN IN"

**Important:** Make sure backend is running BEFORE you login!

---

## Step 4: Access Admin Panel

After successful login, navigate to:
```
http://localhost:5174/admin
```

---

## 🐛 What You Should See:

### If Logged In as Admin:
✅ **Admin Dashboard** with:
- Header: "Admin Dashboard"
- Product cards with gradient headers
- Stock management table
- "Update Stock" buttons

### If NOT Logged In:
❌ Shows: "Authentication Required" message with "Go to Login" button

### If Logged In as Customer (not admin):
❌ Shows: "Access Denied" message with your email and role

---

## 💡 Common Issues & Solutions:

### Issue 1: "Cannot connect to server" or Login fails
**Solution:** Backend not running. Start it:
```powershell
cd E:\ThiruSu\juice-shop\backend
npm run dev
```

### Issue 2: Shows normal page, not admin dashboard
**Cause:** You're not logged in as admin or localStorage has old data

**Solution:**
1. Open DevTools (F12)
2. Console tab
3. Type: `localStorage.getItem('user')`
4. Check if it shows role: "admin"
5. If not, logout and login again

### Issue 3: "Access Denied" message
**Cause:** Logged in as customer, not admin

**Solution:**
1. Logout (if button available)
2. Or clear localStorage:
   ```javascript
   localStorage.clear()
   ```
3. Login again with admin credentials

### Issue 4: Page is blank/white
**Cause:** Frontend not running or error

**Solution:**
1. Check frontend is running on http://localhost:5174
2. Open DevTools Console (F12) and check for errors
3. Restart frontend:
   ```powershell
   cd E:\ThiruSu\juice-shop
   npm run dev
   ```

---

## 🔍 Debug Steps:

### Check if you're logged in as admin:

1. Open DevTools (F12)
2. Console tab
3. Run these commands:

```javascript
// Check user data
JSON.parse(localStorage.getItem('user'))

// Expected output:
{
  id: 1,
  name: "admin",
  email: "admin@thirusu.com",
  role: "admin"  // <-- This MUST be "admin"
}

// Check token
localStorage.getItem('token')
// Should show a long JWT string
```

### Check backend is working:

Open browser and go to:
```
http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "ThiruSu Juice Shop API is running"
}
```

---

## 📋 Complete Checklist:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5174
- [ ] Logged out / cleared localStorage
- [ ] Logged in with admin@thirusu.com / admin123
- [ ] Navigate to http://localhost:5174/admin
- [ ] See "Admin Dashboard" header

---

## 🎯 Quick Test:

Run this in browser console after login:
```javascript
fetch('http://localhost:5000/api/products', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(data => console.log('Products:', data.products.length))
```

Should show: `Products: 48`

---

## Still Not Working?

1. **Restart both servers**
2. **Clear ALL browser data** for localhost
3. **Try incognito/private window**
4. **Check browser console for errors**

If you see **"Access Denied"** with role showing "customer" instead of "admin", the admin user in database might not have the correct role. Need to check database.
