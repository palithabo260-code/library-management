import { useState, useEffect } from 'react'
import { getBooks, setBooks } from '../utils/storage'
import Navbar from '../components/Navbar'

/**
 * Book Management Page
 * - Controlled form for adding books
 * - Table with Update Stock & Delete actions
 */
function BookManagement() {
  const [books, setBooksState] = useState([])

  // Form state (controlled components)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState('')
  const [isbn, setIsbn] = useState('')
  const [quantity, setQuantity] = useState('')

  // Load books on mount
  useEffect(() => {
    setBooksState(getBooks())
  }, [])

  // Persist helper
  const saveBooks = (updated) => {
    setBooks(updated)          // write to localStorage
    setBooksState(updated)     // update React state
  }

  // ---------- ADD BOOK ----------
  const handleAddBook = (e) => {
    e.preventDefault()

    if (!title.trim() || !author.trim() || isNaN(parseInt(quantity))) {
      alert('Please enter a valid Title, Author and Quantity.')
      return
    }

    const newBook = {
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      isbn: isbn.trim(),
      quantity: parseInt(quantity),
    }

    const updated = [...books, newBook]
    saveBooks(updated)

    // Clear form
    setTitle('')
    setAuthor('')
    setGenre('')
    setIsbn('')
    setQuantity('')
    alert('Book added successfully!')
  }

  // ---------- UPDATE QUANTITY ----------
  const handleUpdateQuantity = (index) => {
    const book = books[index]
    const newQtyStr = prompt(`Enter new quantity for: ${book.title}`, book.quantity)

    if (newQtyStr === null) return // cancelled

    const newQty = parseInt(newQtyStr)
    if (isNaN(newQty) || newQty < 0) {
      alert('Please enter a valid non-negative number.')
      return
    }

    const updated = [...books]
    updated[index] = { ...updated[index], quantity: newQty }
    saveBooks(updated)
  }

  // ---------- DELETE BOOK ----------
  const handleDeleteBook = (index) => {
    if (!window.confirm(`Delete "${books[index].title}"?`)) return

    const updated = books.filter((_, i) => i !== index)
    saveBooks(updated)
  }

  // ---------- CLEAR FORM ----------
  const handleClear = () => {
    setTitle('')
    setAuthor('')
    setGenre('')
    setIsbn('')
    setQuantity('')
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h3>Book Stock Management</h3>

        {/* Add Book Form */}
        <div className="card">
          <h4>Add New Book</h4>
          <form onSubmit={handleAddBook}>
            <input
              type="text"
              placeholder="Book Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <input
              type="text"
              placeholder="Genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
            <input
              type="text"
              placeholder="ISBN"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="0"
            />
            <button type="submit">Add Book</button>
            <button type="button" className="secondary-btn" onClick={handleClear}>
              Clear
            </button>
          </form>
        </div>

        {/* Books Table */}
        <h4 className="mt-20">All Books</h4>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>ISBN</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan="6">No books yet. Add one above!</td>
              </tr>
            ) : (
              books.map((book, index) => (
                <tr key={index}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                  <td>{book.isbn}</td>
                  <td>{book.quantity}</td>
                  <td>
                    <button onClick={() => handleUpdateQuantity(index)}>
                      Update Stock
                    </button>
                    <button
                      className="danger-btn"
                      onClick={() => handleDeleteBook(index)}
                    >
                      Delete
                    </button>
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

export default BookManagement