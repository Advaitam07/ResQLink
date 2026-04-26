const router = require('express').Router();
const { getSettings, updateSettings, updateNotifications, updatePreferences } = require('../controllers/settingsController');
const { protect } = require('../middlewares/auth');

router.get('/',                    protect, getSettings);
router.put('/',                    protect, updateSettings);
router.patch('/notifications',     protect, updateNotifications);
router.patch('/preferences',       protect, updatePreferences);

module.exports = router;
