import React from 'react';
import { TextField, Button, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const incidentTypes = ['Fire', 'Flood', 'Accident', 'Medical Emergency', 'Earthquake', 'Hurricane'];

function IncidentForm({ open, onClose, onSubmit }) {
  const [incidentType, setIncidentType] = React.useState('');
  const [latitude, setLatitude] = React.useState('');
  const [longitude, setLongitude] = React.useState('');
  const [severity, setSeverity] = React.useState('');
  const [dateTime, setDateTime] = React.useState(new Date());

  const handleSubmit = () => {
    onSubmit({
      type: incidentType,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      severity: parseInt(severity, 10),
      dateTime: dateTime.toISOString(),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
        <DateTimePicker
          label="Incident Date & Time"
          value={dateTime}
          onChange={setDateTime}
          renderInput={(props) => <TextField {...props} fullWidth margin="normal" />}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default IncidentForm;
