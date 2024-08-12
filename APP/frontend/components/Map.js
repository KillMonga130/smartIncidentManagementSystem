import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function Map({ incidents, onClick }) {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      onClick={onClick}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {incidents && incidents.map((incident, index) => (
        <Marker key={index} position={[incident.latitude, incident.longitude]}>
          <Popup>
            <strong>{incident.type}</strong><br />
            Severity: {incident.severity}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Map;
