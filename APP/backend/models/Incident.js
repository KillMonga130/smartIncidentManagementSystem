const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  type: String,
  latitude: Number,
  longitude: Number,
  severity: Number,
  status: {
    type: String,
    enum: ['reported', 'in-progress', 'resolved'],
    default: 'reported',
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  dateTime: Date,
});

module.exports = mongoose.model('Incident', IncidentSchema);
