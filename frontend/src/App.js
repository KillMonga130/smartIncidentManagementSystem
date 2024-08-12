import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

function App() {
  const [incidents, setIncidents] = useState([]);
  const [incidentType, setIncidentType] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [severity, setSeverity] = useState('');
  const [prediction, setPrediction] = useState(null);

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
    } catch (error) {
      console.error('Error reporting incident:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Smart Incident Management System</h1>

        <h2>Report a New Incident</h2>
        <form onSubmit={handleReportIncident}>
          <input
            type="text"
            placeholder="Incident Type"
            value={incidentType}
            onChange={(e) => setIncidentType(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Severity (1-5)"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            required
          />
          <button type="submit">Submit Incident</button>
        </form>

        <h2>Active Incidents</h2>
        <ul>
          {incidents.map((incident, index) => (
            <li key={index}>
              {incident.incidentType} at ({incident.location.latitude},{' '}
              {incident.location.longitude}) - Severity: {incident.severity}
            </li>
          ))}
        </ul>

        {prediction && (
          <div>
            <h2>Latest Prediction</h2>
            <p>Prediction: {prediction}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
