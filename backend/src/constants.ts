import dotenv from 'dotenv'

dotenv.config()

export const SD_URL = process.env.SD_URL || 'http://127.0.0.1:7860'
export const INTERROGATE_URL = process.env.INTERROGATE_URL || 'http://127.0.0.1:7860'
export const PORT = process.env.PORT || 5432
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'