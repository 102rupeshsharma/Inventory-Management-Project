const express = require('express');
const router = express.Router();
const {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset
} = require('../controllers/assetController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');

router.get('/', authMiddleware, authorize('admin', 'manager', 'employee'), getAssets);
router.post('/', authMiddleware, authorize('admin', 'manager'), createAsset);

router.get('/:id', authMiddleware, authorize('admin', 'manager'), getAssetById);
router.put('/:id', authMiddleware, authorize('admin', 'manager'), updateAsset);
router.delete('/:id', authMiddleware, authorize('admin'), deleteAsset);

module.exports = router;
