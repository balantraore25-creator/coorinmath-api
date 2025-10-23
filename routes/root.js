const express = require('express');
const path = require('path');
const router = express.Router();

// Route pour / ou /index ou /index.html
router.get(/^\/$|\/index(.html)?/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

module.exports = router;
