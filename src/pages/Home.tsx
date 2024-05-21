import Sidebar from '@/components/SideBar'
import { Button } from '@/components/ui/button'

const Home = () => {
	return (
		<div className='flex h-screen bg-blue-50 justify-between items-center select-none'>
			<Sidebar/>
			<Button>FFFF</Button>
		</div>
	);
};

export default Home;
