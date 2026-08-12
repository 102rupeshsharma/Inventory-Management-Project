const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  getPendingRequests,
  approveRequest,
  rejectRequest,
  getDashboardStats
} = require('../controllers/requestController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');

router.get('/stats', authMiddleware, getDashboardStats);
router.post('/', authMiddleware, authorize('employee'), createRequest);
router.get('/my', authMiddleware, authorize('employee'), getMyRequests);

router.get('/pending', authMiddleware, authorize('admin', 'manager'), getPendingRequests);
router.patch('/:id/approve', authMiddleware, authorize('admin', 'manager'), approveRequest);
router.patch('/:id/reject', authMiddleware, authorize('admin', 'manager'), rejectRequest);

module.exports = router;
