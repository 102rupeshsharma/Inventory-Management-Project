const API_URL = import.meta.env.VITE_API_URL;
 
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const url = `${API_URL}${endpoint}`;

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (error) {
    console.error('Fetch network error:', error);
    throw new Error('Unable to connect to the server. Please check if the backend server is running.');
  }

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (e) {
      throw new Error(`Invalid JSON response from server (Status: ${response.status})`);
    }
  } else {
    try {
      const text = await response.text();
      data = { message: text || `Server error (Status ${response.status})` };
    } catch (e) {
      data = { message: `Server error (Status ${response.status})` };
    }
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};
 
export const loginUser = async (email, password, role) => {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role })
  });
};

export const fetchAssets = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.category) params.append('category', filters.category);
  if (filters.status) params.append('status', filters.status);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  return request(`/assets${queryString}`, { method: 'GET' });
};

export const fetchAssetById = async (id) => {
  return request(`/assets/${id}`, { method: 'GET' });
};

export const createAsset = async (assetData) => {
  return request('/assets', {
    method: 'POST',
    body: JSON.stringify(assetData)
  });
};

export const updateAsset = async (id, assetData) => {
  return request(`/assets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(assetData)
  });
};

export const deleteAsset = async (id) => {
  return request(`/assets/${id}`, { method: 'DELETE' });
};

export const createRequest = async (assetId) => {
  return request('/requests', {
    method: 'POST',
    body: JSON.stringify({ assetId })
  });
};

export const fetchMyRequests = async () => {
  return request('/requests/my', { method: 'GET' });
};

export const fetchPendingRequests = async (status = 'pending') => {
  return request(`/requests/pending?status=${status}`, { method: 'GET' });
};

export const fetchDashboardStats = async () => {
  return request('/requests/stats', { method: 'GET' });
};

export const approveRequest = async (id) => {
  return request(`/requests/${id}/approve`, { method: 'PATCH' });
};

export const rejectRequest = async (id) => {
  return request(`/requests/${id}/reject`, { method: 'PATCH' });
};

export const fetchUsers = async () => {
  return request('/users', { method: 'GET' });
};

export const createUser = async (userData) => {
  return request('/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};

export const updateUser = async (id, userData) => {
  return request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  });
};

export const deleteUser = async (id) => {
  return request(`/users/${id}`, { method: 'DELETE' });
};

export const fetchAuditLogs = async () => {
  return request('/audit', { method: 'GET' });
};
