import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SdStatus } from '../../types'

import { RootState } from '../index'

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
      state.status = action.payload
    }
  }
})

export const { setSdStatus } = sdStatusSlice.actions

export const selectSdStatus = (state: RootState) => state.sdStatus.status

export const sdStatusReducer = sdStatusSlice.reducer
