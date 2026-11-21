import express from 'express'
import cors from 'cors'
import { getAllBooks, getBookById } from './booksStore.js'
import { parseId } from './validate.js'

const PORT = process.env.PORT ?? 3000
const allowed = process.env.CLIENT_ORIGIN ?? 'https://localhost:5173'

const app = express()

app.use(cors({ origin: allowed }))
app.use(express.json())

app.get('/api/books', async (req, res) => {
    const books = await getAllBooks()
    res.json(books)
})

app.get('/api/books/:id', async (req, res) => {
    const id = parseId(req.params.id)

    if (!id) {
        res.status(400).json({ "error": "Invalid index" })
        return
    }

    const book = await getBookById(id)

    if(!book) {
        res.status(404).json({ "error": "Book id does not exist" })
    }

    res.json(book)
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})