import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WalletsState {
  connectedWallet: 'NONE' | 'NAMI'
  pubKeyHash: string[]
}

const initialState: WalletsState = {
  connectedWallet: 'NONE',
  pubKeyHash: [],
}

export const walletsSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    setWallet: (state, action: PayloadAction<'NAMI' | 'NONE'>) => {
      state.connectedWallet = action.payload
    },
    setPubKeyHash: (state, action: PayloadAction<string[]>) => {
      state.pubKeyHash = action.payload
    },
  },
})

export const { setWallet, setPubKeyHash } = walletsSlice.actions
export default walletsSlice.reducer