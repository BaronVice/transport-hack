import { domain } from '@/consts'
import { Route } from '@/types/route'
import { useEffect, useState } from 'react'

export const useRoute = (routeNum: string) => {
	const [route, setRoute] = useState<Route>([])
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(domain + '/api/route/' + routeNum, {
					method: 'get',
					headers: new Headers({
						'ngrok-skip-browser-warning': '69420',
					}),
				})
				const data = await response.json()
				setRoute(data)
			} catch (error) {
				return []
				console.error('Error fetching data:', error)
			}
		}
		fetchData()
	}, [routeNum])

	return route
}
