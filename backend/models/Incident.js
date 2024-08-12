const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  incidentType: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  severity: { type: Number, required: true },
  reportedAt: { type: Date, default: Date.now },
  status: { type: String, default: 'Active' }
});

module.exports = mongoose.model('Incident', IncidentSchema);
