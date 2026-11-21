const base = import.meta.env.VITE_API_URL

async function request(path, { method = "GET", body, signal } = {}) {
    const options = { method, signal }
    if (body !== undefined) {
        options.headers = { "Content-Type": "application/json" }
        options.body = JSON.stringify(body)
    }

    const response = await fetch(`${base}${path}`, options)

    if (!response.ok) {
        let message = `Request failed ${response.status}`
        try {
            const data = await response.json()
            if (data.error) message = data.error
        } catch { }

        throw new Error(message)
    }

    if (response.status === 204) return null

    return response.json()
}

export function listBooks(filters, signal) {
    const params = new URLSearchParams()

    for (const [key, value] of Object.entries(filters)) {
        if (value !== "" && value !== undefined) params.set(key, value)
    }

    const query = params.toString()
    return request(`/books${query ? `?${query}` : ""}`, { signal })
}

export const getStats = (signal) => request("/stats", { signal })
export const createBook = (book) => request("/books", { method: "POST", body: book })
export const replaceBook = (id, book) => request(`/books${id}`, { method: "PUT", body: book })
export const patchBook = (id, changes) => request(`/books${id}`, { method: "PATCH", body: changes })
export const deleteBook = (id) => request(`/books/${id}`, { method: "DELETE" })