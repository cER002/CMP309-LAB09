export default function Filter({filters, onChange}) {

    const genres = ["fiction", "non-fiction", "science", "history", "fantasy", "other"]
    const handle = (e) => onChange(e.target.name, e.target.value)

    return (
        <div>
            <input
                name="q"
                placeholder="Search title or author name"
                value={filters.q}
                onChange={handle}
            />

            <select name="genre" value={filters.genre} onChange={handle}>
                <option value="">All</option>
                {genres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
            </select>

            <select name="read" value={filters.read} onChange={handle}>
                <option value="">All</option>
                <option value="true">read</option>
                <option value="false">unread</option>
            </select>

            <select name="sort" value={filters.sort} onChange={handle}>
                <option value="">Default</option>
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="year">Year</option>
                <option value="rating">Rating</option>
            </select>

            <select name="order" value={filters.order} onChange={handle}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
        </div>
    )
}