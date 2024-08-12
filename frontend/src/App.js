import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000'); // Connect to the backend

function App() {
  const [incidents, setIncidents] = useState([]);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    // Fetch existing incidents when the component mounts
    fetchIncidents();

    // Listen for real-time predictions
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

  const handleReportIncident = async () => {
    // Here you would gather data from a form or input fields
    const newIncident = {
      incidentType: 'Fire',
      location: {
        latitude: 34.0522,
        longitude: -118.2437,
      },
      severity: 3,
    };

    try {
      await axios.post('http://localhost:5000/api/incidents', newIncident);
      fetchIncidents(); // Refresh the incident list
    } catch (error) {
      console.error('Error reporting incident:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Smart Incident Management System</h1>
        <button onClick={handleReportIncident}>Report Incident</button>

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
