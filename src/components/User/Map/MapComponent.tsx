import React, { useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker, useGoogleMap } from '@react-google-maps/api';
import { Box, Typography, Button } from '@mui/material';

// Your Google Maps API key
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

// Set the size of the map container
const mapContainerStyle = {
  height: '400px',
  width: '100%',
};

// Set the default center position of the map
const center = {
  lat: 12.9716, // Default latitude (Bangalore)
  lng: 77.5946, // Default longitude (Bangalore)
};

// Define map options
const options = {
  disableDefaultUI: true,
};

const MapComponent: React.FC<{ onSelectLocation: (lat: number, lng: number) => void }> = ({ onSelectLocation }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const [selected, setSelected] = useState<google.maps.LatLng | null>(null);

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setSelected(event.latLng);
      onSelectLocation(event.latLng.lat(), event.latLng.lng());
    }
  }, [onSelectLocation]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Click on the map to select a location
      </Typography>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
        options={options}
        onClick={handleMapClick}
      >
        {selected && <Marker position={selected.toJSON()} />}
      </GoogleMap>
    </Box>
  );
};

export default MapComponent;
