import dotenv from "dotenv"
dotenv.config()
import express from 'express'
import cors from "cors"
import fs from "fs"
import path from "path"
import { sequelize } from './database'
import { adminJs, adminJsRouter } from './adminjs'
import { router } from './routes'

const app = express()

// Render uses a reverse proxy; trust it so secure cookies work
app.set('trust proxy', 1)

const uploadsDir = path.resolve(process.cwd(), "uploads")
const licenseUploadsDir = path.resolve(uploadsDir, "licenses", "user-")
const tempUploadsDir = path.resolve(uploadsDir, "tmp")

fs.mkdirSync(uploadsDir, { recursive: true })
fs.mkdirSync(licenseUploadsDir, { recursive: true })
fs.mkdirSync(tempUploadsDir, { recursive: true })
process.env.TMPDIR = tempUploadsDir
process.env.TMP = tempUploadsDir
process.env.TEMP = tempUploadsDir

app.use(cors())

app.use(express.static('public'))
app.use('/uploads', express.static('uploads'))

app.use(express.json())

app.use(adminJs.options.rootPath, adminJsRouter)

app.use(router)

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const error = err as {
    message?: string
    name?: string
    stack?: string
    parent?: unknown
    original?: unknown
  }

  console.error("Unhandled error:", {
    name: error?.name,
    message: error?.message,
    parent: error?.parent,
    original: error?.original,
    stack: error?.stack,
  })

  // Tratamento específico para erros de conexão com banco de dados
  if (error?.name === 'SequelizeConnectionError') {
    return res.status(503).json({ 
      error: "Não foi possível conectar ao banco de dados. Por favor, tente novamente em alguns instantes." 
    })
  }

  // Tratamento para erros de sessão
  if (error?.message?.toLowerCase().includes('session')) {
    return res.status(401).json({ 
      error: "Sua sessão expirou. Por favor, faça login novamente." 
    })
  }

  res.status(500).json({ error: "Erro interno do servidor. Por favor, tente novamente." })
})

const PORT = Number(process.env.APP_PORT) || 3000

app.listen(PORT, () => {
  sequelize.authenticate().then(() => {
    console.log('Database connected successfully.')
  })

  console.log(`Server started successfuly at port ${PORT}`)
})