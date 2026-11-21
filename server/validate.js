export function parseId(rawId) {
    const regex = /^[1-9]\d*$/
    if(typeof rawId !== "string" || !regex.test(rawId)) {
        return null
    }

    return Number(rawId)
}