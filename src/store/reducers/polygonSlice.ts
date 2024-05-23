import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface PolygonState {
	size: number
}

const initialState: PolygonState = {
	size: 0.01,
}

export const polygonSlice = createSlice({
	name: 'polygon',
	initialState,
	reducers: {
		set(state, action: PayloadAction<number>) {
			const data = action.payload
			state.size = data
		},
	},
})

export default polygonSlice.reducer
