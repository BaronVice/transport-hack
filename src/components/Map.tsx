import { NEXT_PUBLIC_MAPBOX_TOKEN, piter } from '@/consts'
import { useAppSelector } from '@/hooks/redux'
import { useRoute } from '@/hooks/useRoute'
import { useTrack } from '@/hooks/useTrack'
import { drawRoute } from '@/lib/drawRoute'
import { initializeGrid } from '@/lib/initGrid'
import { updateGridSpeedLevels } from '@/lib/updateGrid'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import * as React from 'react'
import { useEffect } from 'react'

function MapboxMap() {
	const [map, setMap] = React.useState<mapboxgl.Map>()
	const mapNode = React.useRef(null)
	const [polygons, setPolygons] = React.useState([])
	// const [speeds, setSpeeds] = React.useState([])
	const tracks = useTrack()
	const { route } = useRoute(
		useAppSelector(state => state.routesSlice.cur) ?? '2'
	)
	const size = useAppSelector(state => state.polygonSlice.size)

	useEffect(() => {
		if (typeof window === 'undefined' || mapNode.current === null) return

		const mapboxMap = new mapboxgl.Map({
			container: mapNode.current,
			accessToken: NEXT_PUBLIC_MAPBOX_TOKEN,
			style: 'mapbox://styles/mapbox/streets-v12',
			center: piter,
			zoom: 10,
		})
		setMap(mapboxMap)

		mapboxMap.on('load', () => {
			initializeGrid(mapboxMap, setPolygons, polygons, tracks, size)
		})

		return () => {
			mapboxMap.remove()
		}
	}, [])

	useEffect(() => {
		if (map) {
			updateGridSpeedLevels(polygons, tracks, setPolygons, map)
		}
	}, [tracks])

	useEffect(() => {
		if (route !== null && route.length > 0 && map) {
			drawRoute(map, route)
		}
	}, [route])

	return (
		<div
			className=' z-0 fixed'
			ref={mapNode}
			style={{ width: '100%', height: '100%' }}
		/>
	)
}

export default MapboxMap
