const API_BASE_URL = 'http://localhost:5000/api';

export const getToken = () => localStorage.getItem('authToken');
export const setToken = (token) => localStorage.setItem('authToken', token);
export const clearToken = () => localStorage.removeItem('authToken');

const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    method: 'GET',
    headers: {
      ...getHeaders(true),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error at ${endpoint}:`, error);
    throw error;
  }
};

export const authAPI = {
  register: (email, password, name) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
      headers: getHeaders(false),
    }),

  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: getHeaders(false),
    }),

  logout: () => {
    clearToken();
    return Promise.resolve();
  },

  verify: () =>
    apiCall('/auth/verify', {
      method: 'GET',
    }),

  refresh: () =>
    apiCall('/auth/refresh', {
      method: 'POST',
    }),
};

export const invoiceAPI = {
  create: (invoiceData) =>
    apiCall('/invoice', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    }),

  getAll: () =>
    apiCall('/invoice', {
      method: 'GET',
    }),

  getById: (id) =>
    apiCall(`/invoice/${id}`, {
      method: 'GET',
    }),

  update: (id, invoiceData) =>
    apiCall(`/invoice/${id}`, {
      method: 'PUT',
      body: JSON.stringify(invoiceData),
    }),

  delete: (id) =>
    apiCall(`/invoice/${id}`, {
      method: 'DELETE',
    }),
};

export const clientAPI = {
  create: (clientData) =>
    apiCall('/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    }),

  getAll: () =>
    apiCall('/clients', {
      method: 'GET',
    }),

  getById: (id) =>
    apiCall(`/clients/${id}`, {
      method: 'GET',
    }),

  update: (id, clientData) =>
    apiCall(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    }),

  delete: (id) =>
    apiCall(`/clients/${id}`, {
      method: 'DELETE',
    }),
};

export const paymentAPI = {
  create: (paymentData) =>
    apiCall('/payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),

  getAll: () =>
    apiCall('/payment', {
      method: 'GET',
    }),

  getById: (id) =>
    apiCall(`/payment/${id}`, {
      method: 'GET',
    }),

  update: (id, paymentData) =>
    apiCall(`/payment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    }),

  delete: (id) =>
    apiCall(`/payment/${id}`, {
      method: 'DELETE',
    }),
};

export const userAPI = {
  getProfile: () =>
    apiCall('/user/profile', {
      method: 'GET',
    }),

  updateProfile: (userData) =>
    apiCall('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  updatePassword: (currentPassword, newPassword) =>
    apiCall('/user/profile/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

export const pdfAPI = {
  preview: (invoiceId) =>
    apiCall(`/pdf/preview/${invoiceId}`, {
      method: 'GET',
    }),

  download: (invoiceId) => {
    const token = getToken();
    window.location.href = `${API_BASE_URL}/pdf/download/${invoiceId}?token=${token}`;
  },
};

export const emailAPI = {
  sendInvoice: (invoiceId, recipientEmail) =>
    apiCall('/email/invoice', {
      method: 'POST',
      body: JSON.stringify({ invoiceId, recipientEmail }),
    }),

  sendPaymentConfirmation: (invoiceId, recipientEmail, amount) =>
    apiCall('/email/payment-confirmation', {
      method: 'POST',
      body: JSON.stringify({ invoiceId, recipientEmail, amount }),
    }),

  sendReminder: (invoiceId, recipientEmail) =>
    apiCall('/email/reminder', {
      method: 'POST',
      body: JSON.stringify({ invoiceId, recipientEmail }),
    }),
};
