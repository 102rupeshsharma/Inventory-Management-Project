const AuditLog = require('../models/AuditLog');

// Get all audit logs (Admin only)
const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({})
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    console.error('Fetch audit logs error:', error);
    res.status(500).json({
      message: 'Failed to fetch audit logs'
    });
  }
};

module.exports = {
  getAuditLogs
};
