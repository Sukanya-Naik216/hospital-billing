import axios from 'axios';

const API = axios.create({ 
  baseURL: 'https://hospital-billing-api.onrender.com/api'
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = Bearer \;
  return config;
});

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  me: () => API.get('/auth/me'),
};

export const patientsAPI = {
  getAll: (search) => API.get('/patients', { params: { search } }),
  getById: (id) => API.get(/patients/\),
  create: (data) => API.post('/patients', data),
  update: (id, data) => API.put(/patients/\, data),
};

export const servicesAPI = {
  getAll: () => API.get('/services'),
  create: (data) => API.post('/services', data),
};

export const billsAPI = {
  getAll: (params) => API.get('/bills', { params }),
  getById: (id) => API.get(/bills/\),
  create: (data) => API.post('/bills', data),
  updateStatus: (id, status) => API.patch(/bills//status, { status }),
  cancel: (id) => API.delete(/bills/\),
};

export const paymentsAPI = {
  create: (data) => API.post('/payments', data),
  getByBill: (bill_id) => API.get(/payments/bill/\),
};

export const dashboardAPI = {
  getStats: () => API.get('/dashboard/stats'),
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

export const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
