import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiTypes } from '../types/api';

export interface AuthState {
  account: ApiTypes.Res.ViewAccount | undefined,
}

const initialState: AuthState = {
  account: undefined,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<ApiTypes.Res.ViewAccount>) => {
      state.account = action.payload
    }
  },
})

export const { setAccount } = authSlice.actions
export default authSlice.reducer