import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import { listBooks, getStats, patchBook, deleteBook } from './api/books.js'
import { useReducer } from 'react'
import Filter from './components/Filter.jsx'
import Stats from './components/Stats.jsx'
import BookList from './components/BookList.jsx'

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
  const [stats, setStats] = useState(null)
  const [reloadKey, setRealoadKey] = useState(0)
  const [actionError, setActionError] = useState(null)

  async function runAction(action) {
    setActionError(null)
    try {
      await action()
      setRealoadKey(k => k + 1)
    } catch (e) {
      setActionError(e.message)
    }
  }

  function handleToggleRead(book) {
    const changes = book.read ? { read: false, rating: null } : { read: true }
    runAction(() => patchBook(book.id, changes))
  }

  function handleRate(book, value) {
    runAction(() => patchBook(book.id, { rating: value === "" ? null : Number(value) }))
  }

  function handleDelete(book) {
    runAction(() => deleteBook(book.id))
  }

  function handleEdit(book) {
    console.log("edit", book)
  }

  useEffect(() => {
    const controller = new AbortController()

    getStats(controller.signal)
      .then(setStats)
      .catch(err => {
        if (err.name !== "AbortError") console.log(err.message)
      })

    return () => controller.abort()
  }, [reloadKey])

  function handleFilterChange(key, value) {
    setFilters({ ...filters, [key]: value })
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
  }, [filters, reloadKey])


  let content

  if (bookState.loading) content = <p>Loading...</p>
  else if (bookState.error) content = <p>error: {error}</p>
  else if (bookState.data.length === 0) content = <p>No books found</p>
  else content = <BookList
    books={bookState.data}
    onToggleRead={handleToggleRead}
    onRate={handleRate}
    onEdit={handleEdit}
    onDelete={handleDelete}
  />

  return (
    <div>
      <Stats stats={stats} />
      <Filter filters={filters} onChange={handleFilterChange} />
      {actionError && <p>Error: {actionError}</p>}
      {content}
    </div>
  )
}

export default App
