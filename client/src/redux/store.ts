import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice/authSlice";
import chatReducer from "./chatSlice/chatSlice";
import { persistStore, persistReducer, PURGE, PERSIST, PAUSE, REHYDRATE, FLUSH, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
const persistConfig = {
    key: 'root',
    storage,
  }

const authPersistReducer = persistReducer(persistConfig, authReducer)

const store = configureStore({reducer:{
    auth:authPersistReducer,
    chat:chatReducer
}, middleware: (getDefaultMiddleware) =>
getDefaultMiddleware({
  serializableCheck: {
    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  },
}),})

let persistor = persistStore(store)

export {store, persistor}
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch