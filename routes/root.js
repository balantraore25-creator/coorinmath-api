const express = require('express');
const path = require('path');
const router = express.Router();

// 🏠 Route d'accueil : /, /index ou /index.html
router.get(/^\/$|\/index(.html)?/, (req, res) => {
  const indexPath = path.resolve(__dirname, '..', 'views', 'index.html');
  res.sendFile(indexPath);
});

module.exports = router;
