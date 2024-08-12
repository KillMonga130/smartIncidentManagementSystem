const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const http = require('http');
const { Server } = require('socket.io');

const incidentRoutes = require('./routes/incident');
const resourceRoutes = require('./routes/resource');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/smart_incident_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/incidents', incidentRoutes);
app.use('/api/resources', resourceRoutes);

// Endpoint to get predictions from Flask app
app.post('/api/predict', async (req, res) => {
  try {
    const response = await axios.post('http://127.0.0.1:5000/predict', req.body);
    const prediction = response.data.prediction;

    // Broadcast prediction to all connected clients
    io.emit('prediction', { prediction });

    res.json({ prediction });
  } catch (error) {
    res.status(500).json({ message: 'Error predicting incident', error: error.message });
  }
});

// Real-time connection setup
io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('Welcome to the Smart Incident Management System API');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
