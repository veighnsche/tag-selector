import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { imagesReducer } from './reducers/images'
import { inputsReducer } from './reducers/inputs'
import { sdOptionsReducer } from './reducers/sdOptions'
import { sdStatusReducer } from './reducers/sdStatus'
import { socketStatusReducer } from './reducers/socketStatus'

export const store = configureStore({
  reducer: {
    socketStatus: socketStatusReducer,
    sdStatus: sdStatusReducer,
    sdOptions: sdOptionsReducer,
    inputs: inputsReducer,
    images: imagesReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch: () => AppDispatch = useDispatch

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
