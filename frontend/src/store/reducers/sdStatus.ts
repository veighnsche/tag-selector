import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SdStatus } from '../../types'
import { SdProgressType } from '../../types/sd-progress'
import { RootState } from '../index'

interface SdStatusState {
  status: SdStatus
  isPlaying: boolean
  progress: Omit<SdProgressType, 'current_image'>
}

const initialState: SdStatusState = {
  status: SdStatus.READY,
  isPlaying: false,
  progress: {
    progress: 0,
    eta_relative: 0,
    state: {
      sampling_step: 0,
      sampling_steps: 0,
    }
  }
}

export const sdStatusSlice = createSlice({
  name: 'sdStatus',
  initialState,
  reducers: {
    setSdStatus: (state, action: PayloadAction<SdStatus>) => {
      state.status = action.payload
    },
    toggleIsPlaying: (state) => {
      state.isPlaying = !state.isPlaying
    },
    setProgress: (state, action: PayloadAction<Omit<SdProgressType, 'current_image'>>) => {
      state.progress = action.payload
    },
    resetProgress: (state) => {
      state.progress = initialState.progress
    }
  }
})

export const { setSdStatus, toggleIsPlaying, setProgress, resetProgress } = sdStatusSlice.actions

export const selectSdStatus = (state: RootState) => state.sdStatus.status
export const selectIsPlaying = (state: RootState) => state.sdStatus.isPlaying
export const selectProgress = (state: RootState) => state.sdStatus.progress.progress
export const selectEtaRelative = (state: RootState): string | null => {
  const seconds = state.sdStatus.progress.eta_relative

  if (seconds === 0) return null

  // seconds = 0.342352354365
  // return "1m 30s"
  const minutes = Math.floor(seconds / 60)
  const secondsLeft = Math.floor(seconds % 60)
  return `${minutes}m ${secondsLeft}s`
}
export const selectSamplingStep = (state: RootState) => ({
  current: state.sdStatus.progress.state.sampling_step,
  total: state.sdStatus.progress.state.sampling_steps
})

export const sdStatusReducer = sdStatusSlice.reducer
