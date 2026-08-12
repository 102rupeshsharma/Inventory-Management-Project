const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  serialNumber: {
    type: String,
    required: true,
    unique: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  status: {
    type: String,
    enum: ['available', 'assigned', 'maintenance'],
    default: 'available'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;
