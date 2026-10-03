import { useState, useEffect } from 'react'
import { getBooks, getUsers, getTransactions, getCurrentUser } from '../utils/storage'
import Navbar from '../components/Navbar'

/**
 * Dashboard Page
 * Shows summary stats, low-stock books and recent transactions.
 * Uses useEffect to load data when the component mounts.
 */
function Dashboard() {
  const [books, setBooks] = useState([])
  const [users, setUsers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [currentUser, setCurrentUser] = useState('Librarian')

  // Load data from localStorage on mount (lifecycle via useEffect)
  useEffect(() => {
    setBooks(getBooks())
    setUsers(getUsers())
    setTransactions(getTransactions())
    setCurrentUser(getCurrentUser() || 'Librarian')
  }, [])

  // Derived values
  const totalBooks = books.reduce((sum, b) => sum + (b.quantity || 0), 0)
  const lowStockBooks = books.filter((b) => b.quantity < 2)
  // Newest transactions first
  const recentTxns = [...transactions].reverse().slice(0, 10)

  return (
    <>
      <Navbar />
      <div className="container">
        <p>
          Welcome, <b>{currentUser}</b>
        </p>

        {/* Summary boxes */}
        <div className="box">
          <b>Total Books:</b> <span>{totalBooks}</span>
        </div>
        <div className="box">
          <b>Total Members:</b> <span>{users.length}</span>
        </div>
        <div className="box low-stock-card">
          <b>Low Stock Alert (&lt; 2):</b> <span>{lowStockBooks.length}</span> books
        </div>

        {/* Low stock table */}
        <h3>Books Below Threshold (Quantity &lt; 2)</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Quantity Left</th>
            </tr>
          </thead>
          <tbody>
            {lowStockBooks.length === 0 ? (
              <tr>
                <td colSpan="2">No low-stock books 🎉</td>
              </tr>
            ) : (
              lowStockBooks.map((b, idx) => (
                <tr key={idx}>
                  <td>{b.title}</td>
                  <td style={{ color: 'red', fontWeight: 'bold' }}>{b.quantity}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Recent transactions */}
        <h3 className="mt-20">Recent Transactions</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Book</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {recentTxns.length === 0 ? (
              <tr>
                <td colSpan="4">No transactions yet</td>
              </tr>
            ) : (
              recentTxns.map((t, idx) => (
                <tr key={idx}>
                  <td>{t.date}</td>
                  <td>{t.type}</td>
                  <td>{t.book}</td>
                  <td>{t.user || 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Dashboard