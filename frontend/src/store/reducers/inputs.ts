import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ImageInputsType } from '../../types'
import { ImageDataType } from '../../types/image-data'
import { RootState } from '../index'

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
  },
}

export const inputsSlice = createSlice({
  name: 'inputs',
  initialState,
  reducers: {
    setScene: (state, action: PayloadAction<string>) => {
      state.prompt.scene = action.payload
    },
    setNegativePrompt: (state, action: PayloadAction<string>) => {
      state.prompt.negativePrompt = action.payload
    },
    setSize: (state, action: PayloadAction<{
      width: number,
      height: number,
    }>) => {
      const { width, height } = action.payload
      state.options.width = width
      state.options.height = height
    },
    setWidth: (state, action: PayloadAction<number>) => {
      state.options.width = action.payload
    },
    setHeight: (state, action: PayloadAction<number>) => {
      state.options.height = action.payload
    },
    setSteps: (state, action: PayloadAction<number>) => {
      state.options.steps = action.payload
    },
    setCfg: (state, action: PayloadAction<number>) => {
      state.options.cfg = action.payload
    },
    setSeed: (state, action: PayloadAction<number>) => {
      state.options.seed = action.payload
    },
    setRestoreFaces: (state, action: PayloadAction<boolean>) => {
      state.options.restoreFaces = action.payload
    },
    setSamplingMethod: (state, action: PayloadAction<string>) => {
      state.options.samplingMethod = action.payload
    },
    setHighResFix: (state, action: PayloadAction<boolean>) => {
      state.options.highResFix.enabled = action.payload
    },
    setHRFScale: (state, action: PayloadAction<number>) => {
      state.options.highResFix.scale = action.payload
    },
    setHRFSteps: (state, action: PayloadAction<number>) => {
      state.options.highResFix.steps = action.payload
    },
    setHRFUpscaler: (state, action: PayloadAction<string>) => {
      state.options.highResFix.upscaler = action.payload
    },
    setHRFDenoisingStrength: (state, action: PayloadAction<number>) => {
      state.options.highResFix.denoisingStrength = action.payload
    },
    setInputsFromImageData: (state, action: PayloadAction<Partial<ImageDataType>>) => {
      const imageData = action.payload

      if (imageData.prompt) {
        state.prompt.scene = imageData.prompt
      }
      if (imageData.negativePrompt) {
        state.prompt.negativePrompt = imageData.negativePrompt
      }
      if (imageData.width) {
        state.options.width = imageData.width
      }
      if (imageData.height) {
        state.options.height = imageData.height
      }
      if (imageData.steps) {
        state.options.steps = imageData.steps
      }
      if (imageData.cfg) {
        state.options.cfg = imageData.cfg
      }
      if (imageData.seed) {
        state.options.seed = imageData.seed
      }
      if (imageData.samplingMethod) {
        state.options.samplingMethod = imageData.samplingMethod
      }
    },
  },
})

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
  setInputsFromImageData,
} = inputsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectScene = (state: RootState) => state.inputs.prompt.scene
export const selectNegativePrompt = (state: RootState) => state.inputs.prompt.negativePrompt
export const selectSize = (state: RootState) => {
  const { width, height } = state.inputs.options
  return { width, height }
}
export const selectInputs = (state: RootState) => state.inputs
export const selectSliders = (state: RootState) => {
  return {
    steps: state.inputs.options.steps,
    cfg: state.inputs.options.cfg,
    seed: state.inputs.options.seed,
    samplingMethod: state.inputs.options.samplingMethod,
    restoreFaces: state.inputs.options.restoreFaces,
  }
}

export const selectHRF = (state: RootState) => state.inputs.options.highResFix
export const selectSeed = (state: RootState) => state.inputs.options.seed
export const selectSteps = (state: RootState) => state.inputs.options.steps

export const inputsReducer = inputsSlice.reducer
