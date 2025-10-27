require('dotenv').config()
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')

// 📦 Configs & middlewares personnalisés
const connectDB = require('./config/dbConn')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const notFound = require('./middleware/notFound')
const corsOptions = require('./config/corsOptions')

// 🧠 Connexion à MongoDB
connectDB()

const app = express()
const PORT = process.env.PORT || 3500

// 🛡️ Corrige le problème de proxy pour Render/Heroku
app.set('trust proxy', 1)

// 🌐 Middlewares globaux
app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// 📁 Fichiers statiques
app.use('/static', express.static(path.join(__dirname, 'public'), {
  dotfiles: 'deny',
  etag: false,
  maxAge: '1d',
  immutable: true
}))

// 🧭 Routes principales
app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/courses', require('./routes/courseRoutes'))

// 🚫 Gestion des routes non trouvées
app.use(notFound)

// 🛠️ Gestion des erreurs
app.use(errorHandler)

// 🚀 Lancement du serveur après connexion MongoDB
mongoose.connection.once('open', () => {
  console.log('✅ Connected to MongoDB')
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
})

// 🔥 Gestion des erreurs MongoDB
mongoose.connection.on('error', err => {
  console.error('❌ MongoDB connection error:', err)
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
