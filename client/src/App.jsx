import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import { listBooks } from './api/books.js'

function App() {
  const [filters, setFilters] = useState({ q: "", genre: "", read: "", sort: "", order: "asc" })
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    listBooks(filters, controller.signal).
      then(data => {
        setBooks(data)
        setLoading(false)
      }).catch(error => {
        if (error.name === "AbortError") return
        setError(error.message)
        setLoading(false)
      })

    return () => controller.abort()
  }, [filters])

  if (loading) return <p>Loading...</p>
  if (error) return <p>error: {error}</p>
  if (books.length === 0) return <p>No books found</p>

  return (
    <ul>
      {books.map(book => (
        <li key={book.id}>{book.title} by {book.author} ({book.year})</li>
      ))}
    </ul>
  )
}

export default App
