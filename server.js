require('dotenv').config()

const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
const PORT = process.env.PORT || 3500

// 🧠 Onboarding: Connexion à MongoDB
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

// 📁 Fichiers statiques
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

// 🚫 404 handler
app.use(notFound)

// 🛠️ Error handler (Express 5 gère les erreurs async nativement)
app.use(errorHandler)

// 🧠 Onboarding: MongoDB events
mongoose.connection.once('open', () => {
  console.log('✅ Connected to MongoDB')
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
  console.error('❌ MongoDB connection error:', err)
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})


/*require('dotenv').config()
const express = require('express')
const app = express()
const path=require('path')
const routes = require('./routes/root');
const notFound = require('./middleware/notFound');
const {logger} = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const {logEvents} = require('./middleware/logger')
const userRoutes = require('./routes/userRoutes')
const courseRoutes = require('./routes/courseRoutes')
const authRoutes =  require('./routes/authRoutes')
const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV)

connectDB()

// Middleware logger
app.use(logger)

// Middleware CORS
app.use(cors(corsOptions));

// Middleware JSON
app.use(express.json())

// Middleware pour parser les cookies
app.use(cookieParser()); 

// Fichiers statiques
app.use('/', express.static(path.join(__dirname, 'public'), {
  dotfiles: 'deny',
  etag: false,
  maxAge: '1d',
  immutable: true
}));

// Routes principales
app.use('/api', routes);
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/courses', courseRoutes)
// Fallback 404
app.use(notFound);

// Middleware errorHandler
app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('connected to MongoDB')
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
  console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})*/


