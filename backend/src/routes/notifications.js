const router = require('express').Router();
const { getNotifications, createNotification, markRead, markAllRead } = require('../controllers/notificationController');
const { protect } = require('../middlewares/auth');

router.get('/',                  protect, getNotifications);
router.post('/',                 protect, createNotification);
router.patch('/read-all',        protect, markAllRead);
router.patch('/:id/read',        protect, markRead);

module.exports = router;
