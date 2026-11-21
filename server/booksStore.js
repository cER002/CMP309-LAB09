const books = [
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

export async function getAllBooks() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([...books])
        }, 1000)
    })
}

export async function getBookById(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books.filter((book) => book.id == id)
            resolve(book ? {...book} : null)
        }, 500);
    })
}