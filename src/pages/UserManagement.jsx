import { useState, useEffect } from 'react'
import { getUsers, setUsers } from '../utils/storage'
import Navbar from '../components/Navbar'

/**
 * User Management Page
 * - Register new users (name, membership ID, role)
 * - Update existing user details
 * - Delete users
 */
function UserManagement() {
  const [users, setUsersState] = useState([])

  // Form state for adding a new user
  const [name, setName] = useState('')
  const [membershipId, setMembershipId] = useState('')
  const [role, setRole] = useState('Member')

  // For editing
  const [editIndex, setEditIndex] = useState(null)
  const [editName, setEditName] = useState('')
  const [editRole, setEditRole] = useState('Member')

  // Load users on mount
  useEffect(() => {
    setUsersState(getUsers())
  }, [])

  const saveUsers = (updated) => {
    setUsers(updated)
    setUsersState(updated)
  }

  // ---------- REGISTER ----------
  const handleRegister = (e) => {
    e.preventDefault()

    if (!name.trim() || !membershipId.trim()) {
      alert('Please provide both Name and Membership ID.')
      return
    }

    // Prevent duplicate membership IDs
    if (users.some((u) => u.membershipId === membershipId.trim())) {
      alert('A user with this Membership ID already exists.')
      return
    }

    const newUser = {
      name: name.trim(),
      membershipId: membershipId.trim(),
      role,
    }

    const updated = [...users, newUser]
    saveUsers(updated)

    // Clear form
    setName('')
    setMembershipId('')
    setRole('Member')
    alert('User added successfully!')
  }

  // ---------- START EDIT ----------
  const startEdit = (index) => {
    setEditIndex(index)
    setEditName(users[index].name)
    setEditRole(users[index].role)
  }

  // ---------- SAVE EDIT ----------
  const saveEdit = () => {
    if (!editName.trim()) {
      alert('Name cannot be empty.')
      return
    }

    const updated = [...users]
    updated[editIndex] = {
      ...updated[editIndex],
      name: editName.trim(),
      role: editRole,
    }
    saveUsers(updated)
    setEditIndex(null)
    alert('User updated successfully!')
  }

  // ---------- DELETE ----------
  const handleDelete = (index) => {
    if (!window.confirm(`Delete user "${users[index].name}"?`)) return
    const updated = users.filter((_, i) => i !== index)
    saveUsers(updated)
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h3>User Management</h3>

        {/* Register Form */}
        <div className="card">
          <h4>Register New User</h4>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Membership ID"
              value={membershipId}
              onChange={(e) => setMembershipId(e.target.value)}
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Member">Member</option>
              <option value="Librarian">Librarian</option>
              <option value="Admin">Admin</option>
            </select>
            <button type="submit">Register User</button>
          </form>
        </div>

        {/* Users Table */}
        <h3 className="mt-20">Registered Users</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Membership ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4">No users registered yet</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={index}>
                  <td>{user.membershipId}</td>
                  <td>
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        style={{ width: '90%' }}
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                      >
                        <option value="Member">Member</option>
                        <option value="Librarian">Librarian</option>
                        <option value="Admin">Admin</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <>
                        <button onClick={saveEdit}>Save</button>
                        <button
                          className="secondary-btn"
                          onClick={() => setEditIndex(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(index)}>Update</button>
                        <button
                          className="danger-btn"
                          onClick={() => handleDelete(index)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default UserManagement