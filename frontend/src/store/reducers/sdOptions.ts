import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SdOptionsType } from '../../types/sd-options'
import { RootState } from '../index'

interface SdOptionsState {
  options: SdOptionsType
}

const initialState: SdOptionsState = {
  options: {
    sd_model_checkpoint: '',
  },
}

export const sdOptionsSlice = createSlice({
  name: 'sdOptions',
  initialState,
  reducers: {
    setSdOptions: (state, action: PayloadAction<{ options: SdOptionsType }>) => {
      state.options = action.payload.options
    },
  },
})

export const { setSdOptions } = sdOptionsSlice.actions

export const selectCurrentModel = (state: RootState) => {
  return state.sdOptions.options.sd_model_checkpoint
}

export const sdOptionsReducer = sdOptionsSlice.reducer