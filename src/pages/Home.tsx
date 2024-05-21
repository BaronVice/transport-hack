import Sidebar from '@/components/SideBar'
import { Button } from '@/components/ui/button'
import MapboxMap from '@/components/Map'

const Home = () => {
	return (
		<div className='flex h-screen justify-between items-center select-none'>
			<Sidebar/>
			<MapboxMap></MapboxMap>
		</div>
	);
};

export default Home;
