// import { configureStore, combineReducers } from '@reduxjs/toolkit';
// // import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// import userAuthReducer from '../slice/UserSlice'; // Ensure correct import path
// import adminAuthReducer from '../slice/AdminSlice'; // Ensure correct import path

// const persistConfig = {
//     key: 'root',
//     version: 1,
//     storage,
// };

// const rootReducer = combineReducers({
//     UserAuth: userAuthReducer.reducer,
//     AdminAuth: adminAuthReducer,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// const store = configureStore({
//     reducer: persistedReducer,
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck:false
//             // {
//             //     ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//             // },
//         }),
// });

// const persistor = persistStore(store);

// export { store, persistor };
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;



import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slice/UserSlice'; 

export const store = configureStore({
  reducer: {
    userAuth: userReducer, // Correctly assign the reducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
     
