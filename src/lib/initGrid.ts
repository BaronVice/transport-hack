import { Polygon } from '@/types/polygon'
import { Track } from '@/types/track'
import mapboxgl from 'mapbox-gl'
import { createChart } from './createChart'

export const initializeGrid = (
	mapboxMap: mapboxgl.Map,
	setPolygons: (a: any) => void,
	polygons: Polygon[],
	tracks: Track[],
	size: number
) => {
	const gridSize = size
	const bounds = mapboxMap.getBounds()
	const nw = bounds.getNorthWest()
	const se = bounds.getSouthEast()
	const columns = Math.ceil((se.lng - nw.lng) / gridSize)
	const rows = Math.ceil((nw.lat - se.lat) / gridSize)
	const gridPolygons = []
	for (let i = 0; i < columns; i++) {
		for (let j = 0; j < rows; j++) {
			const polygon: Polygon = {
				type: 'Feature',
				geometry: {
					type: 'Polygon',
					coordinates: [
						[
							[nw.lng + i * gridSize, nw.lat - j * gridSize],
							[nw.lng + (i + 1) * gridSize, nw.lat - j * gridSize],
							[nw.lng + (i + 1) * gridSize, nw.lat - (j + 1) * gridSize],
							[nw.lng + i * gridSize, nw.lat - (j + 1) * gridSize],
							[nw.lng + i * gridSize, nw.lat - j * gridSize],
						],
					],
				},
				properties: {
					id: i * rows + j,
					averageSpeed: 0,
					procentsSpeed: 0,
					color: 'rgba(0, 0, 0, 0.2)',
				},
			}
			gridPolygons.push(polygon)
		}
	}
	setPolygons(gridPolygons)

	mapboxMap.addLayer({
		id: 'grid',
		type: 'fill',
		source: {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: gridPolygons,
			},
		},
		layout: {},
		paint: {
			'fill-color': ['get', 'color'],
			'fill-opacity': 0.1,
		},
	})

	mapboxMap.on('click', 'grid', function (e) {
		const coordinates = e.lngLat
		const popupContent = `<h3>Координаты полигона:</h3><p>${coordinates.lng}, ${coordinates.lat}</p><div id="averageSpeed"></div>`
		new mapboxgl.Popup()
		.setLngLat(coordinates)
		.setHTML(
			`<div class="chart">${popupContent}<canvas id="lineChart" style="min-height: 250px; height: 250px; max-height: 250px; max-width: 100%;"></canvas></div>`
		)
		.addTo(mapboxMap)
		createChart(coordinates, polygons, tracks)
	})

	mapboxMap.on('mouseenter', 'grid', function () {
		mapboxMap.getCanvas().style.cursor = 'pointer'
	})

	mapboxMap.on('mouseleave', 'grid', function () {
		mapboxMap.getCanvas().style.cursor = ''
	})
}
