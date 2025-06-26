const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

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
router.delete('/:id',  role('pizzaiolo'), deleteUsuario);

module.exports = router;
