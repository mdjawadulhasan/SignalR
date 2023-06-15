import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as signalR from '@microsoft/signalr';

export default function Test() {
  const mapContainerRef = useRef(null);
  const [locationData, setLocationData] = useState(null);
  const [map, setMap] = useState(null);
  const markerRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiamF3YWQ1MjkyMyIsImEiOiJjbGhhaXF4MTAwaHVtM2xzMmt4cnBlNHAyIn0.EQ19qvZI6b9U6hddDji0_g';

    const initializeMap = ({ longitude, latitude }) => {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [longitude, latitude],
        zoom: 10,
      });

      // Navigation Control
      const navigationControl = new mapboxgl.NavigationControl();
      map.addControl(navigationControl, 'top-right');

      setMap(map);
    };

    if (locationData) {
      if (map) {
        map.setCenter([locationData.longitude, locationData.latitude]);
        if (markerRef.current) {
          markerRef.current.setLngLat([locationData.longitude, locationData.latitude]);
        } else {
          const marker = new mapboxgl.Marker().setLngLat([locationData.longitude, locationData.latitude]).addTo(map);
          markerRef.current = marker;
        }
      } else {
        initializeMap(locationData);
      }
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [locationData]);

  useEffect(() => {
    const managerId = 'A1';
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7118/locationHub?managerId=${managerId}`)
      .build();

    connection.start()
      .then(() => {
        console.log("SignalR connection established.");
      })
      .catch(error => {
        console.error("Error starting SignalR connection: " + error);
      });

    connection.on("LocationUpdate", (locationData) => {
      console.log("Received location Data:", locationData);
      setLocationData(locationData);
    });
  }, []);

  return (
    <div>
      <div ref={mapContainerRef} style={{ width: '100%', height: '400px' }} />
      <div>SignalR Connection</div>
    </div>
  );
}
