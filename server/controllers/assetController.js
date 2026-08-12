const Asset = require('../models/Asset');
const logActivity = require('../utils/logger');

const getAssets = async (req, res) => {
  try {
    const { search, category, status, page = 1, limit = 10 } = req.query;
    let query = {};

    if (req.user && req.user.role === 'employee') {
      query.status = 'available';
    } else if (status) {
      query.status = status;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const [assets, total] = await Promise.all([
      Asset.find(query).skip(skip).limit(limitNumber).populate('createdBy', 'name email'),
      Asset.countDocuments(query)
    ]);

    res.json({
      assets,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber)
    });
  } catch (error) {
    console.error('Fetch assets error:', error);
    res.status(500).json({
      message: 'Failed to fetch assets'
    });
  }
};

const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id).populate('createdBy', 'name email');

    if (!asset) {
      return res.status(404).json({
        message: 'Asset not found'
      });
    }

    res.json(asset);
  } catch (error) {
    console.error('Fetch asset by ID error:', error);
    res.status(500).json({
      message: 'Failed to fetch asset details'
    });
  }
};

const createAsset = async (req, res) => {
  try {
    const { name, category, serialNumber, quantity, status } = req.body;

    if (!name || !category || !serialNumber) {
      return res.status(400).json({
        message: 'Name, category, and serial number are required'
      });
    }

    const serialExists = await Asset.findOne({ serialNumber });
    if (serialExists) {
      return res.status(400).json({
        message: 'Asset with this serial number already exists'
      });
    }

    const newAsset = new Asset({
      name,
      category,
      serialNumber,
      quantity: quantity || 1,
      status: status || 'available',
      createdBy: req.user.id
    });

    const savedAsset = await newAsset.save();

    // Audit Log Activity
    await logActivity(req.user.id, 'Asset Created', `Created asset: ${savedAsset.name} (S/N: ${savedAsset.serialNumber})`);

    res.status(201).json({
      message: 'Asset created successfully',
      asset: savedAsset
    });
  } catch (error) {
    console.error('Create asset error:', error);
    res.status(500).json({
      message: 'Failed to create asset'
    });
  }
};

const updateAsset = async (req, res) => {
  try {
    const { name, category, serialNumber, quantity, status } = req.body;

    if (!name || !category || !serialNumber) {
      return res.status(400).json({
        message: 'Name, category, and serial number are required'
      });
    }

    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({
        message: 'Asset not found'
      });
    }

    if (serialNumber !== asset.serialNumber) {
      const serialExists = await Asset.findOne({ serialNumber });
      if (serialExists) {
        return res.status(400).json({
          message: 'Asset with this serial number already exists'
        });
      }
    }

    asset.name = name;
    asset.category = category;
    asset.serialNumber = serialNumber;
    asset.quantity = quantity || 1;
    asset.status = status || 'available';

    const updatedAsset = await asset.save();

    // Audit Log Activity
    await logActivity(req.user.id, 'Asset Updated', `Updated asset: ${updatedAsset.name} (S/N: ${updatedAsset.serialNumber})`);

    res.json({
      message: 'Asset updated successfully',
      asset: updatedAsset
    });
  } catch (error) {
    console.error('Update asset error:', error);
    res.status(500).json({
      message: 'Failed to update asset'
    });
  }
};

const deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        message: 'Asset not found'
      });
    }

    await Asset.findByIdAndDelete(req.params.id);

    // Audit Log Activity
    await logActivity(req.user.id, 'Asset Deleted', `Deleted asset: ${asset.name} (S/N: ${asset.serialNumber})`);

    res.json({
      message: 'Asset deleted successfully'
    });
  } catch (error) {
    console.error('Delete asset error:', error);
    res.status(500).json({
      message: 'Failed to delete asset'
    });
  }
};

module.exports = {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset
};
