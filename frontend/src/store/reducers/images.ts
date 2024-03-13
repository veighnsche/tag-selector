import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { FetchImageDataType } from '../../types/fetch-image-data';
import { ImageCustomDataType } from '../../types/image-custom-data';
import { ImageDataType } from '../../types/image-data';
import { RootState } from '../index';

export interface ImagesState {
  images: string[];
  imageModal: string | null;
  isModalOpen: boolean;
  imageData: Record<string, ImageDataType>;
  imageCustomData: Record<string, ImageCustomDataType>;
}

export const initialState: ImagesState = {
  images: [],
  imageModal: null,
  isModalOpen: false,
  imageData: {},
  imageCustomData: {},
};

export const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    addImagesToEnd: (state, action: PayloadAction<string[]>) => {
      state.images.push(...action.payload);
    },
    addImagesToStart: (state, action: PayloadAction<string[]>) => {
      state.images.unshift(...action.payload.reverse());
    },
    removeImage: (state, action: PayloadAction<number>) => {
      state.images.splice(action.payload, 1);
    },
    toggleModal: (state) => {
      state.isModalOpen = !state.isModalOpen;
    },
    setModalImage: (state, action: PayloadAction<string | null>) => {
      state.imageModal = action.payload;
    },
    nextModalImage: (state) => {
      if (state.imageModal === null) return;
      const currentIndex = state.images.indexOf(state.imageModal);
      const nextIndex = currentIndex + 1;
      if (nextIndex >= state.images.length) return;
      state.imageModal = state.images[nextIndex];
    },
    previousModalImage: (state) => {
      if (state.imageModal === null) return;
      const currentIndex = state.images.indexOf(state.imageModal);
      const previousIndex = currentIndex - 1;
      if (previousIndex < 0) return;
      state.imageModal = state.images[previousIndex];
    },
    setImageData: (state, action: PayloadAction<{ filename: string } & FetchImageDataType>) => {
      state.imageData[action.payload.filename] = action.payload.imageData;
      state.imageCustomData[action.payload.filename] = action.payload.tagSelectorData;
    },
  },
});

export const {
  addImagesToEnd,
  addImagesToStart,
  removeImage,
  setModalImage,
  toggleModal,
  nextModalImage,
  previousModalImage,
  setImageData,
} = imagesSlice.actions;

// replace 'yourRootReducer' with actual path to your root reducer

export const selectImages = createSelector(
  (state: RootState) => state.images,
  (images) => images.images,
);

export const selectModalImage = createSelector(
  (state: RootState) => state.images,
  (images) => images.imageModal,
);

export const selectIsModalOpen = createSelector(
  (state: RootState) => state.images,
  (images) => images.isModalOpen,
);

export const selectIsLastImage = createSelector(
  (state: RootState) => state.images,
  (images) => {
    if (images.imageModal === null) return false;
    const currentIndex = images.images.indexOf(images.imageModal);
    return currentIndex === images.images.length - 1;
  },
);

export const selectImageData = createSelector(
  (state: RootState) => state.images,
  (images) =>
    (filename: string): ImageDataType | undefined =>
      images.imageData[filename],
);

export const selectImageCustomData = createSelector(
  (state: RootState) => state.images,
  (images) =>
    (filename: string): ImageCustomDataType | undefined =>
      images.imageCustomData[filename],
);

export const selectArrayIdx = createSelector(
  (state: RootState) => state.images,
  (images) =>
    (filename: string): number =>
      images.images.indexOf(filename),
);

export const selectLastSeed = createSelector(
  (state: RootState) => state.images,
  (images): {
    seed?: number;
    filename?: string;
  } => {
    const lastImage = images.images[0];
    if (lastImage === undefined) {
      return {
        seed: undefined,
        filename: undefined,
      };
    }
    const lastImageData = images.imageData[lastImage];
    if (lastImageData === undefined) {
      return {
        seed: undefined,
        filename: lastImage,
      };
    }
    return {
      seed: lastImageData.seed,
      filename: lastImage,
    };
  },
);

export const imagesReducer = imagesSlice.reducer;
