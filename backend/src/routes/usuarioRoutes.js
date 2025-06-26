const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const {
  getUsuarios,
  getUsuarioById,
  postUsuario,
  putUsuario,
  deleteUsuario
} = require('../controllers/usuarioController');

router.post('/', postUsuario);

router.use(auth);

router.get('/',        getUsuarios);
router.get('/:id',     getUsuarioById);
router.put('/:id',     putUsuario);
router.delete('/:id', roleMiddleware('pizzaiolo'), deleteUsuario);

module.exports = router;
