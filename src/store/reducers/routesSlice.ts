import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface RoutesState {
	routes: string[]
	cur: string
}

const initialState: RoutesState = {
	routes: [],
	cur: '0',
}

export const routesSlice = createSlice({
	name: 'routes',
	initialState,
	reducers: {
		set(state, action: PayloadAction<string[]>) {
			const data = action.payload
			state.routes = data
		},
		setCur(state, action: PayloadAction<string>) {
			const data = action.payload
			state.cur = data
		},
	},
})

export default routesSlice.reducer
