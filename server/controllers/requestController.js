const Request = require('../models/Request');
const Asset = require('../models/Asset');
const User = require('../models/User');
const logActivity = require('../utils/logger');

const createRequest = async (req, res) => {
  try {
    const { assetId } = req.body;

    if (!assetId) {
      return res.status(400).json({
        message: 'Asset ID is required'
      });
    }

    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({
        message: 'Asset not found'
      });
    }

    if (asset.status !== 'available') {
      return res.status(400).json({
        message: 'This asset is currently not available for requesting'
      });
    }

    const pendingRequest = await Request.findOne({
      assetId,
      requestedBy: req.user.id,
      status: 'pending'
    });

    if (pendingRequest) {
      return res.status(400).json({
        message: 'You already have a pending request for this asset'
      });
    }

    const newRequest = new Request({
      assetId,
      requestedBy: req.user.id,
      status: 'pending'
    });

    const savedRequest = await newRequest.save();

    await logActivity(req.user.id, 'Request Submitted', `Submitted request for asset: ${asset.name} (S/N: ${asset.serialNumber})`);

    res.status(201).json({
      message: 'Asset request submitted successfully',
      request: savedRequest
    });

  } catch (error) {
    console.error('Create request error:', error);
    res.status(550).json({
      message: 'Failed to submit asset request'
    });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requestedBy: req.user.id })
      .populate('assetId', 'name category serialNumber status')
      .populate('approvedBy', 'name email')
      .sort({ requestedAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({
      message: 'Failed to fetch request history'
    });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filterStatus = status && ['pending', 'approved', 'rejected'].includes(status) ? status : 'pending';

    const requests = await Request.find({ status: filterStatus })
      .populate('requestedBy', 'name email')
      .populate('assetId', 'name category serialNumber quantity')
      .sort({ requestedAt: filterStatus === 'pending' ? 1 : -1 });

    res.json(requests);
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      message: 'Failed to fetch requests'
    });
  }
};


const approveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: 'Request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        message: `This request has already been ${request.status}`
      });
    }

    const asset = await Asset.findById(request.assetId);
    if (!asset) {
      return res.status(404).json({
        message: 'Corresponding asset not found'
      });
    }

    if (asset.status !== 'available') {
      return res.status(400).json({
        message: 'The requested asset is no longer available'
      });
    }

    request.status = 'approved';
    request.approvedBy = req.user.id;
    await request.save();

    asset.status = 'assigned';
    await asset.save();

    await logActivity(req.user.id, 'Request Approved', `Approved request for asset: ${asset.name} (S/N: ${asset.serialNumber})`);

    res.json({
      message: 'Request approved successfully and asset assigned',
      request
    });

  } catch (error) {
    console.error('Approve request error:', error);
    res.status(500).json({
      message: 'Failed to approve request'
    });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: 'Request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        message: `This request has already been ${request.status}`
      });
    }


    request.status = 'rejected';
    request.approvedBy = req.user.id;
    await request.save();

    const asset = await Asset.findById(request.assetId);
    const assetName = asset ? asset.name : 'N/A';
    const serialNumber = asset ? asset.serialNumber : 'N/A';

    await logActivity(req.user.id, 'Request Rejected', `Rejected request for asset: ${assetName} (S/N: ${serialNumber})`);

    res.json({
      message: 'Request rejected successfully',
      request
    });

  } catch (error) {
    console.error('Reject request error:', error);
    res.status(550).json({
      message: 'Failed to reject request'
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user.id;

    if (role === 'admin') {
      const totalAssets = await Asset.countDocuments();
      const availableAssets = await Asset.countDocuments({ status: 'available' });
      const assignedAssets = await Asset.countDocuments({ status: 'assigned' });
      const pendingRequests = await Request.countDocuments({ status: 'pending' });
      const totalUsers = await User.countDocuments();

      return res.json({
        totalAssets,
        availableAssets,
        assignedAssets,
        pendingRequests,
        totalUsers
      });
    } else if (role === 'manager') {
      const availableAssets = await Asset.countDocuments({ status: 'available' });
      const pendingRequests = await Request.countDocuments({ status: 'pending' });
      const approvedRequests = await Request.countDocuments({ status: 'approved' });

      return res.json({
        availableAssets,
        pendingRequests,
        approvedRequests
      });
    } else if (role === 'employee') {
      const assignedAssetsList = await Request.find({ requestedBy: userId, status: 'approved' })
        .populate('assetId', 'name category serialNumber');

      const assignedAssets = assignedAssetsList
        .filter(r => r.assetId !== null)
        .map(r => ({
          _id: r.assetId._id,
          name: r.assetId.name,
          category: r.assetId.category,
          serialNumber: r.assetId.serialNumber
        }));

      const totalRequests = await Request.countDocuments({ requestedBy: userId });
      const pendingCount = await Request.countDocuments({ requestedBy: userId, status: 'pending' });
      const approvedCount = await Request.countDocuments({ requestedBy: userId, status: 'approved' });
      const rejectedCount = await Request.countDocuments({ requestedBy: userId, status: 'rejected' });

      return res.json({
        assignedAssets,
        totalRequests,
        statusSummary: {
          pending: pendingCount,
          approved: approvedCount,
          rejected: rejectedCount
        }
      });
    }

    res.status(400).json({ message: 'Invalid user role' });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      message: 'Failed to fetch dashboard statistics'
    });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getPendingRequests,
  approveRequest,
  rejectRequest,
  getDashboardStats
};
