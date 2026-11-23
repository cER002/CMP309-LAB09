export default function BookItem({ book, onToggleRead, onRate, onEdit, onDelete }) {
    return (
        <li>
            {book.title} by {book.author} ({book.year}, {book.genre})

            <label>
                <input
                    type="checkbox"
                    checked={book.read}
                    onChange={() => onToggleRead(book)}
                />
                read
            </label>

            <select
                value={book.rating ?? ""}
                disabled={!book.read}
                onChange={(e) => onRate(book, e.target.value)}
            >
                <option value="">No rating</option>
                {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}

            </select>

            <button onClick={() => onEdit(book)}>Edit</button>
            <button onClick={() => onDelete(book)}>Delete</button>
        </li>
    )
}