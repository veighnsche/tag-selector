import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from '../index';

export enum SocketStatus {
  ESTABLISHING = 'ESTABLISHING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
}

interface SocketStatusState {
  status: SocketStatus;
}

const initialState: SocketStatusState = {
  status: SocketStatus.ESTABLISHING,
};

export const socketStatusSlice = createSlice({
  name: 'socketStatus',
  initialState,
  reducers: {
    setSocketStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setSocketStatus } = socketStatusSlice.actions;

export const selectSocketStatus = createSelector(
  (state: RootState) => state.socketStatus,
  (socketStatus) => socketStatus.status
);
export const socketStatusReducer = socketStatusSlice.reducer;
