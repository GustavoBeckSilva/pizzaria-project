// src/routes/tamanhoRoutes.js
const router = require('express').Router();
router.get('/', (req, res) => res.json(['P','M','G']));
module.exports = router;
