import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../index'

export enum SocketStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
}

interface SocketStatusState {
  status: SocketStatus
}

const initialState: SocketStatusState = {
  status: SocketStatus.DISCONNECTED,
}

export const socketStatusSlice = createSlice({
  name: 'socketStatus',
  initialState,
  reducers: {
    setSocketStatus: (state, action) => {
      state.status = action.payload
    }
  }
})

export const { setSocketStatus } = socketStatusSlice.actions

export const selectSocketStatus = (state: RootState) => state.socketStatus.status

export const socketStatusReducer = socketStatusSlice.reducer
