const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  resourceType: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  status: { type: String, default: 'Available' }
});

module.exports = mongoose.model('Resource', ResourceSchema);
