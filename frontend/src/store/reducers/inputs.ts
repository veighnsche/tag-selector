import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ImageInputsType, TagType } from '../../types'
import { RootState } from '../index'

const initialState: ImageInputsType = {
  prompt: {
    scene: process.env.REACT_APP_DEFAULT_SCENE || '',
    tags: [],
    negativeTags: [],
  },
  options: {
    width: 512,
    height: 512,
    steps: 30,
    cfg: 7,
    seed: -1,
    samplingMethod: 'Euler A',
    restoreFaces: false,
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
      const { name, isNegative } = action.payload
      const tags = isNegative ? state.prompt.negativeTags : state.prompt.tags
      const tagIndex = tags.findIndex(tag => tag.name === name)
      if (tagIndex !== -1) {
        // subtract 10% from the strength
        const strength = tags[tagIndex].strength
        tags[tagIndex].strength -= strength * 0.1
      }
    },
    setSize: (state, action: PayloadAction<{
      width: number,
      height: number,
    }>) => {
      const { width, height } = action.payload
      state.options.width = width
      state.options.height = height
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
  setSize,
} = inputsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectScene = (state: RootState) => state.inputs.prompt.scene
export const selectTags = (state: RootState) => state.inputs.prompt.tags
export const selectNegativeTags = (state: RootState) => state.inputs.prompt.negativeTags
export const selectSize = (state: RootState) => {
  const { width, height } = state.inputs.options
  return { width, height }
}
export const selectInputs = (state: RootState) => state.inputs

export const inputsReducer = inputsSlice.reducer
