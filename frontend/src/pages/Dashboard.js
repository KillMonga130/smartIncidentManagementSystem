import React from 'react';
import { Grid, Container, Button } from '@mui/material';
import IncidentList from '../components/IncidentList';
import IncidentForm from '../components/IncidentForm';
import Map from '../components/Map';
import axios from 'axios';

function Dashboard() {
  const [incidents, setIncidents] = React.useState([]);
  const [selectedIncident, setSelectedIncident] = React.useState(null);
  const [formOpen, setFormOpen] = React.useState(false);

  React.useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const response = await axios.get('/api/incidents');
      setIncidents(response.data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

  const handleMapClick = (e) => {
    setSelectedIncident({
      latitude: e.latlng.lat,
      longitude: e.latlng.lng,
    });
    setFormOpen(true);
  };

  const handleFormSubmit = async (newIncident) => {
    try {
      await axios.post('/api/incidents', newIncident);
      fetchIncidents();
    } catch (error) {
      console.error('Error reporting incident:', error);
    }
  };

  return (
    <Container>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        <Grid item xs={12} md={8}>
          <Map incidents={incidents} onClick={handleMapClick} />
        </Grid>
        <Grid item xs={12} md={4}>
          <IncidentList incidents={incidents} onSelectIncident={setSelectedIncident} />
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setFormOpen(true)}
        style={{ marginTop: '20px' }}
      >
        Report New Incident
      </Button>
      <IncidentForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </Container>
  );
}

export default Dashboard;
