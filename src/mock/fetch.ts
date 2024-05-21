export const fetchBusRouteData = async ()  => {
	try {
			const response = await fetch('@/mock/bus_route.json');
			if (!response.ok) {
					throw new Error('Network response was not ok');
			}
			const data = await response.json();
			return data;
	} catch (error) {
			throw error;
	}
};