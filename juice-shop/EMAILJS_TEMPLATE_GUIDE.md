# EmailJS Template Setup Guide

## 🔑 Your EmailJS Credentials
- **Service ID**: `service_ie2l1kg`
- **Public Key**: `_wCy461WHzxRVNDAm`
- **Dashboard**: https://dashboard.emailjs.com/

---

## 📧 Template 1: Welcome Email (New User Signup)

### Template ID: `template_welcome`

**Subject:** 
```
Welcome to ThiruSu Juice Shop! 🍹
```

**Email Body:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  <div style="background: linear-gradient(135deg, #FF6B35 0%, #FFA500 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 32px;">🍹 ThiruSu Juice Shop</h1>
  </div>
  
  <div style="background-color: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <h2 style="color: #FF6B35; margin-top: 0;">Welcome, {{to_name}}! 🎉</h2>
    
    <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">
      Thank you for joining <strong>ThiruSu Juice Shop</strong>! We're thrilled to have you as part of our healthy living community.
    </p>
    
    <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">
      Get ready to explore our premium collection of fresh juices, health cleanses, and nutritious meal plans designed just for you.
    </p>
    
    <div style="background-color: #FFF7ED; border-left: 4px solid #FF6B35; padding: 15px; margin: 25px 0;">
      <p style="margin: 0; color: #92400E; font-size: 14px;">
        💡 <strong>Pro Tip:</strong> Check out our featured products and seasonal specials!
      </p>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="http://localhost:5174" 
         style="background: linear-gradient(135deg, #FF6B35 0%, #FFA500 100%); 
                color: white; 
                padding: 14px 32px; 
                text-decoration: none; 
                border-radius: 8px; 
                font-weight: bold; 
                display: inline-block;">
        Start Shopping Now 🛒
      </a>
    </div>
    
    <p style="color: #6B7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
      Need help? Contact us at <a href="mailto:support@thirusu.com" style="color: #FF6B35;">support@thirusu.com</a>
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #9CA3AF; font-size: 12px;">
    <p>ThiruSu Juice Shop | Fresh, Healthy, Delicious</p>
    <p>You received this email because you signed up at ThiruSu Juice Shop</p>
  </div>
</div>
```

**Variables to use:**
- `{{to_name}}` - User's name
- `{{to_email}}` - User's email (auto-populated by EmailJS)
- `{{from_name}}` - Your shop name (ThiruSu Juice Shop)

---

## 🔐 Template 2: Password Reset Email

### Template ID: `template_reset`

**Subject:**
```
Password Reset Request for ThiruSu Juice Shop 🔐
```

**Email Body:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  <div style="background: linear-gradient(135deg, #DC2626 0%, #EF4444 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 32px;">🔐 Password Reset</h1>
  </div>
  
  <div style="background-color: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <h2 style="color: #DC2626; margin-top: 0;">Hi {{to_name}},</h2>
    
    <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">
      We received a request to reset your password for your <strong>ThiruSu Juice Shop</strong> account.
    </p>
    
    <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">
      Click the button below to create a new password:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{reset_link}}" 
         style="background: linear-gradient(135deg, #DC2626 0%, #EF4444 100%); 
                color: white; 
                padding: 14px 32px; 
                text-decoration: none; 
                border-radius: 8px; 
                font-weight: bold; 
                display: inline-block;">
        Reset My Password 🔑
      </a>
    </div>
    
    <div style="background-color: #FEF2F2; border-left: 4px solid #DC2626; padding: 15px; margin: 25px 0;">
      <p style="margin: 0; color: #991B1B; font-size: 14px;">
        ⚠️ <strong>Security Notice:</strong> This link will expire in 1 hour.
      </p>
    </div>
    
    <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
      If you didn't request a password reset, please ignore this email or contact support if you have concerns.
    </p>
    
    <p style="color: #9CA3AF; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <span style="color: #DC2626; word-break: break-all;">{{reset_link}}</span>
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #9CA3AF; font-size: 12px;">
    <p>ThiruSu Juice Shop | Fresh, Healthy, Delicious</p>
    <p>This is an automated email. Please do not reply.</p>
  </div>
</div>
```

**Variables to use:**
- `{{to_name}}` - User's name
- `{{to_email}}` - User's email
- `{{reset_link}}` - Password reset URL with token
- `{{from_name}}` - Your shop name

---

## 📝 How to Create Templates in EmailJS Dashboard

1. **Login to EmailJS**: https://dashboard.emailjs.com/
2. **Go to Email Templates**: Click "Email Templates" in sidebar
3. **Create New Template**: Click "+ Create New Template"
4. **Set Template ID**: 
   - For Welcome: `template_welcome`
   - For Reset: `template_reset`
5. **Copy-Paste Content**: 
   - Copy the subject and body from above
   - Make sure variables are wrapped in `{{variable_name}}`
6. **Test Template**: Use the "Test It" button with sample data
7. **Save Template**: Click "Save" button

---

## ✅ Testing Guide

### Test Welcome Email:
1. Go to http://localhost:5174/signup
2. Register with a real email address
3. Check your email inbox (also check spam folder)
4. You should receive the welcome email within 1-2 minutes

### Test Password Reset:
1. Go to http://localhost:5174/forgot-password
2. Enter your registered email
3. Check your email inbox
4. Click the reset link (should redirect to reset password page)
5. Set new password and test login

---

## 🔍 Troubleshooting

### Email not received?
- ✅ Check spam/junk folder
- ✅ Verify EmailJS service is active
- ✅ Check EmailJS dashboard for sending logs
- ✅ Verify template IDs match exactly
- ✅ Check browser console for errors (F12)

### EmailJS Quota:
- **Free Plan**: 200 emails/month
- **Monitor Usage**: Check dashboard for remaining quota
- If exceeded, upgrade plan or wait for monthly reset

---

## 🎯 Next Steps

After templates are created:
1. ✅ Test signup flow → Should send welcome email
2. ✅ Test forgot password → Should send reset email
3. ✅ Test reset link → Should work and expire after 1 hour
4. 🚀 Ready for production!

---

## 📞 Support

- **EmailJS Docs**: https://www.emailjs.com/docs/
- **EmailJS Dashboard**: https://dashboard.emailjs.com/
- **Template Variables**: https://www.emailjs.com/docs/user-guide/template-params/

---

**Created**: December 21, 2025
**Project**: ThiruSu Juice Shop - Email Integration
