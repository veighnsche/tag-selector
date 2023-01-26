import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FetchImageDataType } from '../../types/fetch-image-data'
import { ImageCustomDataType } from '../../types/image-custom-data'
import { ImageDataType } from '../../types/image-data'
import { RootState } from '../index'

export interface ImagesState {
  images: string[]
  imageModal: string | null
  isModalOpen: boolean
  imageData: Record<string, ImageDataType>
  imageCustomData: Record<string, ImageCustomDataType>
}

export const initialState: ImagesState = {
  images: [],
  imageModal: null,
  isModalOpen: false,
  imageData: {},
  imageCustomData: {},
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
    toggleModal: (state) => {
      state.isModalOpen = !state.isModalOpen
    },
    setModalImage: (state, action: PayloadAction<string | null>) => {
      state.imageModal = action.payload
    },
    nextModalImage: (state) => {
      if (state.imageModal === null) return
      const currentIndex = state.images.indexOf(state.imageModal)
      const nextIndex = currentIndex + 1
      if (nextIndex >= state.images.length) return
      state.imageModal = state.images[nextIndex]
    },
    previousModalImage: (state) => {
      if (state.imageModal === null) return
      const currentIndex = state.images.indexOf(state.imageModal)
      const previousIndex = currentIndex - 1
      if (previousIndex < 0) return
      state.imageModal = state.images[previousIndex]
    },
    setImageData: (state, action: PayloadAction<{ filename: string } & FetchImageDataType>) => {
      state.imageData[action.payload.filename] = action.payload.imageData
      state.imageCustomData[action.payload.filename] = action.payload.tagSelectorData
    },
  },
})

export const {
  addImagesToEnd,
  addImagesToStart,
  removeImage,
  setModalImage,
  toggleModal,
  nextModalImage,
  previousModalImage,
  setImageData,
} = imagesSlice.actions

export const selectImages = (state: RootState) => state.images.images
export const selectModalImage = (state: RootState) => state.images.imageModal
export const selectIsModalOpen = (state: RootState) => state.images.isModalOpen
export const selectIsLastImage = (state: RootState) => {
  if (state.images.imageModal === null) return false
  const currentIndex = state.images.images.indexOf(state.images.imageModal)
  return currentIndex === state.images.images.length - 1
}
export const selectImageData = (state: RootState) =>
  (filename: string): ImageDataType | undefined => state.images.imageData[filename]
export const selectImageCustomData = (state: RootState) =>
  (filename: string): ImageCustomDataType | undefined => state.images.imageCustomData[filename]
export const selectArrayIdx = (state: RootState) =>
  (filename: string): number => state.images.images.indexOf(filename)

// get the seed number of the last image
export const selectLastSeed = (state: RootState): {
  seed?: number
  filename?: string
} => {
  // last is 0 because the array is reversed
  const lastImage = state.images.images[0]
  if (lastImage === undefined) {
    return {
      seed: undefined,
      filename: undefined,
    }
  }
  const lastImageData = state.images.imageData[lastImage]
  if (lastImageData === undefined) {
    return {
      seed: undefined,
      filename: lastImage,
    }
  }
  return {
    seed: lastImageData.seed,
    filename: lastImage,
  }
}


export const imagesReducer = imagesSlice.reducer
