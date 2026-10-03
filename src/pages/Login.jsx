import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsers, setCurrentUser } from '../utils/storage'
import Navbar from '../components/Navbar'

/**
 * Login Page
 * Controlled form – membership ID is required.
 * Special case: "admin" works without a registered account.
 */
function Login() {
  const [membershipId, setMembershipId] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const trimmedId = membershipId.trim()
    if (!trimmedId) {
      setError('Please enter a Membership ID.')
      return
    }

    const users = getUsers()
    const user = users.find((u) => u.membershipId === trimmedId)

    // Allow the special "admin" login or any registered membership ID
    if (user || trimmedId.toLowerCase() === 'admin') {
      const userName = user ? user.name : 'Admin'
      setCurrentUser(userName)
      alert(`Welcome, ${userName}!`)
      navigate('/') // go to Dashboard
    } else {
      setError('Invalid Membership ID. Please register first.')
    }
  }

  return (
    <>
      <Navbar />
      <div className="card container login-card">
        <h3>Community Library – Login</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="loginMemberId"
            placeholder="Membership ID"
            value={membershipId}
            onChange={(e) => setMembershipId(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        <button
          type="button"
          className="secondary-btn"
          onClick={() => navigate('/users')}
          style={{ marginTop: '10px' }}
        >
          New User? Register Here
        </button>

        {error && <p className="error-msg">{error}</p>}
      </div>
    </>
  )
}

export default Login