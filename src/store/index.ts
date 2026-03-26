import { configureStore } from '@reduxjs/toolkit';
import { githubApi } from './githubApi';
import uiReducer from './uiSlice';
import colorReducer from './colorSlice';

export const store = configureStore({
    reducer: {
        [githubApi.reducerPath]: githubApi.reducer,
        ui: uiReducer,
        colors: colorReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(githubApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
