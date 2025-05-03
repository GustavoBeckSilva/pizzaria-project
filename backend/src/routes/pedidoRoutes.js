// src/routes/pedidoRoutes.js
const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const {
  getPedidos,
  getPedidoById,
  postPedido,
  patchPedidoStatus,
  deletePedido
} = require('../controllers/pedidoController');

router.get('/',           auth, getPedidos);
router.get('/:id',        auth, getPedidoById);
router.post('/',          auth, postPedido);
router.patch('/:id/status', auth, role('pizzaiolo'), patchPedidoStatus);
router.delete('/:id',     auth, deletePedido);

module.exports = router;
