const express = require('express');
const Incident = require('../models/Incident');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const incidents = await Incident.find();
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { type, latitude, longitude, severity, dateTime } = req.body;
  try {
    const incident = new Incident({ type, latitude, longitude, severity, dateTime });
    await incident.save();
    res.status(201).json(incident);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
