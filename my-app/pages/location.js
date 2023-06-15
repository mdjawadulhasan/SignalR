import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as signalR from '@microsoft/signalr';

export default function Location() {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const initializeMap = () => {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [90.4125, 23.8103],
        zoom: 10,
      });

      // Navigation Control
      const navigationControl = new mapboxgl.NavigationControl();
      map.addControl(navigationControl, 'top-right');

      setMap(map);
    };

    initializeMap();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  useEffect(() => {
    const managerId = 'A1';
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7118/locationHub?managerId=${managerId}`)
      .build();

    connection
      .start()
      .then(() => {
        console.log('SignalR connection established.');
      })
      .catch((error) => {
        console.error('Error starting SignalR connection: ' + error);
      });

    connection.on('LocationUpdate', (locationData) => {
      console.log('Received location Data:', locationData);

      if (map) {
        const { latitude, longitude, employeeName } = locationData;

        if (marker) {
          marker.setLngLat([longitude, latitude]).setPopup(new mapboxgl.Popup().setHTML(employeeName));
        } else {
          if (map.loaded()) {
            const newMarker = new mapboxgl.Marker()
              .setLngLat([longitude, latitude])
              .setPopup(new mapboxgl.Popup().setHTML(employeeName))
              .addTo(map);
            setMarker(newMarker);
          } else {
            map.on('load', () => {
              const newMarker = new mapboxgl.Marker()
                .setLngLat([longitude, latitude])
                .setPopup(new mapboxgl.Popup().setHTML(employeeName))
                .addTo(map);
              setMarker(newMarker);
            });
          }
        }
      }
    });
  }, [map]);

  return (
    <div>
      <div ref={mapContainerRef} style={{ width: '100%', height: '400px' }} />
      <div>SignalR Connection</div>
    </div>
  );
}
