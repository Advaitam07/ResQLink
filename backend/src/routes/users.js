const router = require('express').Router();
const { getProfile, updateProfile, getAllUsers, getUserById } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/profile',    protect, getProfile);
router.put('/profile',    protect, updateProfile);
router.get('/',           protect, authorize('admin', 'coordinator'), getAllUsers);
router.get('/:id',        protect, getUserById);

module.exports = router;
