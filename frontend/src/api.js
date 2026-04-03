import axios from 'axios';

/** Trong dev: dùng localhost, trong production: dùng URL tương đối */
const API_URL = (import.meta.env.VITE_API_URL) || '/api';

/** Gốc server (không có /api) — dùng cho ảnh /uploads/... */
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

export function mediaUrl(path) {
  if (path == null || path === '') return '';
  const s = String(path).trim();
  if (/^https?:\/\//i.test(s)) return s;
  const p = s.startsWith('/') ? s : `/${s}`;
  return `${API_ORIGIN}${p}`;
}

export function formatVnd(amount) {
  if (amount == null || amount === '' || Number.isNaN(Number(amount))) return '—';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount));
}

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  getAllUsers: () => api.get('/auth/users'),
  updateUser: (id, data) => api.put(`/auth/users/${id}`, data),
  deleteUser: (id) => api.delete(`/auth/users/${id}`)
};

export const categoryAPI = {
  getAll: (params) => api.get('/categories', { params }),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`)
};

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`)
};

export const orderAPI = {
  getAll: (params) => api.get('/orders', { params }),
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
  delete: (id) => api.delete(`/orders/${id}`)
};

export const reviewAPI = {
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  getAll: (params) => api.get('/reviews', { params }),
  create: (data) => api.post('/reviews', data),
  updateApproval: (id, data) => api.put(`/reviews/${id}/approval`, data),
  delete: (id) => api.delete(`/reviews/${id}`)
};

export const blogAPI = {
  getAll: (params) => api.get('/blogs', { params }),
  getById: (id) => api.get(`/blogs/${id}`),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`)
};

export const contactAPI = {
  getAll: (params) => api.get('/contacts', { params }),
  getById: (id) => api.get(`/contacts/${id}`),
  create: (data) => api.post('/contacts', data),
  markAsRead: (id) => api.put(`/contacts/${id}/read`),
  reply: (id, data) => api.put(`/contacts/${id}/reply`, data),
  delete: (id) => api.delete(`/contacts/${id}`)
};

export const settingsAPI = {
  get: (params) => api.get('/settings', { params }),
  seedDefaults: () => api.post('/settings/seed-defaults'),
  upsert: (data) => api.post('/settings', data),
  delete: (key) => api.delete(`/settings/${key}`)
};

export const uploadAPI = {
  uploadSingle: (formData) => api.post('/uploads/single', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadMultiple: (formData) => api.post('/uploads/multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

export default api;
