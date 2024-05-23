import { combineReducers, configureStore } from '@reduxjs/toolkit'
import polygonSlice from './reducers/polygonSlice'
import routesSlice from './reducers/routesSlice'
const rootReducer = combineReducers({
	routesSlice,
	polygonSlice,
})

export const setupStore = () => {
	return configureStore({
		reducer: rootReducer,
	})
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
