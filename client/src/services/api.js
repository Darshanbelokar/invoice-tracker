const API_BASE_URL = 'http://localhost:5000/api';

// Checks both 'authToken' and 'token' keys in case of naming discrepancies
export const getToken = () => {
  return localStorage.getItem('authToken') || localStorage.getItem('token');
};

const notifyAuthChange = () => {
  // Dispatches both event variations to guarantee listeners in App.jsx pick up changes
  window.dispatchEvent(new Event('auth-changed'));
  window.dispatchEvent(new Event('auth-change'));
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('token', token);
  }
  notifyAuthChange();
};

export const clearToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('token');
  notifyAuthChange();
};

// Export alias so both import styles work across all components
export const removeToken = clearToken;

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
      // If token expires or server returns 401, clear local storage
      if (response.status === 401) {
        clearToken();
      }
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

  forgotPassword: (email) =>
    apiCall('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: getHeaders(false),
    }),

  resetPassword: (token, newPassword) =>
    apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
      headers: getHeaders(false),
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

  download: async (invoiceId) => {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/pdf/download/${invoiceId}`, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      let message = `Download failed: ${response.status}`;

      try {
        const errorData = await response.json();
        message = errorData.message || message;
      } catch {
        // Keep standard fallback error message
      }

      throw new Error(message);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `invoice-${invoiceId}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
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