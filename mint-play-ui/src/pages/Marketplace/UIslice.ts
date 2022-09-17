import {createSlice, PayloadAction} from '@reduxjs/toolkit'

type ViewMode = "OnePage" | "InfiniteScroll";
export interface UIState {
  scrollPosition: number;
  currentPage: number;
  mode: ViewMode;
}

const initialState: UIState = {
  scrollPosition: 0,
  currentPage: 1,
  mode: 'OnePage',
}

export const UISlice = createSlice({
  name: 'UI',
  initialState,
  reducers: {
    setScrollPosition: (state, action: PayloadAction<number>) => {
      state.scrollPosition = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    incrementCurrentPage: (state) => {
      state.currentPage++
    },
    setMode: (state, action: PayloadAction<ViewMode>) => {
      state.mode = action.payload
    },
  },
})

export const {setScrollPosition, setCurrentPage, incrementCurrentPage, setMode} = UISlice.actions

export default UISlice.reducer
