const express = require('express');
const router = express.Router();
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');

router.post('/', authMiddleware, authorize('admin'), createUser);
router.get('/', authMiddleware, authorize('admin'), getUsers);
router.put('/:id', authMiddleware, authorize('admin'), updateUser);
router.delete('/:id', authMiddleware, authorize('admin'), deleteUser);

module.exports = router;
