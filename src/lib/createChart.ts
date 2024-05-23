import { Polygon } from '@/types/polygon'
import { Track } from '@/types/track'

export const createChart = (
	coordinates: mapboxgl.LngLat,
	polygons: Polygon[],
	tracks: Track[]
) => {
	const labels: string[] = []
	const dataPoints: number[] = []
	let averageSpeed = 0
	let proc = 0

	polygons.forEach(data => {
		if (
			coordinates.lng >= data.geometry.coordinates[0][0][0] &&
			coordinates.lng <= data.geometry.coordinates[0][1][0]
		) {
			if (
				coordinates.lat >= data.geometry.coordinates[0][2][1] &&
				coordinates.lat <= data.geometry.coordinates[0][0][1]
			) {
				averageSpeed = data.properties.averageSpeed
				proc = data.properties.procentsSpeed
				tracks.forEach(data1 => {
					if (
						data1['lon'] >= data.geometry.coordinates[0][0][0] &&
						data1['lon'] <= data.geometry.coordinates[0][1][0]
					) {
						if (
							data1['lat'] >= data.geometry.coordinates[0][2][1] &&
							data1['lat'] <= data.geometry.coordinates[0][0][1]
						) {
							dataPoints.push(data1['speed'])
							labels.push(data1['timestamp'])
						}
					}
				})
			}
		}
	})


	const averageSpeedElement = document.getElementById('averageSpeed')
	if (averageSpeedElement) {
		averageSpeedElement.innerHTML = `<p>Средняя скорость: ${averageSpeed.toFixed(2)} км/ч</p>`
	} else {
		console.error('Element with id "averageSpeed" not found.')
	}
}
