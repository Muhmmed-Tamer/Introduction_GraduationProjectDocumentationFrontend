import { createStore } from "redux";
import { combineReducer } from "./Reducer/combineReducers";
import { composeWithDevTools } from '@redux-devtools/extension';
import { persistStore, persistReducer } from 'redux-persist'; 
import storage from 'redux-persist/lib/storage'; 

const persistConfig  = {
    key: 'root',
    storage,
    whitelist: ['UserIsLogin']
}

const myPersistedReducer  = persistReducer(persistConfig,combineReducer);

export const store = createStore(myPersistedReducer,composeWithDevTools());
export const persistor = persistStore(store);