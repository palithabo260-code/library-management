/**
 * storage.js
 * Utility helpers for interacting with LocalStorage.
 * Keeps all data-persistence logic in one place (good practice).
 */

// Keys used in localStorage
const KEYS = {
  BOOKS: 'books',
  USERS: 'users',
  TRANSACTIONS: 'transactions',
  CURRENT_USER: 'currentUser',
}

/**
 * Read an array from localStorage.
 * Returns empty array if key does not exist or is invalid.
 */
export function getStoredData(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.error('Failed to parse localStorage data for', key, err)
    return []
  }
}

/**
 * Save any data (usually an array) to localStorage.
 */
export function setStoredData(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

/**
 * Convenience getters / setters for the main data collections
 */
export const getBooks = () => getStoredData(KEYS.BOOKS)
export const setBooks = (books) => setStoredData(KEYS.BOOKS, books)

export const getUsers = () => getStoredData(KEYS.USERS)
export const setUsers = (users) => setStoredData(KEYS.USERS, users)

export const getTransactions = () => getStoredData(KEYS.TRANSACTIONS)
export const setTransactions = (txns) => setStoredData(KEYS.TRANSACTIONS, txns)

/**
 * Current logged-in user (just a string name)
 */
export const getCurrentUser = () => localStorage.getItem(KEYS.CURRENT_USER) || null
export const setCurrentUser = (name) => localStorage.setItem(KEYS.CURRENT_USER, name)
export const clearCurrentUser = () => localStorage.removeItem(KEYS.CURRENT_USER)

/**
 * Initialise empty collections the first time the app runs
 */
export function initialiseStorage() {
  if (!localStorage.getItem(KEYS.BOOKS)) setBooks([])
  if (!localStorage.getItem(KEYS.USERS)) setUsers([])
  if (!localStorage.getItem(KEYS.TRANSACTIONS)) setTransactions([])
}