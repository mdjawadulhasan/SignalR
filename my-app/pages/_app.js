import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiamF3YWQ1MjkyMyIsImEiOiJjbGhhaXF4MTAwaHVtM2xzMmt4cnBlNHAyIn0.EQ19qvZI6b9U6hddDji0_g';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
