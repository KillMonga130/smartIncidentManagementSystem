import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Map from './Map'; // We'll implement this later

const socket = io('http://localhost:5000');

const incidentTypes = ['Fire', 'Flood', 'Accident', 'Medical Emergency'];

function App() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [incidentType, setIncidentType] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [severity, setSeverity] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchIncidents();

    socket.on('prediction', (data) => {
      setPrediction(data.prediction);
    });

    return () => {
      socket.off('prediction');
    };
  }, []);

  const fetchIncidents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/incidents');
      setIncidents(response.data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

  const handleReportIncident = async (e) => {
    e.preventDefault();
    const newIncident = {
      incidentType,
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
      severity: parseInt(severity, 10),
    };

    try {
      await axios.post('http://localhost:5000/api/incidents', newIncident);
      fetchIncidents(); // Refresh the incident list
      setIncidentType('');
      setLatitude('');
      setLongitude('');
      setSeverity('');
      setDialogOpen(false);
    } catch (error) {
      console.error('Error reporting incident:', error);
    }
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Smart Incident Management System</Typography>
        </Toolbar>
      </AppBar>

      <Container>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setDialogOpen(true)}
          style={{ marginTop: '20px' }}
        >
          Report New Incident
        </Button>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Report Incident</DialogTitle>
          <DialogContent>
            <TextField
              select
              label="Incident Type"
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
              fullWidth
              margin="normal"
            >
              {incidentTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Latitude"
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Longitude"
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Severity (1-5)"
              type="number"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleReportIncident} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <Typography variant="h5" style={{ marginTop: '20px' }}>
          Active Incidents
        </Typography>
        <Paper elevation={3}>
          <List>
            {incidents.map((incident, index) => (
              <ListItem
                button
                key={index}
                onClick={() => setSelectedIncident(incident)}
              >
                <ListItemText
                  primary={`${incident.incidentType} - Severity: ${incident.severity}`}
                  secondary={`Location: (${incident.location.latitude}, ${incident.location.longitude})`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {selectedIncident && (
          <Dialog
            open={Boolean(selectedIncident)}
            onClose={() => setSelectedIncident(null)}
          >
            <DialogTitle>Incident Details</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                <strong>Type:</strong> {selectedIncident.incidentType}
              </Typography>
              <Typography variant="body1">
                <strong>Location:</strong> (
                {selectedIncident.location.latitude},{' '}
                {selectedIncident.location.longitude})
              </Typography>
              <Typography variant="body1">
                <strong>Severity:</strong> {selectedIncident.severity}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {selectedIncident.status}
              </Typography>
              <Map
                latitude={selectedIncident.location.latitude}
                longitude={selectedIncident.location.longitude}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedIncident(null)} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {prediction && (
          <div style={{ marginTop: '20px' }}>
            <Typography variant="h5">Latest Prediction</Typography>
            <Typography variant="body1">{`Prediction: ${prediction}`}</Typography>
          </div>
        )}
      </Container>
    </div>
  );
}

export default App;
