import { createContext, useContext, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ordersAPI } from '../services/api';
import { useAuth } from './AuthContext';

const OrderNotificationContext = createContext();

export function OrderNotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    // Only run for admin/support users
    if (!user || (user.role !== 'admin' && user.role !== 'support')) {
      return;
    }

    // Initial fetch to set baseline
    const initializeOrderCount = async () => {
      try {
        const data = await ordersAPI.getAllOrders();
        setLastOrderCount(data.length);
      } catch (error) {
        console.error('Error fetching initial orders:', error);
      }
    };

    initializeOrderCount();

    // Poll for new orders every 10 seconds
    const interval = setInterval(async () => {
      try {
        const data = await ordersAPI.getAllOrders();
        
        if (lastOrderCount > 0 && data.length > lastOrderCount) {
          const newOrdersCount = data.length - lastOrderCount;
          const latestOrder = data[0]; // Assuming newest first
          
          showNotification({
            count: newOrdersCount,
            orderId: latestOrder.id,
            customerName: latestOrder.customer_name,
            amount: latestOrder.total_amount
          });
        }
        
        setLastOrderCount(data.length);
      } catch (error) {
        console.error('Error checking for new orders:', error);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [user, lastOrderCount]);

  const showNotification = (orderInfo) => {
    setNotification(orderInfo);
    setTimeout(() => setNotification(null), 5000); // Auto-dismiss after 5 seconds
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  return (
    <OrderNotificationContext.Provider value={{ notification, dismissNotification }}>
      {/* Global Notification Popup */}
      {notification && (
        <div className="fixed top-24 right-6 z-[9999] animate-slide-in">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[350px]">
            <div className="text-3xl">🎉</div>
            <div className="flex-1">
              <p className="font-bold text-lg mb-1">
                {notification.count} New Order{notification.count > 1 ? 's' : ''} Received!
              </p>
              <p className="text-sm text-green-100">Order #{notification.orderId}</p>
              <p className="text-sm text-green-100">
                {notification.customerName} • ₹{parseFloat(notification.amount).toFixed(2)}
              </p>
            </div>
            <button
              onClick={dismissNotification}
              className="text-white hover:text-green-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
      {children}
    </OrderNotificationContext.Provider>
  );
}

export function useOrderNotification() {
  const context = useContext(OrderNotificationContext);
  if (!context) {
    throw new Error('useOrderNotification must be used within OrderNotificationProvider');
  }
  return context;
}
