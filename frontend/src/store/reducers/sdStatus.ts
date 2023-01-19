import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SdStatus } from '../../types'

import { RootState } from '../index'

interface SdStatusState {
  status: SdStatus
  isPlaying: boolean
}

const initialState: SdStatusState = {
  status: SdStatus.READY,
  isPlaying: false,
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
    }
  }
})

export const { setSdStatus, toggleIsPlaying } = sdStatusSlice.actions

export const selectSdStatus = (state: RootState) => state.sdStatus.status
export const selectIsPlaying = (state: RootState) => state.sdStatus.isPlaying

export const sdStatusReducer = sdStatusSlice.reducer
