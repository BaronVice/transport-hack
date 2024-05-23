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
						data1['longitude'] >= data.geometry.coordinates[0][0][0] &&
						data1['longitude'] <= data.geometry.coordinates[0][1][0]
					) {
						if (
							data1['latitude'] >= data.geometry.coordinates[0][2][1] &&
							data1['latitude'] <= data.geometry.coordinates[0][0][1]
						) {
							dataPoints.push(data1['speed'])
							labels.push(data1['time'])
						}
					}
				})
			}
		}
	})

	const chartContainer = document.querySelector('#lineChart')

	if (chartContainer) {
		new Chart(chartContainer as ChartItem, {
			type: 'line',
			data: {
				labels,
				datasets: [
					{
						label: 'Уровень шума',
						data: dataPoints,
					},
				],
			},
		})
	} else {
		console.error('Element with id "lineChart" not found.')
	}

	const averageSpeedElement = document.getElementById('averageSpeed')
	if (averageSpeedElement) {
		averageSpeedElement.innerHTML = `<p>Средняя скорость: ${averageSpeed}</p>`
	} else {
		console.error('Element with id "averageSpeed" not found.')
	}
}
