import React from 'react';
import { Grid, Container, Button } from '@mui/material';
import Map from './components/Map';
import IncidentList from './components/IncidentList';
import axios from 'axios';

function Dashboard() {
  const [incidents, setIncidents] = React.useState([]);
  const [selectedIncident, setSelectedIncident] = React.useState(null);

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

  return (
    <Container>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        <Grid item xs={12} md={8}>
          <Map incidents={incidents} />
        </Grid>
        <Grid item xs={12} md={4}>
          <IncidentList incidents={incidents} onSelectIncident={setSelectedIncident} />
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '20px' }}
      >
        Report New Incident
      </Button>
    </Container>
  );
}

export default Dashboard;
