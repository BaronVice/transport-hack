import { domain } from '@/consts'
import { routesSlice } from '@/store/reducers/routesSlice'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './redux'

export const useRouteList = () => {
	const dispatch = useAppDispatch()
	const { set } = routesSlice.actions
	const routes = useAppSelector(s => s.routesSlice.routes)
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(domain + '/api/route', {
					method: 'get',
					headers: new Headers({
						'ngrok-skip-browser-warning': '69420',
					}),
				})
				const data = await response.json()
				dispatch(set(data))
			} catch (error) {
				console.error('Error fetching data:', error)
			}
		}
		fetchData()
	}, [])
	return routes
}
