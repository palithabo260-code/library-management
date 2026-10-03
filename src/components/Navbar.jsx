import { NavLink } from 'react-router-dom'
import { getCurrentUser, clearCurrentUser } from '../utils/storage'
import { useNavigate } from 'react-router-dom'

/**
 * Navbar – reusable navigation component
 * Uses NavLink from React Router so the active page is highlighted.
 */
function Navbar() {
  const currentUser = getCurrentUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearCurrentUser()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
        Login
      </NavLink>
      <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>
        Dashboard
      </NavLink>
      <NavLink to="/books" className={({ isActive }) => (isActive ? 'active' : '')}>
        Books
      </NavLink>
      <NavLink to="/transactions" className={({ isActive }) => (isActive ? 'active' : '')}>
        Transactions
      </NavLink>
      <NavLink to="/users" className={({ isActive }) => (isActive ? 'active' : '')}>
        Users
      </NavLink>

      {currentUser && (
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          Logout ({currentUser})
        </button>
      )}
    </nav>
  )
}

export default Navbar