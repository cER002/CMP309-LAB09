import express from 'express'
import cors from 'cors'
import { getAllBooks, getBookById, findDuplicate, createBook, updateBook, deleteBook } from './booksStore.js'
import { parseId, parseQuery, validateBook } from './validate.js'

const PORT = process.env.PORT ?? 3000
const allowed = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173'

const app = express()

app.use(cors({ origin: allowed }))
app.use(express.json())

app.get('/api/books', async (req, res) => {
    const { error, options } = parseQuery(req.query)
    if (error) {
        return res.status(400).json({ error })
    }
    const { genre, read, q, sort, order, limit, page } = options

    const all = await getAllBooks()

    const filtered = all.filter(b =>
        (genre === undefined || b.genre === genre) &&
        (read === undefined || b.read === read) &&
        (q === undefined ||
            b.title.toLowerCase().includes(q) ||
            b.author.toLowerCase().includes(q))
    )

    const dir = order === "asc" ? 1 : -1
    const sorted = [...filtered].sort((a, b) => {
        if (sort === "rating") {
            if (a.rating === null && b.rating === null) return 0
            if (a.rating === null) return 1
            if (b.rating === null) return -1
        }
        const x = a[sort], y = b[sort]
        const cmp = typeof x === "string" ? x.localeCompare(y) : x - y
        return cmp * dir
    })

    const start = (page - 1) * limit
    res.json(sorted.slice(start, start + limit))
})

app.get('/api/books/:id', async (req, res) => {
    const id = parseId(req.params.id)

    if (!id) {
        res.status(400).json({ "error": "Invalid index" })
        return
    }

    const book = await getBookById(id)

    if (!book) {
        res.status(404).json({ "error": "Book id does not exist" })
        return
    }

    res.json(book)
})

app.post('/api/books', async (req, res) => {
    const { error, book } = validateBook(req.body)
    if (error) return res.status(400).json({ error })

    if (await findDuplicate(book.title, book.author))
        return res.status(409).json({ error: "a book with this title and author already exists" })

    const created = await createBook(book)
    res.status(201).location(`/api/books/${created.id}`).json(created)
})

app.put('/api/books/:id', async (req, res) => {
    const id = parseId(req.params.id)
    if (!id) return res.status(400).json({ error: "id must be a positive integer" })

    const existing = await getBookById(id)
    if (!existing) return res.status(404).json({ error: "Book id does not exist" })

    const { error, book } = validateBook(req.body)
    if (error) return res.status(400).json({ error })

    if (await findDuplicate(book.title, book.author, id))
        return res.status(409).json({ error: "a book with this title and author already exists" })

    res.json(await updateBook(id, book))
})

app.patch('/api/books/:id', async (req, res) => {
    const id = parseId(req.params.id)
    if (!id) return res.status(400).json({ error: "id must be a positive integer" })

    const existing = await getBookById(id)
    if (!existing) return res.status(404).json({ error: "Book id does not exist" })

    const { error, book } = validateBook({ ...existing, ...req.body })
    if (error) return res.status(400).json({ error })

    if (await findDuplicate(book.title, book.author, id))
        return res.status(409).json({ error: "a book with this title and author already exists" })

    res.json(await updateBook(id, book))
})

app.delete('/api/books/:id', async (req, res) => {
    const id = parseId(req.params.id)
    if (!id) return res.status(400).json({ error: "id must be a positive integer" })

    if (!(await deleteBook(id)))
        return res.status(404).json({ error: "Book id does not exist" })

    res.status(204).end()
})

app.get('/api/stats', async (req, res) => {
    const all = await getAllBooks()

    const read = all.filter(b => b.read).length
    const ratings = all.filter(b => b.rating !== null).map(b => b.rating)
    const averageRating = ratings.length
        ? Math.round((ratings.reduce((sum, r) => sum + r, 0) / ratings.length) * 10) / 10
        : null

    const byGenre = {}
    for (const b of all) {
        byGenre[b.genre] = (byGenre[b.genre] ?? 0) + 1
    }

    res.json({
        total: all.length,
        read,
        unread: all.length - read,
        averageRating,
        byGenre,
    })
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})