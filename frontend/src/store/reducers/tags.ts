import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PromptTagsType, TagType } from '../../types/image-input'
import { RootState } from '../index'

const initialState: PromptTagsType = {
  tags: [],
  negativeTags: [],
}

export const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    newTag: (state, action: PayloadAction<{
      name: TagType['name'],
      isNegative?: boolean,
    }>) => {
      const {name, isNegative} = action.payload
      const tag = {name, strength: 1}
      const tags = isNegative ? state.negativeTags : state.tags
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
      const tags = isNegative ? state.negativeTags : state.tags
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
      const tags = isNegative ? state.negativeTags : state.tags
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
      const tags = isNegative ? state.negativeTags : state.tags
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
      const tags = isNegative ? state.negativeTags : state.tags
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
      const tags = isNegative ? state.negativeTags : state.tags
      const tagIndex = tags.findIndex(tag => tag.name === name)
      if (tagIndex !== -1) {
        // subtract 10% from the strength
        const strength = tags[tagIndex].strength
        tags[tagIndex].strength -= strength * 0.1
      }
    },
  }
})

export const {
  newTag,
  removeTag,
  moveTag,
  setTagStrength,
  increaseTagStrength,
  decreaseTagStrength,
} = tagsSlice.actions

export const selectTags = (state: RootState) => state.tags.tags
export const selectNegativeTags = (state: RootState) => state.tags.negativeTags

export const tagsReducer = tagsSlice.reducer