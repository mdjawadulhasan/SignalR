import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as signalR from '@microsoft/signalr';

export default function Map() {
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
      .withUrl(`http://172.16.229.218/locations`, {
     
        accessTokenFactory: () => {
          return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjA2YzU2NGI5LTNhNWItNDZiNC0zMzMzLTA4ZGI4MTMzMTQwOSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6Ik1TRkFBZG1pbkB5b3BtYWlsLmNvbSIsInVzZXJOYW1lIjoiTVNGQUFkbWluIiwiZnVsbE5hbWUiOiJBZG1pbiBBZG1pbiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJBZG1pbiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3N1cm5hbWUiOiJBZG1pbiIsImlwQWRkcmVzcyI6IjAuMC4wLjEiLCJpbWFnZV91cmwiOiIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9tb2JpbGVwaG9uZSI6IiIsImlzSGlnaGVyTGV2ZWxNYW5hZ2VyIjoiVHJ1ZSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjoxNjg5NDk5MTM3fQ.ZZNEmBZdrhD9QWXerhs2pgbrk6aYOZkG1q0rE1fQqWM";
        }
      })
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
