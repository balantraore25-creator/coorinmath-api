require('dotenv').config()

const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
const PORT = process.env.PORT || 3500

// 🧠 Connexion à MongoDB
const connectDB = require('./config/dbConn')
connectDB()

// 🧠 Middleware personnalisé
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const notFound = require('./middleware/notFound')

// 🧠 Routes
const rootRoutes = require('./routes/root')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const courseRoutes = require('./routes/courseRoutes')

// 🧠 CORS config
const corsOptions = require('./config/corsOptions')

// 🌐 Middlewares globaux
app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// 📁 Fichiers statiques (public)
app.use('/', express.static(path.join(__dirname, 'public'), {
  dotfiles: 'deny',
  etag: false,
  maxAge: '1d',
  immutable: true
}))

// 🧭 Routes principales
app.use('/api', rootRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/courses', courseRoutes)

// ✅ Route de santé (health check)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'CoorinMath API', uptime: process.uptime() })
})

// 🚫 404 handler (doit être après toutes les routes)
app.use(notFound)

// 🛠️ Error handler (doit être le dernier middleware)
app.use(errorHandler)

// 🧠 MongoDB events
mongoose.connection.once('open', () => {
  console.log('✅ Connected to MongoDB')
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
  console.error('❌ MongoDB connection error:', err)
  logEvents(
    `${err.no || ''}: ${err.code || ''}\t${err.syscall || ''}\t${err.hostname || ''}`,
    'mongoErrLog.log'
  )
})
