export interface Polygon {
	type: string
	geometry: {
		type: string
		coordinates: number[][][]
	}
	properties: {
		id: number
		averageSpeed: number
		procentsSpeed: number
		color: string
	}
}
