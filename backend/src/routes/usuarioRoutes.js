// src/routes/usuarioRoutes.js
const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const { 
  getUsuarios,
  getUsuarioById,
  postUsuario,
  putUsuario,
  deleteUsuario
} = require('../controllers/usuarioController');

router.use(auth);
router.get('/',          getUsuarios);
router.get('/:id',       getUsuarioById);
router.post('/',         postUsuario);
router.put('/:id',       putUsuario);
router.delete('/:id',    deleteUsuario);

module.exports = router;
