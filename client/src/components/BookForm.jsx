import { useState } from "react"

const GENRES = ["fiction", "non-fiction", "science", "history", "fantasy", "other"]

export default function BookForm({ initialBook, onSubmit, onCancel, submitting, error }) {
    const [fields, setFields] = useState({
        title: initialBook?.title ?? "",
        author: initialBook?.author ?? "",
        year: initialBook?.year ?? "",
        genre: initialBook?.genre ?? "fiction",
        read: initialBook?.read ?? false,
        rating: initialBook?.rating ?? ""
    })

    function handleChange(e) {
        const { name, type, value, checked } = e.target
        const next = type === "checkbox" ? checked : value
        setFields(prev => {
            const updated = { ...prev, [name]: next }
            if (name === "read" && !checked) updated.rating = ""
            return updated
        })
    }

    function handleSubmit(e) {
        e.preventDefault()
        onSubmit({
            title: fields.title,
            author: fields.author,
            year: Number(fields.year),
            genre: fields.genre,
            read: fields.read,
            rating: fields.rating === "" ? null : Number(fields.rating)
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>{initialBook ? "Edit book" : "Add book"}</h2>
            <input name="title" placeholder="Title" value={fields.title} onChange={handleChange} />
            <input name="author" placeholder="Author" value={fields.author} onChange={handleChange} />
            <input name="year" placeholder="Year" value={fields.year} onChange={handleChange} />
            <select name="genre" value={fields.genre} onChange={handleChange}>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <label>
                <input type="checkbox" name="read" checked={fields.read} onChange={handleChange} />
                read
            </label>
            <select name="rating" value={fields.rating} disabled={!fields.read} onChange={handleChange}>
                <option value="">No rating</option>
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save"}
            </button>
            {initialBook && <button type="button" onClick={onCancel}>Cancel</button>}
            {error && <p>Error: {error}</p>}
        </form>
    )
}