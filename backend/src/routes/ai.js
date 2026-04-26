const router = require('express').Router();
const { getAISummary, getAICaseInsights, getAIMapInsights } = require('../controllers/aiController');
const { protect } = require('../middlewares/auth');

router.get('/summary',    protect, getAISummary);
router.get('/cases/:id',  protect, getAICaseInsights);
router.get('/map',        protect, getAIMapInsights);

module.exports = router;
