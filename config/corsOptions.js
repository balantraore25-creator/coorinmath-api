const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
  origin: (origin, callback) => {
    // Autoriser si l'origine est dans la liste ou si la requête n'a pas d'origine (ex: Postman, cURL)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`))
    }
  },
  credentials: true,            // Autorise l'envoi de cookies/headers d'auth
  optionsSuccessStatus: 200     // Pour compatibilité avec certains navigateurs (IE, SmartTVs)
}

module.exports = corsOptions
