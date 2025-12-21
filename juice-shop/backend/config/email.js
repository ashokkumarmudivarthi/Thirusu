import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('❌ Email service error:', error.message);
    console.log('⚠️  Email features will not work. Please configure SMTP settings in .env');
  } else {
    console.log('✅ Email service ready');
  }
});

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"ThiruSu Juice Shop" <noreply@juiceshop.com>',
      to: email,
      subject: 'Welcome to ThiruSu Juice Shop! 🍹',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #FF6B35 0%, #FFA500 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🍹 Welcome to ThiruSu!</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333;">Hi ${name}! 👋</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for joining ThiruSu Juice Shop! We're excited to have you as part of our healthy living community.
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Get ready to experience:
            </p>
            
            <ul style="color: #666; font-size: 16px; line-height: 1.8;">
              <li>🥤 Fresh, cold-pressed juices delivered daily</li>
              <li>🌿 100% organic ingredients</li>
              <li>🚚 Free shipping on orders over ₹500</li>
              <li>⭐ Exclusive member discounts</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
                 style="background: linear-gradient(135deg, #FF6B35 0%, #FFA500 100%); 
                        color: white; 
                        padding: 15px 40px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-size: 16px;
                        display: inline-block;">
                Start Shopping 🛒
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Need help? Our support team is here for you!<br>
              Use the live chat feature or email us.
            </p>
            
            <p style="color: #666; font-size: 14px;">
              Cheers to your health! 🌟<br>
              The ThiruSu Team
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>ThiruSu Juice Shop | Fresh, Organic, Delivered</p>
            <p>© ${new Date().getFullYear()} All rights reserved</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', email);
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, name, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"ThiruSu Juice Shop" <noreply@juiceshop.com>',
      to: email,
      subject: 'Password Reset Request 🔐',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🔐 Password Reset</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333;">Hi ${name},</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              We received a request to reset your password for your ThiruSu account.
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Click the button below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 40px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-size: 16px;
                        display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Or copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
            </p>
            
            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                ⚠️ <strong>Important:</strong> This link will expire in 1 hour for security reasons.
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              If you didn't request a password reset, please ignore this email or contact support if you have concerns.
            </p>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Best regards,<br>
              The ThiruSu Team
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>ThiruSu Juice Shop | Fresh, Organic, Delivered</p>
            <p>© ${new Date().getFullYear()} All rights reserved</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent to:', email);
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
  }
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (email, name, order) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"ThiruSu Juice Shop" <noreply@juiceshop.com>',
      to: email,
      subject: `Order Confirmation #${order.id} 📦`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🎉 Order Confirmed!</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333;">Hi ${name}! 👋</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for your order! We're preparing your fresh juices with care.
            </p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Order Details</h3>
              <p style="color: #666; margin: 5px 0;"><strong>Order Number:</strong> #${order.id}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Total Amount:</strong> ₹${parseFloat(order.total_amount).toFixed(2)}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Status:</strong> <span style="color: #ffc107; font-weight: bold;">PENDING</span></p>
            </div>
            
            <h3 style="color: #333;">Items Ordered:</h3>
            <div style="border-top: 2px solid #f0f0f0; padding-top: 15px;">
              ${order.items.map(item => `
                <div style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                  <p style="margin: 5px 0; color: #333;"><strong>${item.productName}</strong> - ${item.size}</p>
                  <p style="margin: 5px 0; color: #666;">Quantity: ${item.quantity} × ₹${parseFloat(item.price).toFixed(2)}</p>
                </div>
              `).join('')}
            </div>
            
            <div style="background-color: #e7f3ff; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #2196F3;">
              <p style="margin: 0; color: #0066cc; font-size: 14px;">
                📍 <strong>Delivery Address:</strong><br>
                ${order.delivery_address || order.customer_name}
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/my-orders" 
                 style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); 
                        color: white; 
                        padding: 15px 40px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-size: 16px;
                        display: inline-block;">
                Track Order 📍
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Questions about your order? Feel free to contact us!
            </p>
            
            <p style="color: #666; font-size: 14px;">
              Stay healthy! 🌿<br>
              The ThiruSu Team
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>ThiruSu Juice Shop | Fresh, Organic, Delivered</p>
            <p>© ${new Date().getFullYear()} All rights reserved</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent to:', email);
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error.message);
  }
};

// Send order status update email
export const sendOrderStatusEmail = async (email, name, orderId, oldStatus, newStatus) => {
  try {
    const statusEmojis = {
      pending: '⏳',
      processing: '🔄',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌'
    };

    const statusColors = {
      pending: '#ffc107',
      processing: '#2196F3',
      shipped: '#9c27b0',
      delivered: '#4caf50',
      cancelled: '#f44336'
    };

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"ThiruSu Juice Shop" <noreply@juiceshop.com>',
      to: email,
      subject: `Order #${orderId} Status Update ${statusEmojis[newStatus]}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: ${statusColors[newStatus]}; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">${statusEmojis[newStatus]} Order Status Updated</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333;">Hi ${name}!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Your order #${orderId} status has been updated.
            </p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="color: #999; margin: 0; font-size: 14px; text-transform: uppercase;">Previous Status</p>
              <p style="color: #666; margin: 10px 0; font-size: 18px; text-transform: uppercase;">${oldStatus}</p>
              
              <div style="margin: 20px 0;">
                <span style="color: ${statusColors[newStatus]}; font-size: 30px;">↓</span>
              </div>
              
              <p style="color: #999; margin: 0; font-size: 14px; text-transform: uppercase;">New Status</p>
              <p style="color: ${statusColors[newStatus]}; margin: 10px 0; font-size: 24px; font-weight: bold; text-transform: uppercase;">
                ${statusEmojis[newStatus]} ${newStatus}
              </p>
            </div>
            
            ${newStatus === 'delivered' ? `
              <div style="background-color: #e8f5e9; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #4caf50;">
                <p style="margin: 0; color: #2e7d32; font-size: 14px;">
                  🎉 <strong>Your order has been delivered!</strong> We hope you enjoy your fresh juices!
                </p>
              </div>
            ` : ''}
            
            ${newStatus === 'shipped' ? `
              <div style="background-color: #f3e5f5; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #9c27b0;">
                <p style="margin: 0; color: #6a1b9a; font-size: 14px;">
                  🚚 <strong>Your order is on the way!</strong> Track your delivery for real-time updates.
                </p>
              </div>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/my-orders" 
                 style="background-color: ${statusColors[newStatus]}; 
                        color: white; 
                        padding: 15px 40px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-size: 16px;
                        display: inline-block;">
                View Order Details
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Thank you for choosing ThiruSu! 🙏
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>ThiruSu Juice Shop | Fresh, Organic, Delivered</p>
            <p>© ${new Date().getFullYear()} All rights reserved</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Order status email sent to:', email);
  } catch (error) {
    console.error('❌ Error sending order status email:', error.message);
  }
};

export default transporter;
