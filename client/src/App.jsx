import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import { listBooks } from './api/books.js'
import { useReducer } from 'react'
import Filter from './components/Filter.jsx'

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING_START': return { ...state, loading: true, error: null }
    case 'LOADING_FINISH': return { ...state, loading: false, data: action.payload, error: null }
    case 'LOADING_ERROR': return { ...state, loading: false, error: action.payload }
    default: return { ...state }
  }
}

function App() {
  const [filters, setFilters] = useState({ q: "", genre: "", read: "", sort: "", order: "asc" })
  const [bookState, dispatch] = useReducer(reducer, {
    loading: true,
    data: null,
    error: null
  })

  function handleFilterChange(key, value) {
    setFilters({...filters, [key]: value})    
  }

  useEffect(() => {
    const controller = new AbortController()
    dispatch({ type: 'LOADING_START' })

    listBooks(filters, controller.signal).
      then(data => {
        dispatch({ type: 'LOADING_FINISH', payload: data })
      }).catch(error => {
        if (error.name === "AbortError") return
        dispatch({ type: 'LOADING_ERROR', payload: error.message })
      })

    return () => controller.abort()
  }, [filters])


  let content

  if (bookState.loading) content = <p>Loading...</p>
  else if (bookState.error) content = <p>error: {error}</p>
  else if (bookState.data.length === 0) content = <p>No books found</p>
  else content = <ul>
    {bookState.data.map(book => (
      <li key={book.id}>{book.title} by {book.author} ({book.year})</li>
    ))}
  </ul>

  return (
    <div>
      <Filter filters={filters} onChange={handleFilterChange}/>
      {content}
    </div>
  )
}

export default App
