import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { SdStatus } from '../../types';
import { RootState } from '../index';

interface SdStatusState {
  status: SdStatus;
  isPlaying: boolean;
}

const initialState: SdStatusState = {
  status: SdStatus.READY,
  isPlaying: false,
};

export const sdStatusSlice = createSlice({
  name: 'sdStatus',
  initialState,
  reducers: {
    setSdStatus: (state, action: PayloadAction<SdStatus>) => {
      state.status = action.payload;
    },
    toggleIsPlaying: (state) => {
      state.isPlaying = !state.isPlaying;
    },
  },
});

export const { setSdStatus, toggleIsPlaying } = sdStatusSlice.actions;

export const selectSdStatus = createSelector(
  (state: RootState) => state.sdStatus,
  (sdStatus) => sdStatus.status
);

export const selectIsPlaying = createSelector(
  (state: RootState) => state.sdStatus,
  (sdStatus) => sdStatus.isPlaying
);

export const sdStatusReducer = sdStatusSlice.reducer;
