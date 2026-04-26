const router = require('express').Router();
const {
  addVolunteer, getVolunteers, getVolunteerById, updateVolunteer,
  deleteVolunteer, authorizeVolunteer, toggleAvailability, getDeployedVolunteers,
} = require('../controllers/volunteerController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/deployed', protect, getDeployedVolunteers);
router.route('/')
  .get(protect, getVolunteers)
  .post(protect, authorize('admin', 'coordinator'), addVolunteer);
router.route('/:id')
  .get(protect, getVolunteerById)
  .put(protect, authorize('admin', 'coordinator'), updateVolunteer)
  .delete(protect, authorize('admin', 'coordinator'), deleteVolunteer);
router.patch('/:id/authorize',   protect, authorize('admin', 'coordinator'), authorizeVolunteer);
router.patch('/:id/availability', protect, toggleAvailability);

module.exports = router;
