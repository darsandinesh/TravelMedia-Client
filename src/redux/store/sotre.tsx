import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userAuthSlice from '../slice/UserSlice'
import adminAuthSlice from '../slice/AdminSlice'

const presistConfiguration = {
    key: 'root',
    version: 1,
    storage,
}

const rootReducer = combineReducers({
    UserAuth: userAuthSlice,
    AdminAuth: adminAuthSlice,
})

const persistedReducer = persistReducer(presistConfiguration, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMeddleware) =>
        getDefaultMeddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })
})

export const persistor = persistStore(store);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
