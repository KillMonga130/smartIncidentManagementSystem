const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');

// GET all incidents
router.get('/', async (req, res) => {
  try {
    const incidents = await Incident.find();
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new incident
router.post('/', async (req, res) => {
  const incident = new Incident(req.body);
  try {
    const newIncident = await incident.save();
    res.status(201).json(newIncident);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update an incident's status
router.put('/:id', async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (incident == null) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    incident.status = req.body.status || incident.status;
    const updatedIncident = await incident.save();
    res.json(updatedIncident);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an incident
router.delete('/:id', async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (incident == null) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    await incident.remove();
    res.json({ message: 'Incident deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
