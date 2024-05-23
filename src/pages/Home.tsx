import MapboxMap from '@/components/Map'
import Sidebar from '@/components/SideBar'

const Home = () => {
	return (
		<div className='flex h-screen justify-between items-center select-none'>
			<Sidebar />
			<MapboxMap></MapboxMap>
		</div>
	)
}

export default Home
