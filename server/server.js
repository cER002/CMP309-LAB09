import express from 'express'
import cors from 'cors'

const PORT = process.env.PORT ?? 3000
const allowed = procces.env.CLIENT_ORIGIN ?? 'https://localhost:5173'

const app = express()

app.use(cors({ origin: allowed }))
app.use(express.json())



app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})