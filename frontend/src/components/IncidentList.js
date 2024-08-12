import React from 'react';
import { List, ListItem, ListItemText, Paper, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function IncidentList({ incidents, onSelectIncident }) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredIncidents = incidents.filter(incident =>
    incident.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper elevation={3} style={{ padding: '16px' }}>
      <TextField
        label="Search Incidents"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <List>
        {filteredIncidents.map((incident, index) => (
          <ListItem button key={index} onClick={() => onSelectIncident(incident)}>
            <ListItemText
              primary={`${incident.type} - Severity: ${incident.severity}`}
              secondary={`Location: (${incident.latitude}, ${incident.longitude})`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default IncidentList;
