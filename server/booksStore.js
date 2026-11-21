let books = [
    {
        id: 1,
        title: "The Hunger Games",
        author: "Suzanne Collins",
        year: 2008,
        genre: "fiction",
        read: false,
        rating: null
    },
    {
        id: 2,
        title: "Dune",
        author: "Frank Herbert",
        year: 1965,
        genre: "fiction",
        read: true,
        rating: 5
    },
    {
        id: 3,
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        year: 2011,
        genre: "history",
        read: true,
        rating: 4
    },
    {
        id: 4,
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        year: 1988,
        genre: "science",
        read: false,
        rating: null
    },
    {
        id: 5,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        year: 1937,
        genre: "fantasy",
        read: true,
        rating: 5
    },
    {
        id: 6,
        title: "Atomic Habits",
        author: "James Clear",
        year: 2018,
        genre: "non-fiction",
        read: false,
        rating: null
    }
]

let nextId = 7

export async function getAllBooks() {
    await new Promise(r => setTimeout(r, 10))
    return [...books]
}

export async function getBookById(id) {
    await new Promise(r => setTimeout(r, 10))
    const book = books.find(b => b.id === id)
    return book ? { ...book } : null
}

export async function findDuplicate(title, author, ignoreId) {
    await new Promise(r => setTimeout(r, 10))
    return books.find(b =>
        b.id !== ignoreId &&
        b.title.toLowerCase() === title.toLowerCase() &&
        b.author.toLowerCase() === author.toLowerCase())
}

export async function createBook(data) {
    await new Promise(r => setTimeout(r, 10))
    const book = { id: nextId++, ...data }
    books = [...books, book]
    return book
}