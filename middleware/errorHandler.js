const { logEvents } = require('./logger')

/**
 * 🧠 Middleware global de gestion des erreurs
 * Express 5 capture automatiquement les erreurs async, donc ce handler est suffisant
 */
const errorHandler = (err, req, res, next) => {
  // 📦 Log l’erreur dans un fichier dédié
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    'errLog.log'
  )

  // 🐞 Affiche la stack trace dans la console pour le debug local
  console.error(err.stack)

  // 📡 Définit le code HTTP (évite d’envoyer un 200 en cas d’erreur)
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode)

  // 📤 Réponse JSON standardisée
  res.json({
    message: err.message,
    isError: true,
    type: err.name,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

module.exports = errorHandler




/*const { logEvents } = require('./logger')

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
    console.log(err.stack)

    const status = res.statusCode ? res.statusCode : 500 // server error 

    res.status(status)

    res.json({ message: err.message, isError:true })
}

module.exports = errorHandler */