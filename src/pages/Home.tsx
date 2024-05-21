import MapboxMap from '@/components/Map'
import Sidebar from '@/components/SideBar'
import { Slider } from '@/components/ui/slider'
import { useState } from 'react'

const Home = () => {
	const [time, settime] = useState(124)
	const formatTime = (value: number): string => {
    const hours: number = Math.floor(value / 60);
    const minutes: number = value % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };
	return (
		<div className='flex h-screen justify-between items-center select-none'>
			<Sidebar/>
			<MapboxMap></MapboxMap>
			<div className='fixed top-5 right-10 flex gap-4'>
				<span className='font-bold'>{formatTime(time)}</span>
				<Slider className='w-72' onValueChange={(e) => settime(e)} value={[time]} defaultValue={[time]} max={24 * 60 - 1} step={1} />
			</div>
		</div>
	);
};

export default Home;
