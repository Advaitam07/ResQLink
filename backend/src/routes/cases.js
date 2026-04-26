const router = require('express').Router();
const {
  createCase, getCases, getCaseById, updateCase, deleteCase,
  assignVolunteer, sendReport, getCaseStats,
} = require('../controllers/caseController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/stats/summary', protect, getCaseStats);
router.route('/')
  .get(protect, getCases)
  .post(protect, authorize('admin', 'coordinator'), createCase);
router.route('/:id')
  .get(protect, getCaseById)
  .put(protect, authorize('admin', 'coordinator'), updateCase)
  .delete(protect, authorize('admin', 'coordinator'), deleteCase);
router.patch('/:id/assign',      protect, authorize('admin', 'coordinator'), assignVolunteer);
router.patch('/:id/send-report', protect, authorize('admin', 'coordinator'), sendReport);

module.exports = router;
