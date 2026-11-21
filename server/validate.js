export function parseId(rawId) {
    const regex = /^[1-9]\d*$/
    if (typeof rawId !== "string" || !regex.test(rawId)) {
        return null
    }

    return Number(rawId)
}

const GENRES = new Set(["fiction", "non-fiction", "science", "history", "fantasy", "other"])
const SORTS = new Set(["title", "author", "year", "rating"])
const ORDERS = new Set(["asc", "desc"])

export function parseQuery(query) {
    for (const [key, value] of Object.entries(query)) {
        if (Array.isArray(value)) return { error: `${key} must not be repeated` }
    }

    const { genre, read, q, sort, order, limit, page } = query

    if (genre !== undefined && !GENRES.has(genre))
        return { error: `genre must be one of: ${[...GENRES].join(", ")}` }

    if (read !== undefined && read !== "true" && read !== "false")
        return { error: "read must be true or false" }

    if (sort !== undefined && !SORTS.has(sort))
        return { error: `sort must be one of: ${[...SORTS].join(", ")}` }

    if (order !== undefined && !ORDERS.has(order))
        return { error: "order must be asc or desc" }

    const limitNum = Number(limit ?? 50)
    if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 50)
        return { error: "limit must be an integer from 1 to 50" }

    const pageNum = Number(page ?? 1)
    if (!Number.isInteger(pageNum) || pageNum < 1)
        return { error: "page must be an integer of 1 or more" }

    return {
        options: {
            genre,
            read: read === undefined ? undefined : read === "true",
            q: q?.toLowerCase(),
            sort: sort ?? "id",
            order: order ?? "asc",
            limit: limitNum,
            page: pageNum,
        },
    }
}