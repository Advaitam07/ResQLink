const router = require('express').Router();
const { getMapCases, getMapVolunteers, getDeployedOnMap, getUrgentOnMap, searchLocation, getMapSummary } = require('../controllers/mapController');
const { protect } = require('../middlewares/auth');

router.get('/cases',     protect, getMapCases);
router.get('/volunteers', protect, getMapVolunteers);
router.get('/deployed',  protect, getDeployedOnMap);
router.get('/urgent',    protect, getUrgentOnMap);
router.get('/search',    protect, searchLocation);
router.get('/summary',   protect, getMapSummary);

module.exports = router;
