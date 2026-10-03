import { useState, useEffect } from 'react'
import {
  getBooks,
  setBooks,
  getTransactions,
  setTransactions,
  getCurrentUser,
} from '../utils/storage'
import Navbar from '../components/Navbar'

/**
 * Transactions Page
 * - Select a book, choose Borrow / Add Stock, enter quantity
 * - Records every transaction and updates stock
 */
function Transactions() {
  const [books, setBooksState] = useState([])
  const [transactions, setTxnsState] = useState([])

  // Form state
  const [selectedBookIndex, setSelectedBookIndex] = useState('')
  const [type, setType] = useState('Borrow')
  const [qty, setQty] = useState('')

  // Load data on mount
  useEffect(() => {
    setBooksState(getBooks())
    setTxnsState(getTransactions())
  }, [])

  const handleProcess = (e) => {
    e.preventDefault()

    if (selectedBookIndex === '' || isNaN(parseInt(qty)) || parseInt(qty) <= 0) {
      alert('Please select a book and enter a valid quantity.')
      return
    }

    const index = parseInt(selectedBookIndex)
    const amount = parseInt(qty)
    const updatedBooks = [...books]
    const selectedBook = { ...updatedBooks[index] }

    // Validation for borrowing
    if (type === 'Borrow' && selectedBook.quantity < amount) {
      alert('Not enough stock available to fulfill request!')
      return
    }

    // Adjust stock
    if (type === 'Borrow') {
      selectedBook.quantity -= amount
    } else {
      selectedBook.quantity += amount
    }

    updatedBooks[index] = selectedBook
    setBooks(updatedBooks)
    setBooksState(updatedBooks)

    // Record transaction
    const currentUser = getCurrentUser() || 'Guest'
    const newTxn = {
      date: new Date().toLocaleDateString(),
      type,
      book: selectedBook.title,
      user: currentUser,
    }

    const updatedTxns = [...transactions, newTxn]
    setTransactions(updatedTxns)
    setTxnsState(updatedTxns)

    // Reset form
    setSelectedBookIndex('')
    setQty('')
    alert('Transaction recorded successfully!')
  }

  // Newest first for the log
  const displayTxns = [...transactions].reverse()

  return (
    <>
      <Navbar />
      <div className="container">
        <h3>Process Transaction</h3>

        <div className="card">
          <h4>Borrow or Add Stock</h4>
          <form onSubmit={handleProcess}>
            <select
              value={selectedBookIndex}
              onChange={(e) => setSelectedBookIndex(e.target.value)}
            >
              <option value="">-- Select Book --</option>
              {books.map((book, idx) => (
                <option key={idx} value={idx}>
                  {book.title} (In Stock: {book.quantity})
                </option>
              ))}
            </select>

            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="Borrow">Borrow (Deduct Stock)</option>
              <option value="Add Stock">Return/Add (Increase Stock)</option>
            </select>

            <input
              type="number"
              placeholder="Quantity"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />

            <button type="submit">Process Transaction</button>
          </form>
        </div>

        {/* Transaction History */}
        <h3 className="mt-20">Transaction History Log</h3>
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
            {displayTxns.length === 0 ? (
              <tr>
                <td colSpan="4">No transactions yet</td>
              </tr>
            ) : (
              displayTxns.map((t, idx) => (
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

export default Transactions