import * as React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Chart from 'chart.js/auto';

const NEXT_PUBLIC_MAPBOX_TOKEN = 'pk.eyJ1Ijoic2ZhMjM0IiwiYSI6ImNsdmhyOGZkNTAxMWgya21rMzFtZWpzajgifQ.CmrrgQGEqG4HPPV3CnlH8A';

function MapboxMap() {
  const [map, setMap] = React.useState(null);
  const mapNode = React.useRef(null);
  const [polygons, setPolygons] = React.useState([]);
  const [noises, setNoises] = React.useState([]);

  React.useEffect(() => {
    if (typeof window === 'undefined' || mapNode.current === null) return;

    const mapboxMap = new mapboxgl.Map({
      container: mapNode.current,
      accessToken: NEXT_PUBLIC_MAPBOX_TOKEN,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [104.2660688, 52.252361],
      zoom: 10,
    });

    mapboxMap.on('load', () => {
      initializeGrid(mapboxMap);
      fetchData();
    });

    setMap(mapboxMap);

    return () => {
      mapboxMap.remove();
    };
  }, []);

  const initializeGrid = (mapboxMap) => {
    const gridSize = 0.002;
    const bounds = mapboxMap.getBounds();
    const nw = bounds.getNorthWest();
    const se = bounds.getSouthEast();
    const columns = Math.ceil((se.lng - nw.lng) / gridSize);
    const rows = Math.ceil((nw.lat - se.lat) / gridSize);

    const gridPolygons = [];
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        const polygon = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [nw.lng + i * gridSize, nw.lat - j * gridSize],
              [nw.lng + (i + 1) * gridSize, nw.lat - j * gridSize],
              [nw.lng + (i + 1) * gridSize, nw.lat - (j + 1) * gridSize],
              [nw.lng + i * gridSize, nw.lat - (j + 1) * gridSize],
              [nw.lng + i * gridSize, nw.lat - j * gridSize],
            ]],
          },
          properties: {
            id: i * rows + j,
            avarageNoise: 0,
            procentsNoise: 0,
            color: "rgba(0, 0, 0, 0.2)"
          }
        };
        gridPolygons.push(polygon);
      }
    }
    setPolygons(gridPolygons);

    mapboxMap.addLayer({
      id: 'grid',
      type: 'fill',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: gridPolygons,
        }
      },
      layout: {},
      paint: {
        'fill-color': ['get', 'color'],
        'fill-opacity': 0.1
      }
    });

    mapboxMap.on('click', 'grid', function (e) {
      const coordinates = e.lngLat;
      const popupContent = `<h3>Координаты полигона:</h3><p>${coordinates.lng}, ${coordinates.lat}</p><div id="avarageNoise"></div>`;
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`<div class="chart">${popupContent}<canvas id="lineChart" style="min-height: 250px; height: 250px; max-height: 250px; max-width: 100%;"></canvas></div>`)
        .addTo(mapboxMap);
      createChart(coordinates);
    });

    mapboxMap.on('mouseenter', 'grid', function () {
      mapboxMap.getCanvas().style.cursor = 'pointer';
    });

    mapboxMap.on('mouseleave', 'grid', function () {
      mapboxMap.getCanvas().style.cursor = '';
    });
  };

  const fetchData = async () => {
    try {
      const response = await fetch('https://2106-92-51-45-202.ngrok-free.app/api/noises/?format=json', {
        method: "get",
        headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
        }),
      });
      const data = await response.json();
      setNoises(data);
      updateGridNoiseLevels(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateGridNoiseLevels = (noises) => {
    let sumNoise = 0;
    let count = 0;
    let maxAv = 0;
    let minAv = 100;

    const updatedPolygons = polygons.map(data => {
      noises.forEach(data1 => {
        if (data1['longitude'] >= data.geometry.coordinates[0][0][0] && data1['longitude'] <= data.geometry.coordinates[0][1][0]) {
          if (data1['latitude'] >= data.geometry.coordinates[0][2][1] && data1['latitude'] <= data.geometry.coordinates[0][0][1]) {
            sumNoise += data1['decibels'];
            count += 1;
          }
        }
      });
      data.properties.avarageNoise = sumNoise / count;
      if (!isNaN(data.properties.avarageNoise)) {
        minAv = Math.min(minAv, data.properties.avarageNoise);
        maxAv = Math.max(maxAv, data.properties.avarageNoise);
      }
      sumNoise = 0;
      count = 0;
      return data;
    });

    maxAv -= minAv;

    const finalPolygons = updatedPolygons.map(data => {
      data.properties.procentsNoise = (data.properties.avarageNoise - minAv) / maxAv;
      if (!isNaN(data.properties.procentsNoise)) {
        const red = Math.round(data.properties.procentsNoise * 255);
        const green = 255 - red;
        data.properties.color = `rgb(${red}, ${green}, 0)`;
      }
      return data;
    });

    setPolygons(finalPolygons);

    map.addLayer({
      id: 'gridLayer',
      type: 'fill',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: finalPolygons,
        }
      },
      layout: {},
      paint: {
        'fill-color': ['get', 'color'],
        'fill-opacity': 0.4
      }
    });

    map.removeLayer('grid');

    map.setZoom(14);
  };

  const createChart = (coordinates) => {
    const labels = [];
    const dataPoints = [];
    let avarageNoise = 0;
    let proc = 0;

    polygons.forEach(data => {
      if (coordinates.lng >= data.geometry.coordinates[0][0][0] && coordinates.lng <= data.geometry.coordinates[0][1][0]) {
        if (coordinates.lat >= data.geometry.coordinates[0][2][1] && coordinates.lat <= data.geometry.coordinates[0][0][1]) {
          avarageNoise = data.properties.avarageNoise;
          proc = data.properties.procentsNoise;
          noises.forEach(data1 => {
            if (data1['longitude'] >= data.geometry.coordinates[0][0][0] && data1['longitude'] <= data.geometry.coordinates[0][1][0]) {
              if (data1['latitude'] >= data.geometry.coordinates[0][2][1] && data1['latitude'] <= data.geometry.coordinates[0][0][1]) {
                dataPoints.push(data1['decibels']);
                labels.push(data1['datetime']);
              }
            }
          });
        }
      }
    });

    const chartContainer = document.getElementById('lineChart');

    new Chart(chartContainer, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Уровень шума',
          data: dataPoints,
        }]
      },
    });

    document.getElementById('avarageNoise').innerHTML = `<p>Средний шум: ${avarageNoise}</p>`;
  };

  return <div ref={mapNode} style={{ width: '100%', height: '100%' }} />;
}

export default MapboxMap;
