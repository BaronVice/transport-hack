import { domain } from '@/consts'
import { Track } from '@/types/track'
import { useEffect, useState } from 'react'

export const useTrack = () => {
	const [track, setTrack] = useState<Track[]>([])

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(domain + '/api/metrics', {
					method: 'get',
					headers: new Headers({
						'ngrok-skip-browser-warning': '69420',
					}),
				})
				const data = await response.json()
				console.log(data)

				setTrack(data)
			} catch (error) {
				console.error('Error fetching data:', error)
			}
		}
		fetchData()
	}, [])

	return track
}
