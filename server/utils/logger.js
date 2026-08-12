const AuditLog = require('../models/AuditLog');

/**
 * Log activity helper to record administrative or request events
 * @param {string} userId - ID of the user performing the action
 * @param {string} action - Action description label
 * @param {string} details - Detailed notes on the action
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
