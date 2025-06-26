const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const {
    getPedidos,
    getPedidoById,
    getAllPedidos,
    postPedido,
    patchPedidoStatus,
    deletePedido
} = require('../controllers/pedidoController');

router.get('/all', auth, role('pizzaiolo'), getAllPedidos);
router.get('/',          auth, getPedidos);
router.get('/:id',       auth, getPedidoById);
router.post('/',         auth, postPedido);
router.patch('/:id/status', auth, role('pizzaiolo'), patchPedidoStatus);

router.delete('/:id',    auth, role('pizzaiolo'), deletePedido);

module.exports = router;