import { domain } from '@/consts'
import { Route } from '@/types/route'
import { useEffect, useState } from 'react'

export const useRoute = (routeNum: string) => {
	const [route, setRoute] = useState<Route>([])
	const [isLoadingRoute, setIsLoadingRoute] = useState<boolean>(false)
	useEffect(() => {
		const fetchData = async () => {
			setIsLoadingRoute(true)
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
		setIsLoadingRoute(false)
	}, [routeNum])

	return { route, isLoadingRoute }
}
