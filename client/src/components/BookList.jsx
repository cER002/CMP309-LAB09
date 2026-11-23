import BookItem from "./BookItem"

export default function BookList({ books, ...handlers }) {
    return (
        <ul>
            {books.map(book => <BookItem key={book.id} book={book} {...handlers} />)}
        </ul>
    )
}