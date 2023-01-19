import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../index'

export interface ImagesState {
  images: string[]
  modalImage: string | null
}

export const initialState: ImagesState = {
  images: [],
  modalImage: null,
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
    setModalImage: (state, action: PayloadAction<string | null>) => {
      state.modalImage = action.payload
    },
    nextModalImage: (state) => {
      if (state.modalImage === null) return
      const currentIndex = state.images.indexOf(state.modalImage)
      const nextIndex = currentIndex + 1
      if (nextIndex >= state.images.length) return
      state.modalImage = state.images[nextIndex]
    },
    previousModalImage: (state) => {
      if (state.modalImage === null) return
      const currentIndex = state.images.indexOf(state.modalImage)
      const previousIndex = currentIndex - 1
      if (previousIndex < 0) return
      state.modalImage = state.images[previousIndex]
    },
  },
})

export const {
  addImagesToEnd,
  addImagesToStart,
  removeImage,
  setModalImage,
  nextModalImage,
  previousModalImage,
} = imagesSlice.actions

export const selectImages = (state: RootState) => state.images.images
export const selectModalImage = (state: RootState) => state.images.modalImage
export const selectIsLastImage = (state: RootState) => {
  if (state.images.modalImage === null) return false
  const currentIndex = state.images.images.indexOf(state.images.modalImage)
  return currentIndex === state.images.images.length - 1
}

export const imagesReducer = imagesSlice.reducer
