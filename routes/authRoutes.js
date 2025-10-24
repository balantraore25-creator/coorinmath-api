const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const loginLimiter = require('../middleware/loginLimiter');

// 🔐 Authentification : POST /auth
router.post('/', loginLimiter, authController.login);

// 🔄 Rafraîchissement du token : GET /auth/refresh
router.get('/refresh', authController.refresh);

// 🚪 Déconnexion : POST /auth/logout
router.post('/logout', authController.logout);

module.exports = router;
