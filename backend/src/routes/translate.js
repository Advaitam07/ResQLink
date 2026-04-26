const router = require('express').Router();
const { translate, translateCase } = require('../controllers/translateController');
const { protect } = require('../middlewares/auth');

router.post('/',          protect, translate);
router.post('/case/:id',  protect, translateCase);

module.exports = router;
