import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useRouteList } from '@/hooks/useRouteList'
import { polygonSlice } from '@/store/reducers/polygonSlice'
import { routesSlice } from '@/store/reducers/routesSlice'
import { useState } from 'react'
import Timer from './ui/Timer'
import { Button } from './ui/button'
import { Slider } from './ui/slider'

const SideBar = () => {
	const routes = useRouteList()
	const routeItems = Array.isArray(routes) ? routes : []
	const [time, settime] = useState(124)
	const dispatch = useAppDispatch()
	const { set } = polygonSlice.actions
	const { setCur } = routesSlice.actions
	const size = useAppSelector(state => state.polygonSlice.size)
	const formatTime = (value: number): string => {
		const hours: number = Math.floor(value / 60)
		const minutes: number = value % 60
		return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
			2,
			'0'
		)}`
	}
	return (
		<div className='fixed top-0 m-2 left-0 w-[25rem] h-62 rounded-xl z-10 bg-secondary/60 flex flex-col gap-12 items-center px-4 py-8 shadow-black/40 shadow-lg'>
			<Timer />
			<Select onValueChange={e => dispatch(setCur(e))}>
				<SelectTrigger className='w-64'>
					<SelectValue placeholder='Маршрут' />
				</SelectTrigger>
				<SelectContent>
					{routeItems.map((e, index) => (
						<SelectItem key={index} value={e}>
							{e}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<div className='flex gap-4'>
				<span className='font-bold'>
					{time == 0 ? 'За все время' : `Время: ${formatTime(time)}`}
				</span>
				<Slider
					className='w-72'
					onValueChange={e => settime(e)}
					value={[time]}
					defaultValue={[time]}
					max={24 * 60 - 1}
					step={1}
				/>
			</div>
			<div className='flex gap-4'>
				<span className='font-bold'>Размер сетки: {size}</span>
				<Slider
					className='w-72'
					onValueChange={e => dispatch(set(e))}
					value={[size]}
					defaultValue={[size]}
					max={0.1}
					step={0.001}
				/>
			</div>
			<Button
				onClick={() => {
					alert('пока не сделали')
				}}
			>
				Экспортировать в GeoJSON
			</Button>
		</div>
	)
}

export default SideBar
