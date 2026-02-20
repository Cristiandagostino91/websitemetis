import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============= AUTHENTICATION =============
export const adminLogin = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const verifyToken = async () => {
  const response = await api.post('/auth/verify');
  return response.data;
};

export const getAdminMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// ============= FILE UPLOAD =============
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// ============= PRODUCTS =============
export const getProducts = async (featured = null) => {
  const params = featured !== null ? { featured } : {};
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// ============= SERVICES =============
export const getServices = async () => {
  const response = await api.get('/services');
  return response.data;
};

export const getService = async (id) => {
  const response = await api.get(`/services/${id}`);
  return response.data;
};

export const createService = async (serviceData) => {
  const response = await api.post('/services', serviceData);
  return response.data;
};

export const updateService = async (id, serviceData) => {
  const response = await api.put(`/services/${id}`, serviceData);
  return response.data;
};

export const deleteService = async (id) => {
  const response = await api.delete(`/services/${id}`);
  return response.data;
};

// ============= ORDERS =============
export const getOrders = async (status = null) => {
  const params = status ? { status } : {};
  const response = await api.get('/orders', { params });
  return response.data;
};

export const getOrder = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/orders/${id}`, { status });
  return response.data;
};

export const getOrderStats = async () => {
  const response = await api.get('/orders-stats');
  return response.data;
};

// ============= BOOKINGS =============
export const getBookings = async (status = null, date = null) => {
  const params = {};
  if (status) params.status = status;
  if (date) params.date = date;
  const response = await api.get('/bookings', { params });
  return response.data;
};

export const getBooking = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const updateBookingStatus = async (id, status) => {
  const response = await api.put(`/bookings/${id}`, { status });
  return response.data;
};

export const getAvailableSlots = async (date) => {
  const response = await api.get(`/bookings-available/${date}`);
  return response.data;
};

// ============= BLOG =============
export const getBlogPosts = async (published = null) => {
  const params = published !== null ? { published } : {};
  const response = await api.get('/blog', { params });
  return response.data;
};

export const getBlogPost = async (id) => {
  const response = await api.get(`/blog/${id}`);
  return response.data;
};

export const createBlogPost = async (postData) => {
  const response = await api.post('/blog', postData);
  return response.data;
};

export const updateBlogPost = async (id, postData) => {
  const response = await api.put(`/blog/${id}`, postData);
  return response.data;
};

export const deleteBlogPost = async (id) => {
  const response = await api.delete(`/blog/${id}`);
  return response.data;
};

// ============= CONTACT =============
export const createContactMessage = async (messageData) => {
  const response = await api.post('/contact', messageData);
  return response.data;
};

export const getContactMessages = async (status = null) => {
  const params = status ? { status } : {};
  const response = await api.get('/contact', { params });
  return response.data;
};

export const updateContactMessageStatus = async (id, status) => {
  const response = await api.put(`/contact/${id}`, { status });
  return response.data;
};

export default api;
