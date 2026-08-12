const AuditLog = require('../models/AuditLog');

/**
 * @param {string} userId
 * @param {string} action
 * @param {string} details
 */
const logActivity = async (userId, action, details) => {
  try {
    await AuditLog.create({
      user: userId,
      action,
      details
    });
  } catch (error) {
    console.error('Failed to save audit log:', error);
  }
};

module.exports = logActivity;
