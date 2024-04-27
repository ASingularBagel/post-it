import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import dataReducer from './features/data/dataSlice';
import uiReducer from './features/ui/uiSlice';

const rootReducer = combineReducers({
    user: userReducer,
    data: dataReducer,
    ui: uiReducer,
});

export default rootReducer;