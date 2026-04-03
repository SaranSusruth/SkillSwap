/**
 * Utility Functions
 * Common helper functions used throughout the application
 */

/**
 * Format date to readable string
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format time difference (e.g., "2 days ago")
 * @param {Date} date - Date to format
 * @returns {string} - Time difference string
 */
export const formatTimeAgo = (date) => {
  const now = new Date()
  const diffMs = now - new Date(date)
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return formatDate(date)
}

/**
 * Truncate string to specified length
 * @param {string} str - String to truncate
 * @param {number} length - Max length
 * @returns {string} - Truncated string
 */
export const truncateString = (str, length = 100) => {
  return str.length > length ? `${str.substring(0, length)}...` : str
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Calculate average rating
 * @param {array} ratings - Array of rating numbers
 * @returns {number} - Average rating
 */
export const calculateAverageRating = (ratings = []) => {
  if (ratings.length === 0) return 0
  const sum = ratings.reduce((acc, rating) => acc + rating, 0)
  return (sum / ratings.length).toFixed(1)
}

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} - Initials
 */
export const getInitials = (name) => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Generate unique ID
 * @returns {string} - Unique ID
 */
export const generateUniqueId = () => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Sort array of objects
 * @param {array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {boolean} ascending - Sort direction
 * @returns {array} - Sorted array
 */
export const sortArray = (array, key, ascending = true) => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return ascending ? -1 : 1
    if (a[key] > b[key]) return ascending ? 1 : -1
    return 0
  })
}

/**
 * Group array by key
 * @param {array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {object} - Grouped object
 */
export const groupByKey = (array, key) => {
  return array.reduce((acc, item) => {
    const group = item[key]
    if (!acc[group]) acc[group] = []
    acc[group].push(item)
    return acc
  }, {})
}

/**
 * Deep clone object
 * @param {object} obj - Object to clone
 * @returns {object} - Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Merge objects deeply
 * @param {object} target - Target object
 * @param {object} source - Source object
 * @returns {object} - Merged object
 */
export const deepMerge = (target, source) => {
  const output = { ...target }
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) output[key] = source[key]
        else output[key] = deepMerge(target[key], source[key])
      } else {
        output[key] = source[key]
      }
    })
  }
  return output
}

/**
 * Check if value is object
 * @param {*} item - Item to check
 * @returns {boolean} - Is object
 */
const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item)
}
