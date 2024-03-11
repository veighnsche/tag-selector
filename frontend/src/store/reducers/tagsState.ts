import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

interface TagsState {
  isDragging: boolean;
  showHiddenTags: boolean;
}

const initialState: TagsState = {
  isDragging: false,
  showHiddenTags: false,
};

export const tagsState = createSlice({
  name: 'tagsState',
  initialState,
  reducers: {
    setIsDragging: (state, action: PayloadAction<boolean>) => {
      state.isDragging = action.payload;
    },
    toggleShowHiddenTags: (state) => {
      state.showHiddenTags = !state.showHiddenTags;
    },
  },
});

export const { setIsDragging, toggleShowHiddenTags } = tagsState.actions;

export const selectIsDragging = (state: RootState) => state.tagsState.isDragging;
export const selectShowHiddenTags = (state: RootState) => state.tagsState.showHiddenTags;

export const tagsStateReducer = tagsState.reducer;
