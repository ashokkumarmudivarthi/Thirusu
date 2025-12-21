import axios from 'axios';

// Detect if running on mobile (Capacitor) or web
const isMobile = () => {
  return window.Capacitor !== undefined;
};

// API Base URL configuration
// For mobile: Use your laptop's local IP address (get it from ipconfig)
// For production: Replace with your deployed backend URL
const getApiBaseUrl = () => {
  if (isMobile()) {
    // TODO: Replace with your actual backend URL
    // Option 1: Use local IP for development (your laptop IP: 192.168.1.6)
    return 'http://192.168.1.6:5000/api'; // Using your detected local IP
    // Option 2: Use deployed backend
    // return 'https://your-backend-domain.com/api';
  }
  // Web development
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Products API
export const productsAPI = {
  getAll: async () => {
    const response = await api.get('/products');
    return response.data.products;
  },
  
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data.product;
  },
  
  updateStock: async (productSizeId, stockQuantity, notes = '') => {
    const response = await api.put(`/products/stock/${productSizeId}`, {
      stockQuantity: parseInt(stockQuantity, 10),
      notes,
    });
    return response.data;
  },
  
  bulkUpdateStock: async (updates) => {
    const response = await api.post('/products/stock/bulk-update', { updates });
    return response.data;
  },
  
  getStockHistory: async (productSizeId) => {
    const response = await api.get(`/products/stock/history/${productSizeId}`);
    return response.data.history;
  },
};

// Orders API
export const ordersAPI = {
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  
  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data.orders;
  },
  
  getById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data.order;
  },

  // Admin endpoints
  getAllOrders: async () => {
    const response = await api.get('/orders/admin/all');
    return response.data.orders;
  },

  updateOrderStatus: async (orderId, status, estimatedDeliveryDate = null) => {
    const body = { status };
    if (estimatedDeliveryDate) {
      body.estimatedDeliveryDate = estimatedDeliveryDate;
    }
    const response = await api.patch(`/orders/admin/${orderId}/status`, body);
    return response.data;
  },
};

export default api;
