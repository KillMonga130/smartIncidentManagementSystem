import React from 'react';
import { Container, Typography, Paper, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function IncidentDetails() {
  const { id } = useParams();
  const [incident, setIncident] = React.useState(null);

  React.useEffect(() => {
    fetchIncident();
  }, [id]);

  const fetchIncident = async () => {
    try {
      const response = await axios.get(`/api/incidents/${id}`);
      setIncident(response.data);
    } catch (error) {
      console.error('Error fetching incident:', error);
    }
  };

  if (!incident) return <Typography>Loading...</Typography>;

  return (
    <Container style={{ marginTop: '20px' }}>
      <Paper style={{ padding: '16px' }}>
        <Typography variant="h4" gutterBottom>{incident.type}</Typography>
        <Typography variant="body1"><strong>Severity:</strong> {incident.severity}</Typography>
        <Typography variant="body1"><strong>Status:</strong> {incident.status}</Typography>
        <Typography variant="body1"><strong>Date & Time:</strong> {new Date(incident.dateTime).toLocaleString()}</Typography>
        <Typography variant="body1"><strong>Location:</strong> {incident.latitude}, {incident.longitude}</Typography>
      </Paper>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {/* Additional details or maps can be added here */}
      </Grid>
    </Container>
  );
}

export default IncidentDetails;
