export default function Stats({ stats }) {
    if (!stats) return <p>Loading stats...</p>

    return (
        <div>
            <p>Total: {stats.total} | Read: {stats.read} | Unread: {stats.unread}</p>
            <p>Average rating: {stats.averageRating ?? "no ratings yet"}</p>
            <p>
                {Object.entries(stats.byGenre).map(([genre, count]) => `${genre}: ${count}`).join(", ")}
            </p>
        </div>
    )
}