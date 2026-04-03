import { create } from 'zustand'
import { authAPI, skillsAPI, requestsAPI, sessionsAPI, usersAPI, reportsAPI, messagesAPI } from '../utils/api'

/**
 * Zustand Store for Global Application State
 * Manages user authentication, skills, and requests
 * 
 * This is the centralized state management solution for the Skill Swap Hub
 * using Zustand for lightweight, performant state with minimal boilerplate.
 */

export const useAppStore = create((set, get) => ({
  // ========== AUTH STATE ==========
  currentUser: null,
  isAuthenticated: false,
  authInitialized: false,
  loading: false,
  error: null,

  /**
   * User login with real API call
   * @param {Object} credentials - User email and password
   */
  login: async (credentials) => {
    set({ loading: true, error: null })
    try {
      const response = await authAPI.login(credentials)
      const { token } = response.data

      // Store token in localStorage
      localStorage.setItem('authToken', token)

      const currentUserResponse = await authAPI.getCurrentUser()
      const fullUser = currentUserResponse.data.user

      set({ currentUser: fullUser, isAuthenticated: true })
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed'
      set({ error: errorMessage })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  /**
   * User signup with real API call
   * @param {Object} userData - User registration data
   */
  signup: async (userData) => {
    set({ loading: true, error: null })
    try {
      const response = await authAPI.signup(userData)
      const { token } = response.data

      // Store token in localStorage
      localStorage.setItem('authToken', token)

      const currentUserResponse = await authAPI.getCurrentUser()
      const fullUser = currentUserResponse.data.user

      set({ currentUser: fullUser, isAuthenticated: true })
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Signup failed'
      set({ error: errorMessage })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  sendSignupVerificationCode: async (email) => {
    set({ loading: true, error: null })
    try {
      const response = await authAPI.sendVerificationCode({ email })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to send verification code'
      set({ error: errorMessage })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  verifySignupEmailCode: async ({ email, code, verificationToken }) => {
    set({ loading: true, error: null })
    try {
      const response = await authAPI.verifyEmailCode({ email, code, verificationToken })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Email verification failed'
      set({ error: errorMessage })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  /**
   * Logout user and clear state
   */
  logout: () => {
    localStorage.removeItem('authToken')
    set({ currentUser: null, isAuthenticated: false })
  },

  /**
   * Update user profile fields
   */
  updateProfile: async (profileData) => {
    set({ loading: true, error: null })
    try {
      await usersAPI.updateProfile(profileData)
      const refreshedUserResponse = await authAPI.getCurrentUser()
      const refreshedUser = refreshedUserResponse.data.user
      set({ currentUser: refreshedUser })
      return refreshedUser
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Profile update failed'
      set({ error: errorMessage })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  /**
   * Upload user profile image and refresh current user
   */
  uploadProfileImage: async (file) => {
    set({ loading: true, error: null })
    try {
      const formData = new FormData()
      formData.append('profileImage', file)
      await usersAPI.uploadProfileImage(formData)

      const refreshedUserResponse = await authAPI.getCurrentUser()
      const refreshedUser = refreshedUserResponse.data.user
      set({ currentUser: refreshedUser })
      return refreshedUser
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Profile image upload failed'
      set({ error: errorMessage })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  /**
   * Initialize auth state from token
   */
  initializeAuth: async () => {
    set({ loading: true, authInitialized: false })
    const token = localStorage.getItem('authToken')
    if (token) {
      try {
        const response = await authAPI.getCurrentUser()
        set({ currentUser: response.data.user, isAuthenticated: true })
      } catch (error) {
        localStorage.removeItem('authToken')
        set({ currentUser: null, isAuthenticated: false })
      }
    } else {
      set({ currentUser: null, isAuthenticated: false })
    }
    set({ loading: false, authInitialized: true })
  },

  // ========== SKILLS STATE ==========
  allSkills: [],
  filteredSkills: [],
  selectedCategory: 'All',
  skillsLoading: false,
  searchQuery: '',
  marketplaceUsers: [],
  marketplaceLoading: false,

  /**
   * Set search query and filter skills
   */
  setSearchQuery: (query) => {
    set({ searchQuery: query })
  },

  /**
   * Load all skills from API
   */
  loadSkills: async () => {
    set({ skillsLoading: true })
    try {
      const response = await skillsAPI.getAll()
      const skillsArray = Array.isArray(response.data) ? response.data : response.data?.skills || []
      set({
        allSkills: skillsArray,
        filteredSkills: skillsArray,
        skillsLoading: false,
      })
    } catch (error) {
      console.error('Failed to load skills:', error)
      set({ skillsLoading: false })
    }
  },

  /**
   * Filter skills by category
   * @param {string} category - Skill category to filter by
   */
  filterSkills: (category) => {
    set((state) => ({
      selectedCategory: category,
      filteredSkills:
        category === 'All'
          ? state.allSkills
          : state.allSkills.filter((skill) => skill.category === category),
    }))
  },

  /**
   * Search skills by name or tags
   * @param {string} query - Search query string
   */
  searchSkills: (query) => {
    set({ searchQuery: query })
  },

  /**
   * Load marketplace users from API
   */
  loadMarketplaceUsers: async () => {
    set({ marketplaceLoading: true })
    try {
      const response = await usersAPI.getAll()
      const usersArray = Array.isArray(response.data?.users) ? response.data.users : []
      set({
        marketplaceUsers: usersArray,
        marketplaceLoading: false,
      })
    } catch (error) {
      console.error('Failed to load marketplace users:', error)
      set({ marketplaceLoading: false })
    }
  },

  // ========== REQUESTS STATE ==========
  requestsSent: [],
  requestsReceived: [],
  requestsLoading: false,
  activeChatRequestId: null,

  /**
   * Load requests from API
   */
  loadRequests: async () => {
    set({ requestsLoading: true })
    try {
      const [sentResponse, receivedResponse] = await Promise.all([
        requestsAPI.getSent(),
        requestsAPI.getReceived(),
      ])
      set({
        requestsSent: sentResponse.data || [],
        requestsReceived: receivedResponse.data || [],
        requestsLoading: false,
      })
    } catch (error) {
      console.error('Failed to load requests:', error)
      set({ requestsLoading: false })
    }
  },

  /**
   * Send a new request
   */
  sendRequest: async (requestData) => {
    set({ requestsLoading: true, error: null })
    try {
      await requestsAPI.create(requestData)
      await get().loadRequests()
      return true
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to send request'
      set({ error: errorMessage, requestsLoading: false })
      throw error
    }
  },

  setActiveChatRequestId: (requestId) => set({ activeChatRequestId: requestId }),

  getAcceptedChatRequests: () => {
    const state = get()
    const combined = [...(state.requestsSent || []), ...(state.requestsReceived || [])]
    const acceptedMap = new Map()

    combined.forEach((request) => {
      if (request?.status !== 'accepted') return
      if (!request?._id) return
      if (!acceptedMap.has(request._id)) {
        acceptedMap.set(request._id, request)
      }
    })

    return Array.from(acceptedMap.values()).sort(
      (left, right) => new Date(right.createdAt || 0) - new Date(left.createdAt || 0)
    )
  },

  loadChatMessages: async (requestId) => {
    if (!requestId) {
      return { request: null, messages: [] }
    }

    set({ loading: true, error: null })
    try {
      const response = await messagesAPI.getByRequestId(requestId)
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to load messages'
      set({ error: errorMessage })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  sendChatMessage: async (requestId, content) => {
    set({ loading: true, error: null })
    try {
      const response = await messagesAPI.send(requestId, { content })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to send message'
      set({ error: errorMessage })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  /**
   * Report a user for inappropriate or inconvenient behavior
   */
  reportUser: async ({ reportedUserId, reason, details }) => {
    set({ loading: true, error: null })
    try {
      await reportsAPI.create({ reportedUserId, reason, details })
      return true
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to submit report'
      set({ error: errorMessage })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  submitUserReview: async ({ revieweeId, rating, comment }) => {
    set({ loading: true, error: null })
    try {
      const response = await usersAPI.submitReview(revieweeId, { rating, comment })
      await get().loadMarketplaceUsers()
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to submit review'
      set({ error: errorMessage })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  /**
   * Accept a received request
   */
  acceptRequest: async (requestId) => {
    set({ requestsLoading: true, error: null })
    try {
      await requestsAPI.accept(requestId)
      await Promise.all([get().loadRequests(), get().loadSessions()])

      const refreshedUserResponse = await authAPI.getCurrentUser()
      const refreshedUser = refreshedUserResponse.data.user
      set({ currentUser: refreshedUser })

      return true
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to accept request'
      set({ error: errorMessage, requestsLoading: false })
      throw error
    }
  },

  /**
   * Reject a received request
   */
  rejectRequest: async (requestId, responseMessage = '') => {
    set({ requestsLoading: true, error: null })
    try {
      await requestsAPI.reject(requestId, { responseMessage })
      await get().loadRequests()

      const refreshedUserResponse = await authAPI.getCurrentUser()
      const refreshedUser = refreshedUserResponse.data.user
      set({ currentUser: refreshedUser })

      return true
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to reject request'
      set({ error: errorMessage, requestsLoading: false })
      throw error
    }
  },

  // ========== SESSIONS STATE ==========
  activeSessions: [],
  completedSessions: [],
  sessionsLoading: false,

  /**
   * Load sessions from API
   */
  loadSessions: async () => {
    set({ sessionsLoading: true })
    try {
      const [activeResponse, completedResponse] = await Promise.all([
        sessionsAPI.getActive(),
        sessionsAPI.getCompleted(),
      ])
      const activeArr = Array.isArray(activeResponse.data)
        ? activeResponse.data
        : activeResponse.data?.sessions || []
      const completedArr = Array.isArray(completedResponse.data)
        ? completedResponse.data
        : completedResponse.data?.sessions || []

      set({
        activeSessions: activeArr,
        completedSessions: completedArr,
        sessionsLoading: false,
      })
    } catch (error) {
      console.error('Failed to load sessions:', error)
      set({ sessionsLoading: false })
    }
  },

  /**
   * Update session workflow status
   */
  updateSessionStatus: async (sessionId, status) => {
    set({ sessionsLoading: true, error: null })
    try {
      await sessionsAPI.updateStatus(sessionId, status)
      await get().loadSessions()
      return true
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update session status'
      set({ error: errorMessage, sessionsLoading: false })
      throw error
    }
  },

  /**
   * Submit a session review
   */
  submitSessionReview: async (sessionId, rating, comment) => {
    set({ sessionsLoading: true, error: null })
    try {
      await sessionsAPI.review(sessionId, { rating, comment })
      await get().loadSessions()
      return true
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to submit review'
      set({ error: errorMessage, sessionsLoading: false })
      throw error
    }
  },

  /**
   * Create a new session (after request is accepted)
   * @param {string} requestId - The request ID to convert to session
   */
  createSession: (requestId) => {
    set((state) => ({
      activeSessions: [
        ...state.activeSessions,
        {
          id: `session_${Date.now()}`,
          partner: state.requestsReceived.find((r) => r.id === requestId)?.sender,
          skillsExchanged: {
            offered: state.requestsReceived.find((r) => r.id === requestId)?.skillOffered,
            requested: state.requestsReceived.find((r) => r.id === requestId)?.skillRequested,
          },
          status: 'scheduled',
          startDate: null,
          scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          progress: 0,
          notes: 'Session initiated',
        },
      ],
    }))
  },

  // ========== UI STATE ==========
  sidebarOpen: true,
  notifications: [],

  /**
   * Toggle sidebar visibility
   */
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  /**
   * Add notification
   * @param {Object} notification - Notification object
   */
  addNotification: (notification) => {
    set((state) => ({
      notifications: [...state.notifications, { id: Date.now(), ...notification }],
    }))
  },

  /**
   * Remove notification
   * @param {string} id - Notification ID
   */
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },
}))

/**
 * Additional Admin Store for Admin Dashboard
 * Manages admin-specific data and operations
 */
export const useAdminStore = create((set) => ({
  users: [
    {
      id: 'user_1',
      name: 'John Doe',
      email: 'john@college.edu',
      role: 'student',
      status: 'active',
      joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      skillsOffered: 3,
      completedSessions: 12,
    },
    {
      id: 'user_2',
      name: 'Jane Smith',
      email: 'jane@college.edu',
      role: 'student',
      status: 'active',
      joinDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      skillsOffered: 2,
      completedSessions: 8,
    },
    {
      id: 'user_3',
      name: 'Admin User',
      email: 'admin@college.edu',
      role: 'admin',
      status: 'active',
      joinDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      skillsOffered: 0,
      completedSessions: 0,
    },
  ],

  platformStats: {
    totalUsers: 248,
    activeUsers: 156,
    totalSkills: 542,
    completedSessions: 1023,
    averageRating: 4.7,
    platformHealth: 98,
  },

  /**
   * Get platform statistics
   */
  getStats: () => (state) => state.platformStats,

  /**
   * Update user status
   * @param {string} userId - User to update
   * @param {string} status - New status
   */
  updateUserStatus: (userId, status) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, status } : user
      ),
    }))
  },
}))
