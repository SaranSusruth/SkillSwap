/**
 * API Service Configuration
 * Centralized API client setup for backend integration
 * 
 * This file should be updated when connecting to the actual backend
 */

import axios from 'axios'

/**
 * API Base Configuration
 * Replace BASE_URL with your backend server address
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

/**
 * Create Axios instance with default config
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 second timeout
})

/**
 * Request Interceptor
 * Adds authentication token to all requests
 */
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Retrieve token from localStorage or context
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * Handles errors and token refresh
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // TODO: Implement token refresh logic
        // const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`)
        // const newToken = refreshResponse.data.token
        // localStorage.setItem('authToken', newToken)
        // originalRequest.headers.Authorization = `Bearer ${newToken}`
        // return apiClient(originalRequest)
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.status)
      // TODO: Show error notification to user
    }

    return Promise.reject(error)
  }
)

/**
 * API Service Methods
 * Structured API endpoints
 */
export const authAPI = {
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  signup: (data) => apiClient.post('/auth/register', data),
  sendVerificationCode: (data) => apiClient.post('/auth/send-verification-code', data),
  verifyEmailCode: (data) => apiClient.post('/auth/verify-email-code', data),
  refreshToken: () => apiClient.post('/auth/refresh'),
  getCurrentUser: () => apiClient.get('/auth/me'),
}

export const skillsAPI = {
  getAll: (params) => apiClient.get('/skills', { params }),
  getById: (id) => apiClient.get(`/skills/${id}`),
  create: (data) => apiClient.post('/skills', data),
  update: (id, data) => apiClient.put(`/skills/${id}`, data),
  delete: (id) => apiClient.delete(`/skills/${id}`),
  search: (query) => apiClient.get('/skills/search', { params: { q: query } }),
}

export const requestsAPI = {
  getSent: () => apiClient.get('/requests/sent'),
  getReceived: () => apiClient.get('/requests/received'),
  create: (data) => apiClient.post('/requests', data),
  accept: (id) => apiClient.put(`/requests/${id}/accept`),
  reject: (id, data = {}) => apiClient.put(`/requests/${id}/reject`, data),
  getById: (id) => apiClient.get(`/requests/${id}`),
}

export const sessionsAPI = {
  getActive: () => apiClient.get('/sessions/active'),
  getCompleted: () => apiClient.get('/sessions/completed'),
  create: (data) => apiClient.post('/sessions', data),
  update: (id, data) => apiClient.put(`/sessions/${id}`, data),
  updateStatus: (id, status) => apiClient.put(`/sessions/${id}/status`, { status }),
  review: (id, data) => apiClient.post(`/sessions/${id}/review`, data),
}

export const messagesAPI = {
  getByRequestId: (requestId) => apiClient.get(`/messages/${requestId}`),
  send: (requestId, data) => apiClient.post(`/messages/${requestId}`, data),
}

export const usersAPI = {
  getProfile: (id) => apiClient.get(`/users/${id}`),
  updateProfile: (data) => apiClient.put('/users/profile', data),
  submitReview: (id, data) => apiClient.post(`/users/${id}/reviews`, data),
  uploadProfileImage: (formData) =>
    apiClient.post('/users/profile/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAll: (params) => apiClient.get('/users', { params }),
  getRatings: (id) => apiClient.get(`/users/${id}/ratings`),
  getReviews: (id) => apiClient.get(`/users/${id}/reviews`),
}

export const reportsAPI = {
  create: (data) => apiClient.post('/reports', data),
}

export const adminAPI = {
  getStats: () => apiClient.get('/reports/admin/stats'),
  getReportedUsers: () => apiClient.get('/reports/admin/stats'),
  getUserReports: (userId) => apiClient.get(`/reports/admin/users/${userId}/reports`),
  blockUser: (userId) => apiClient.put(`/reports/admin/users/${userId}/block`),
}

export default apiClient
