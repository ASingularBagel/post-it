import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import dataReducer from './features/data/dataSlice'
import uiReducer from './features/ui/uiSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        data: dataReducer,
        ui: uiReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
