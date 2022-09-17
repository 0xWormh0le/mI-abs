import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import {nftApi} from './api/nftApi';
import {marketApi} from './api/marketApi';
import UIReducer from '../pages/Marketplace/UIslice';
import authSlice from './authSlice';
import walletsSlice from './walletsSlice';

export const store = configureStore({
  reducer: {
    [marketApi.reducerPath]: marketApi.reducer,
    [nftApi.reducerPath]: nftApi.reducer,
    UI: UIReducer,
    auth: authSlice,
    wallets: walletsSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(marketApi.middleware)
      .concat(nftApi.middleware)
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
  RootState,
  unknown,
  Action<string>>;
