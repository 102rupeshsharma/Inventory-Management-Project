const express = require('express');
const router = express.Router();
const { getAuditLogs } = require('../controllers/auditController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');

router.get('/', authMiddleware, authorize('admin'), getAuditLogs);

module.exports = router;
