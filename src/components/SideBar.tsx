import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import Timer from './ui/Timer'

const SideBar = () => {
	return (
		<div className='bg-secondary min-h-screen flex flex-col gap-12 items-center p-8'>
			<Timer/>
			<Select>
				<SelectTrigger className="w-64">
					<SelectValue placeholder="Маршрут" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="54">54</SelectItem>
					<SelectItem value="480">480</SelectItem>
					<SelectItem value="10К">10К</SelectItem>
				</SelectContent>
			</Select>
		</div>
	)
}

export default SideBar