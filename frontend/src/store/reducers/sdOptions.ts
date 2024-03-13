import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { SdOptionsType } from '../../types/sd-options';
import { RootState } from '../index';

interface SdOptionsState {
  options: SdOptionsType;
}

const initialState: SdOptionsState = {
  options: {
    sd_model_checkpoint: '',
    CLIP_stop_at_last_layers: 1,
    sd_vae: 'None',
    interrogate_deepbooru_score_threshold: 0.15,
  },
};

export const sdOptionsSlice = createSlice({
  name: 'sdOptions',
  initialState,
  reducers: {
    setSdOptions: (state, action: PayloadAction<{ options: SdOptionsType }>) => {
      state.options = action.payload.options;
    },
  },
});

export const { setSdOptions } = sdOptionsSlice.actions;

export const selectCurrentModel = createSelector(
  (state: RootState) => state.sdOptions.options,
  (options) => options.sd_model_checkpoint,
);

export const selectCurrentClipSkip = createSelector(
  (state: RootState) => state.sdOptions.options,
  (options) => options.CLIP_stop_at_last_layers,
);

export const selectCurrentVae = createSelector(
  (state: RootState) => state.sdOptions.options,
  (options) => options.sd_vae,
);

export const selectCurrentTagScanThreshold = createSelector(
  (state: RootState) => state.sdOptions.options,
  (options) => options.interrogate_deepbooru_score_threshold,
);

export const sdOptionsReducer = sdOptionsSlice.reducer;
