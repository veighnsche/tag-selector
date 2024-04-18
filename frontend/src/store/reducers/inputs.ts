import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { ImageInputsType } from '../../types';
import { ImageDataType } from '../../types/image-data';
import { RootState } from '../index';

const initialState: ImageInputsType = {
  prompt: {
    scene: process.env.REACT_APP_DEFAULT_SCENE || '',
    negativePrompt: '',
  },
  options: {
    width: 512,
    height: 512,
    steps: 30,
    cfg: 7,
    seed: -1,
    samplingMethod: 'Euler a',
    restoreFaces: false,
    highResFix: {
      enabled: false,
      upscaler: 'ESRGAN_4x',
      scale: 2,
      steps: 0,
      denoisingStrength: 0.7,
    },
    refiner: {
      checkpoint: '',
      switchAt: 50,
    },
    llmEnhance: {
      enabled: false,
      prompt: 'Your task is to return the same format (single line, comma separated, list of tags) with more adjectives in order to enhance the image.',
    },
  },
};

export const inputsSlice = createSlice({
  name: 'inputs',
  initialState,
  reducers: {
    setScene: (state, action: PayloadAction<string>) => {
      state.prompt.scene = action.payload;
    },
    setNegativePrompt: (state, action: PayloadAction<string>) => {
      state.prompt.negativePrompt = action.payload;
    },
    setSize: (
      state,
      action: PayloadAction<{
        width: number;
        height: number;
      }>,
    ) => {
      const { width, height } = action.payload;
      state.options.width = width;
      state.options.height = height;
    },
    setWidth: (state, action: PayloadAction<number>) => {
      state.options.width = action.payload;
    },
    setHeight: (state, action: PayloadAction<number>) => {
      state.options.height = action.payload;
    },
    setSteps: (state, action: PayloadAction<number>) => {
      state.options.steps = action.payload;
    },
    setCfg: (state, action: PayloadAction<number>) => {
      state.options.cfg = action.payload;
    },
    setSeed: (state, action: PayloadAction<number>) => {
      state.options.seed = action.payload;
    },
    setRestoreFaces: (state, action: PayloadAction<boolean>) => {
      state.options.restoreFaces = action.payload;
    },
    setSamplingMethod: (state, action: PayloadAction<string>) => {
      state.options.samplingMethod = action.payload;
    },
    setHighResFix: (state, action: PayloadAction<boolean>) => {
      state.options.highResFix.enabled = action.payload;
    },
    setHRFScale: (state, action: PayloadAction<number>) => {
      state.options.highResFix.scale = action.payload;
    },
    setHRFSteps: (state, action: PayloadAction<number>) => {
      state.options.highResFix.steps = action.payload;
    },
    setHRFUpscaler: (state, action: PayloadAction<string>) => {
      state.options.highResFix.upscaler = action.payload;
    },
    setHRFDenoisingStrength: (state, action: PayloadAction<number>) => {
      state.options.highResFix.denoisingStrength = action.payload;
    },
    setRefiner: (state, action: PayloadAction<{ checkpoint: string; switchAt: number }>) => {
      state.options.refiner = action.payload;
    },
    setRefinerCheckpoint: (state, action: PayloadAction<string>) => {
      state.options.refiner.checkpoint = action.payload;
    },
    setRefinerSwitchAt: (state, action: PayloadAction<number>) => {
      state.options.refiner.switchAt = action.payload;
    },
    setInputsFromImageData: (state, action: PayloadAction<Partial<ImageDataType>>) => {
      const imageData = action.payload;

      if (imageData.prompt) {
        state.prompt.scene = imageData.prompt;
      }
      if (imageData.negativePrompt) {
        state.prompt.negativePrompt = imageData.negativePrompt;
      }
      if (imageData.width) {
        state.options.width = imageData.width;
      }
      if (imageData.height) {
        state.options.height = imageData.height;
      }
      if (imageData.steps) {
        state.options.steps = imageData.steps;
      }
      if (imageData.cfg) {
        state.options.cfg = imageData.cfg;
      }
      if (imageData.seed) {
        state.options.seed = imageData.seed;
      }
      if (imageData.samplingMethod) {
        state.options.samplingMethod = imageData.samplingMethod;
      }
    },
    setLlmEnhanceEnabled: (state, action: PayloadAction<boolean>) => {
      state.options.llmEnhance.enabled = action.payload;
    },
    setLlmEnhancePrompt: (state, action: PayloadAction<string>) => {
      state.options.llmEnhance.prompt = action.payload;
    },
  },
});

export const {
  setScene,
  setNegativePrompt,
  setSize,
  setWidth,
  setHeight,
  setSteps,
  setCfg,
  setSeed,
  setRestoreFaces,
  setSamplingMethod,
  setHighResFix,
  setHRFScale,
  setHRFSteps,
  setHRFUpscaler,
  setHRFDenoisingStrength,
  setRefiner,
  setRefinerCheckpoint,
  setRefinerSwitchAt,
  setInputsFromImageData,
  setLlmEnhanceEnabled,
  setLlmEnhancePrompt,
} = inputsSlice.actions;

export const selectScene = createSelector(
  (state: RootState) => state.inputs.prompt,
  (prompt) => prompt.scene,
);

export const selectNegativePrompt = createSelector(
  (state: RootState) => state.inputs.prompt,
  (prompt) => prompt.negativePrompt,
);

export const selectSize = createSelector(
  (state: RootState) => state.inputs.options,
  (options) => {
    const { width, height } = options;
    return { width, height };
  },
);

export const selectInputs = createSelector(
  (state: RootState) => state,
  (state) => state.inputs,
);

export const selectSliders = createSelector(
  (state: RootState) => state.inputs.options,
  (options) => {
    return {
      height: options.height,
      width: options.width,
      steps: options.steps,
      cfg: options.cfg,
      seed: options.seed,
      samplingMethod: options.samplingMethod,
      restoreFaces: options.restoreFaces,
      refinerSwitchAt: options.refiner.switchAt,
    };
  },
);

export const selectHRF = createSelector(
  (state: RootState) => state.inputs.options,
  (options) => options.highResFix,
);

export const selectSeed = createSelector(
  (state: RootState) => state.inputs.options,
  (options) => options.seed,
);

export const selectSteps = createSelector(
  (state: RootState) => state.inputs.options,
  (options) => options.steps,
);

export const selectRefinerCheckpoint = createSelector(
  (state: RootState) => state.inputs.options.refiner,
  (refiner) => refiner.checkpoint,
);

export const selectLlmEnhanceEnabled = createSelector(
  (state: RootState) => state.inputs.options.llmEnhance,
  (llmEnhance) => llmEnhance.enabled,
);

export const selectLlmEnhancePrompt = createSelector(
  (state: RootState) => state.inputs.options.llmEnhance,
  (llmEnhance) => llmEnhance.prompt,
);

export const inputsReducer = inputsSlice.reducer;
