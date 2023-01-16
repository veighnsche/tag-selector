import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TagType } from '../../types/Tag'
import { RootState } from '../index'

// Define a type for the slice state
interface InputsState {
  prompt: {
    scene: string,
    tags: TagType[],
    negativeTags: TagType[],
  }
}

// Define the initial state using that type
const initialState: InputsState = {
  prompt: {
    scene: process.env.REACT_APP_DEFAULT_SCENE || '',
    tags: [],
    negativeTags: [],
  },
}

export const inputsSlice = createSlice({
  name: 'inputs',
  initialState,
  reducers: {
    setScene: (state, action: PayloadAction<string>) => {
      state.prompt.scene = action.payload
    },
    newTag: (state, action: PayloadAction<{
      name: TagType['name'],
      isNegative?: boolean,
    }>) => {
      const {name, isNegative} = action.payload
      const tag = {name, strength: 1}
      const tags = isNegative ? state.prompt.negativeTags : state.prompt.tags
      const tagIndex = tags.findIndex(tag => tag.name === name)
      if (tagIndex === -1) {
        tags.push(tag)
      }
    },
    removeTag: (state, action: PayloadAction<{
      name: TagType['name'],
      isNegative?: boolean,
    }>) => {
      const {name, isNegative} = action.payload
      const tags = isNegative ? state.prompt.negativeTags : state.prompt.tags
      const tagIndex = tags.findIndex(tag => tag.name === name)
      if (tagIndex !== -1) {
        tags.splice(tagIndex, 1)
      }
    },
    moveTag: (state, action: PayloadAction<{
      name: TagType['name'],
      isNegative?: boolean,
      position: number,
    }>) => {
      const {name, isNegative, position} = action.payload
      const tags = isNegative ? state.prompt.negativeTags : state.prompt.tags
      const tagIndex = tags.findIndex(tag => tag.name === name)
      if (tagIndex !== -1) {
        const tag = tags.splice(tagIndex, 1)[0]
        tags.splice(position, 0, tag)
      }
    },
    setTagStrength: (state, action: PayloadAction<{
      name: TagType['name'],
      isNegative?: boolean,
      strength: number,
    }>) => {
      const {name, isNegative, strength} = action.payload
      const tags = isNegative ? state.prompt.negativeTags : state.prompt.tags
      const tagIndex = tags.findIndex(tag => tag.name === name)
      if (tagIndex !== -1) {
        tags[tagIndex].strength = strength
      }
    },
    increaseTagStrength: (state, action: PayloadAction<{
      name: TagType['name'],
      isNegative?: boolean,
    }>) => {
      const {name, isNegative} = action.payload
      const tags = isNegative ? state.prompt.negativeTags : state.prompt.tags
      const tagIndex = tags.findIndex(tag => tag.name === name)
      if (tagIndex !== -1) {
        // add 10% to the strength
        const strength = tags[tagIndex].strength
        tags[tagIndex].strength += strength * 0.1
      }
    },
    decreaseTagStrength: (state, action: PayloadAction<{
      name: TagType['name'],
      isNegative?: boolean,
    }>) => {
      const {name, isNegative} = action.payload
      const tags = isNegative ? state.prompt.negativeTags : state.prompt.tags
      const tagIndex = tags.findIndex(tag => tag.name === name)
      if (tagIndex !== -1) {
        // subtract 10% from the strength
        const strength = tags[tagIndex].strength
        tags[tagIndex].strength -= strength * 0.1
      }
    },
  },
})

export const {
  setScene,
  newTag,
  removeTag,
  moveTag,
  setTagStrength,
  increaseTagStrength,
  decreaseTagStrength,
} = inputsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectScene = (state: RootState) => state.inputs.prompt.scene
export const selectTags = (state: RootState) => state.inputs.prompt.tags
export const selectNegativeTags = (state: RootState) => state.inputs.prompt.negativeTags

export const inputsReducer = inputsSlice.reducer
