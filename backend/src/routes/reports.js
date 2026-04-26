const router = require('express').Router();
const { getSummary, getStatusBreakdown, getCategoryBreakdown, generateReport, exportReport } = require('../controllers/reportController');
const { protect } = require('../middlewares/auth');

router.get('/summary',  protect, getSummary);
router.get('/status',   protect, getStatusBreakdown);
router.get('/category', protect, getCategoryBreakdown);
router.post('/generate', protect, generateReport);
router.get('/export',   protect, exportReport);

module.exports = router;
