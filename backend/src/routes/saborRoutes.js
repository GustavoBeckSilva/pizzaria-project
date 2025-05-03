// src/routes/saborRoutes.js
const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const {
  getSabores,
  getSaborById,
  postSabor,
  putSabor,
  deleteSabor
} = require('../controllers/saborController');

router.get('/',           auth, getSabores);
router.get('/:id',        auth, getSaborById);
router.post('/',          auth, role('pizzaiolo'), postSabor);
router.put('/:id',        auth, role('pizzaiolo'), putSabor);
router.delete('/:id',     auth, role('pizzaiolo'), deleteSabor);

module.exports = router;
