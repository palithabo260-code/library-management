import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { initialiseStorage } from './utils/storage'

// Pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import BookManagement from './pages/BookManagement'
import Transactions from './pages/Transactions'
import UserManagement from './pages/UserManagement'

/**
 * App.jsx – main application component
 * Sets up React Router routes and initialises localStorage.
 */
function App() {
  // Run once when the app first loads
  useEffect(() => {
    initialiseStorage()
  }, [])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/books" element={<BookManagement />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/users" element={<UserManagement />} />
      {/* Catch-all – redirect unknown paths to Dashboard */}
      <Route path="*" element={<Dashboard />} />
    </Routes>
  )
}

export default App