const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

// GET all resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new resource
router.post('/', async (req, res) => {
  const resource = new Resource(req.body);
  try {
    const newResource = await resource.save();
    res.status(201).json(newResource);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a resource's status/location
router.put('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (resource == null) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    resource.status = req.body.status || resource.status;
    resource.location = req.body.location || resource.location;
    const updatedResource = await resource.save();
    res.json(updatedResource);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a resource
router.delete('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (resource == null) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    await resource.remove();
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
