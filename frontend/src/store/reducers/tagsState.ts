import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../index'

interface TagsState {
  isDragging: boolean
}

const initialState: TagsState = {
  isDragging: false,
}

export const tagsState = createSlice({
  name: 'tagsState',
  initialState,
  reducers: {
    setIsDragging: (state, action: PayloadAction<boolean>) => {
      state.isDragging = action.payload
    }
  }
})

export const { setIsDragging } = tagsState.actions

export const selectIsDragging = (state: RootState) => state.tagsState.isDragging

export const tagsStateReducer = tagsState.reducer