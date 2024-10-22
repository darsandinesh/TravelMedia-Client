import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Autocomplete } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerIconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { toast } from 'sonner';

const OLA_MAPS_API_KEY = import.meta.env.VITE_OLA_API_KEY;

const customIcon = new L.Icon({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIconRetinaUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapComponent = (props: any) => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [directions, setDirections] = useState<any>(null);
  const [error, setError] = useState('');
  const [endCoordinates, setEndCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [startCoordinates, setStartCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [readableDistance, setReadableDistance] = useState('');
  const [readableDuration, setReadableDuration] = useState('');

  const fetchDirections = async () => {
    if (!startCoordinates || !endCoordinates) {
      setError('Please provide both starting and destination locations.');
      toast.info(`startCoorfintat:${startCoordinates} --------endcoordinate:${endCoordinates}`);
      return;
    }

    try {
      const response = await axios.post(
        `https://api.olamaps.io/routing/v1/directions?origin=${startCoordinates.lat},${startCoordinates.lng}&destination=${endCoordinates.lat},${endCoordinates.lng}&api_key=${OLA_MAPS_API_KEY}`
      );

      // Log and set directions
      console.log(response.data, 'data from direction');
      setDirections(response.data.routes);
      if (response.data.routes.length > 0 && response.data.routes[0].legs.length > 0) {
        setReadableDistance(response.data.routes[0].legs[0].readable_distance);
        setReadableDuration(response.data.routes[0].legs[0].readable_duration);
      }
      setError('');
    } catch (err) {
      setError('Error fetching directions. Please check your inputs.');
      console.error(err);
    }
  };

  const fetchCoordinates = async (place: string) => {
    try {
      const response = await axios.get(
        `https://api.olamaps.io/places/v1/autocomplete?input=${place}&api_key=${OLA_MAPS_API_KEY}`
      );
      return response.data.predictions;
    } catch (err) {
      setError('Error fetching coordinates.');
      console.error(err);
    }
  };

  const fetchCoordinate = async (place: string) => {
    try {
      const response = await axios.get(
        `https://api.olamaps.io/places/v1/autocomplete?input=${place}&api_key=${OLA_MAPS_API_KEY}`
      );
      const location = response.data.predictions[0]?.geometry.location;
      if (location) {
        return { lat: location.lat, lng: location.lng };
      } else {
        setError('Could not find coordinates for the selected place.');
      }
    } catch (err) {
      setError('Error fetching coordinates.');
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (props.start) {
        const data: { lat: number; lng: number } | undefined = await fetchCoordinate(props.start);

        if (data) {
          setEndCoordinates(data);
          setEndLocation(props.start);
        }
      }
    };
    fetchData();
  }, [props.start]);

  const handleInputChange = (event: any, value: string) => {
    console.log(event);
    setStartLocation(value);
    if (!value) {
      setSuggestions([]);
      return;
    }

    debounceFetchCoordinates(value);
  };

  // Debounce function
  const debounceFetchCoordinates = (() => {
    let timeout: ReturnType<typeof setTimeout>;

    return (value: string) => {
      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(async () => {
        const predictions = await fetchCoordinates(value);
        setStartCoordinates(predictions[0].geometry.location);
        setSuggestions(predictions || []);
      }, 300); // Adjust the delay as needed (300ms in this case)
    };
  })();

  const handleSuggestionSelect = async (event: any, value: any | null) => {
    console.log(event)
    if (value) {
      setStartLocation(value.description);
      const coordinates = await fetchCoordinate(value.description);
      if (coordinates) {
        setStartCoordinates(coordinates);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchDirections();
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Directions
      </Typography>
      <form onSubmit={handleSubmit}>
        <Autocomplete
          options={suggestions}
          getOptionLabel={(option) => option.description || ''}
          onInputChange={handleInputChange}
          onChange={handleSuggestionSelect}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Starting Location"
              required
              fullWidth
              sx={{ marginBottom: 2 }}
            />
          )}
        />
        <TextField
          label="Destination Location"
          value={endLocation}
          onChange={(e) => setEndLocation(e.target.value)}
          required
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Get Directions
        </Button>
      </form>

      {error && <Typography color="error">{error}</Typography>}

      {startCoordinates && endCoordinates && (
        <Box sx={{ marginTop: 4 }}>
          <MapContainer center={[startCoordinates.lat, startCoordinates.lng]} zoom={13} style={{ height: '400px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[startCoordinates.lat, startCoordinates.lng]} icon={customIcon}>
              <Popup>Starting: {startLocation}</Popup>
            </Marker>
            <Marker position={[endCoordinates.lat, endCoordinates.lng]} icon={customIcon}>
              <Popup>Destination: {endLocation}</Popup>
            </Marker>

            {/* Draw route if directions are available */}
            {directions && directions.length > 0 && directions[0].legs && (
              <Polyline
                positions={directions[0].legs[0].steps.reduce((acc: any[], step: any) => {
                  acc.push([step.start_location.lat, step.start_location.lng]);
                  acc.push([step.end_location.lat, step.end_location.lng]);
                  return acc;
                }, [])}
                color="blue"
                weight={5}
              />
            )}
          </MapContainer>
        </Box>
      )}

      {directions && directions.length > 0 && directions[0].legs.length > 0 && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6">
            Total Distance: {readableDistance} km
          </Typography>
          <Typography variant="h6">
            Estimated Time: {readableDuration}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MapComponent;
