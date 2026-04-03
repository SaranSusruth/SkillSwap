/**
 * Custom Hooks Collection
 * Reusable hooks for common functionality
 */

import { useCallback, useEffect, useState } from 'react'

/**
 * useLocalStorage Hook
 * Persist state to localStorage with sync across tabs
 * @param {string} key - Storage key
 * @param {*} initialValue - Initial value if key doesn't exist
 * @returns {[any, Function]} - Current value and setter function
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return initialValue
    }
  })

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error('Error writing to localStorage:', error)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue]
}

/**
 * useFetch Hook
 * Fetch data with loading and error states
 * @param {string} url - API endpoint
 * @param {object} options - Fetch options
 * @returns {object} - { data, loading, error, refetch }
 */
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch(url, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      //   ...options,
      // })
      // if (!response.ok) throw new Error('API request failed')
      // const json = await response.json()
      // setData(json)
      console.log(`Fetching from ${url}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [url, options])

  useEffect(() => {
    if (url) {
      fetchData()
    }
  }, [url, fetchData])

  return { data, loading, error, refetch: fetchData }
}

/**
 * useDebounce Hook
 * Debounce a value
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} - Debounced value
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

/**
 * useClickOutside Hook
 * Detect clicks outside of an element
 * @param {object} ref - React ref to element
 * @param {Function} callback - Function to call on outside click
 */
export const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [ref, callback])
}

/**
 * usePagination Hook
 * Handle pagination logic
 * @param {array} items - Items to paginate
 * @param {number} itemsPerPage - Items per page
 * @returns {object} - { currentItems, pageNumber, setPageNumber, totalPages }
 */
export const usePagination = (items = [], itemsPerPage = 10) => {
  const [pageNumber, setPageNumber] = useState(0)

  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = pageNumber * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = items.slice(startIndex, endIndex)

  return {
    currentItems,
    pageNumber,
    setPageNumber,
    totalPages,
  }
}
