// API Configuration
const API_CONFIG = {
  // Base URL for all API calls
  BASE_URL: 'http://localhost:5000',
  
  // API Endpoints
  ENDPOINTS: {
    // Health check
    HEALTH: '/health',
    
    // Authentication endpoints
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      ME: '/api/auth/me',
      LOGOUT: '/api/auth/logout'
    },
    
    // Admin authentication
    ADMIN_AUTH: {
      LOGIN: '/api/admin-auth/login',
      LOGOUT: '/api/admin-auth/logout'
    },
    
    // Health forms endpoints
    HEALTH_FORMS: {
      CREATE: '/api/health-forms',
      GET_ALL: '/api/health-forms',
      GET_BY_ID: '/api/health-forms',
      STATISTICS: '/api/health-forms/statistics/user'
    },
    
    // Admin endpoints
    ADMIN: {
      DASHBOARD: '/api/admin/dashboard/statistics',
      HEALTH_FORMS: '/api/admin/health-forms',
      MONTHLY_REPORTS: '/api/admin/reports/monthly-data'
    }
  }
};

// Helper function to build complete URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function for making API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  
  console.log('🌐 Making API call:', {
    endpoint,
    url,
    method: options.method || 'GET'
  });
  
  // Default headers
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  // Add Authorization header if token exists
  // Check for admin token first, then user token
  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('authToken');
  const token = adminToken || userToken;
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
    console.log('🔑 Added authorization token');
  }
  
  // Merge headers
  const headers = {
    ...defaultHeaders,
    ...options.headers
  };
  
  console.log('📋 Request headers:', headers);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    
    const data = await response.json();
    
    console.log('📦 Response data:', data);
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`❌ API call failed for ${endpoint}:`, error);
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    throw error;
  }
};

// Specific API functions
export const authAPI = {
  login: (credentials) => apiCall(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  register: (userData) => apiCall(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  getMe: () => apiCall(API_CONFIG.ENDPOINTS.AUTH.ME),
  
  logout: () => apiCall(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
    method: 'POST'
  })
};

export const healthFormsAPI = {
  create: (formData) => apiCall(API_CONFIG.ENDPOINTS.HEALTH_FORMS.CREATE, {
    method: 'POST',
    body: JSON.stringify(formData)
  }),
  
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? 
      `${API_CONFIG.ENDPOINTS.HEALTH_FORMS.GET_ALL}?${queryString}` : 
      API_CONFIG.ENDPOINTS.HEALTH_FORMS.GET_ALL;
    return apiCall(endpoint);
  },
  
  getById: (formId) => apiCall(`${API_CONFIG.ENDPOINTS.HEALTH_FORMS.GET_BY_ID}/${formId}`),
  
  getStatistics: () => apiCall(API_CONFIG.ENDPOINTS.HEALTH_FORMS.STATISTICS)
};

export const adminAPI = {
  login: (credentials) => apiCall(API_CONFIG.ENDPOINTS.ADMIN_AUTH.LOGIN, {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  getDashboardStats: () => apiCall(API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD),
  
  getHealthForms: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? 
      `${API_CONFIG.ENDPOINTS.ADMIN.HEALTH_FORMS}?${queryString}` : 
      API_CONFIG.ENDPOINTS.ADMIN.HEALTH_FORMS;
    return apiCall(endpoint);
  },
  
  deleteHealthForm: (formId) => apiCall(`${API_CONFIG.ENDPOINTS.ADMIN.HEALTH_FORMS}/${formId}`, {
    method: 'DELETE'
  }),
  
  getMonthlyData: (year) => {
    const params = year ? `?year=${year}` : '';
    return apiCall(`${API_CONFIG.ENDPOINTS.ADMIN.MONTHLY_REPORTS}${params}`);
  }
};

export default API_CONFIG;
