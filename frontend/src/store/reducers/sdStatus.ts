import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../index'

export enum SdStatus {
  READY = 'READY',
  BUSY = 'BUSY',
  ERROR = 'ERROR',
}

interface SdStatusState {
  status: SdStatus
}

const initialState: SdStatusState = {
  status: SdStatus.READY,
}

export const sdStatusSlice = createSlice({
  name: 'sdStatus',
  initialState,
  reducers: {
    setSdStatus: (state, action: PayloadAction<SdStatus>) => {
      console.log('setSdStatus', action.payload)
      state.status = action.payload
    }
  }
})

export const { setSdStatus } = sdStatusSlice.actions

export const selectSdStatus = (state: RootState) => state.sdStatus.status

export const sdStatusReducer = sdStatusSlice.reducer