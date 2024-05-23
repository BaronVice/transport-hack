import { Point } from '@/types/route'

export const drawRoute = (mapboxMap: mapboxgl.Map, route: Point[]) => {
	if (!route || !Array.isArray(route)) {
		return
	}

	console.log(route)

	const geojson = {
		type: 'Feature',
		geometry: {
			type: 'LineString',
			coordinates: route.map(point => [point.lon, point.lat]),
		},
	}

	if (mapboxMap.getLayer('route')) {
		return
	}
	mapboxMap.addSource('route', {
		type: 'geojson',
		data: geojson,
	})
	mapboxMap.addLayer({
		id: 'route',
		type: 'line',
		source: 'route',
		layout: {
			'line-join': 'round',
			'line-cap': 'round',
		},
		paint: {
			'line-color': '#ff0000',
			'line-width': 2.5,
		},
	})
}
