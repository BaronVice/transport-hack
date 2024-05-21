import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import * as React from 'react'

function MapboxMap() {
  const NEXT_PUBLIC_MAPBOX_TOKEN = 'pk.eyJ1Ijoic2ZhMjM0IiwiYSI6ImNsdmhyOGZkNTAxMWgya21rMzFtZWpzajgifQ.CmrrgQGEqG4HPPV3CnlH8A';
  const [map, setMap] = React.useState(null);
  const [busRoute, setBusRoute] = React.useState(null);
  const mapNode = React.useRef(null);

  React.useEffect(() => {
    const fetchBusRoute = async () => {
      try {
        const response = await fetch('src/mock/bus_route.json');
        const data = await response.json();
        setBusRoute(data);
      } catch (error) {
        console.error('Error fetching bus route data:', error);
      }
    };

    fetchBusRoute();
  }, []);

  React.useEffect(() => {
    if (busRoute === null) return;

    const node = mapNode.current;
    if (typeof window === 'undefined' || node === null) return;

    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: NEXT_PUBLIC_MAPBOX_TOKEN,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [104.2833, 52.2833],
      zoom: 12,
    });

    mapboxMap.on('load', () => {
      const geojson = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: busRoute.map(point => [point.longitude, point.latitude]),
        },
      };

      mapboxMap.addSource('route', {
        type: 'geojson',
        data: geojson,
      });

      mapboxMap.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#888',
          'line-width': 6,
        },
      });
    });

    setMap(mapboxMap);

    return () => {
      mapboxMap.remove();
    };
  }, [busRoute]);

  return (
		<div ref={mapNode} style={{ width: '100%', height: '100%' }}/>
	);
}

export default MapboxMap;
