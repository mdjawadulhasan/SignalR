import { useEffect } from 'react';
import * as signalR from '@microsoft/signalr';

export default function Location() {
  useEffect(() => {
    const managerId ="A1"
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
      // Handle the location update as needed
    });
  }, []);

  return <div>SignalR Connection</div>;
}
