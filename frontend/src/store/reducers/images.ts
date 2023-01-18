import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../index'

export interface ImagesState {
  images: string[]
}

export const initialState: ImagesState = {
  images: [],
}

export const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    addImagesToEnd: (state, action: PayloadAction<string[]>) => {
      state.images.push(...action.payload)
    },
    addImagesToStart: (state, action: PayloadAction<string[]>) => {
      state.images.unshift(...action.payload.reverse())
    },
    removeImage: (state, action: PayloadAction<number>) => {
      state.images.splice(action.payload, 1)
    },
  }
})

export const { addImagesToEnd, addImagesToStart, removeImage } = imagesSlice.actions

export const selectImages = (state: RootState) => state.images.images

export const imagesReducer = imagesSlice.reducer