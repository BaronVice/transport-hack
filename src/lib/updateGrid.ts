import { Polygon } from '@/types/polygon'
import { Track } from '@/types/track'

export const updateGridSpeedLevels = (
	polygons: Polygon[],
	tracks: Track[],
	setPolygons: (a: any) => void,
	map: mapboxgl.Map
) => {
	let sumSpeed = 0
	let count = 0
	let maxAv = 0
	let minAv = 100
	if (!Array.isArray(tracks)) return
	console.log(tracks)

	const updatedPolygons = polygons.map(data => {
		console.log('vizval!')

		tracks.forEach(data1 => {
			if (
				data1.lon >= data.geometry.coordinates[0][0][0] &&
				data1.lon <= data.geometry.coordinates[0][1][0]
			) {
				if (
					data1.lat >= data.geometry.coordinates[0][2][1] &&
					data1.lat <= data.geometry.coordinates[0][0][1]
				) {
					sumSpeed += data1.speed
					count += 1
				}
			}
		})

		if (count != 0) {
			data.properties.averageSpeed = sumSpeed / count
			minAv = Math.min(minAv, data.properties.averageSpeed)
			maxAv = Math.max(maxAv, data.properties.averageSpeed)
		} else {
			data.properties.averageSpeed = NaN
		}
		sumSpeed = 0
		count = 0
		return data
	})

	maxAv -= minAv

	const finalPolygons = updatedPolygons.map(data => {
		data.properties.procentsSpeed =
			(data.properties.averageSpeed - minAv) / maxAv
		if (!isNaN(data.properties.procentsSpeed)) {
			const red = Math.round(data.properties.procentsSpeed * 255)
			const green = 255 - red
			data.properties.color = `rgb(${green}, ${red}, 0)`
		}

		return data
	})

	setPolygons(finalPolygons)

	map.addLayer({
		id: 'gridLayer',
		type: 'fill',
		source: {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: finalPolygons,
			},
		},
		layout: {},
		paint: {
			'fill-color': ['get', 'color'],
			'fill-opacity': 0.3,
		},
	})
}
