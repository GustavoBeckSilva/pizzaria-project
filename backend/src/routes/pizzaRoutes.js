// src/routes/pizzaRoutes.js
const router = require('express').Router({ mergeParams: true });
const auth = require('../middlewares/authMiddleware');
const {
  getPizzas,
  postPizza,
  putPizza,
  deletePizza
} = require('../controllers/pizzaController');

router.get('/',          auth, getPizzas);
router.post('/',         auth, postPizza);
router.put('/:pizzaId',  auth, putPizza);
router.delete('/:pizzaId', auth, deletePizza);

module.exports = router;
