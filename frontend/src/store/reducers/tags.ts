import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PromptTagsType, TagType } from '../../types/image-input'
import { RootState } from '../index'

const initialState: PromptTagsType = {
  tags: [],
  negativeTags: [],
  tagPool: [],
}

export const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    newTag: (state, action: PayloadAction<{
      name: TagType['name'],
      location: keyof PromptTagsType,
    }>) => {
      const { name, location } = action.payload
      const tags = state[location]
      const tag = { name, strength: 1 }
      const tagIndex = tags.findIndex(tag => tag.name === name)
      if (tagIndex === -1) {
        tags.push(tag)
      }
    },
    removeTag: (state, action: PayloadAction<{
      name: TagType['name'],
      location: keyof PromptTagsType,
    }>) => {
      const { name, location } = action.payload
      const tags = state[location]
      const tagIndex = tags.findIndex(tag => tag.name === name)
      if (tagIndex !== -1) {
        tags.splice(tagIndex, 1)
      }
    },
    moveTagInLocation: (state, action: PayloadAction<{
      name: TagType['name'],
      location: keyof PromptTagsType,
      position: number,
    }>) => {
      const { name, location, position } = action.payload
      const tags = state[location]
      const tagIndex = tags.findIndex(tag => tag.name === name)
      if (tagIndex !== -1) {
        const tag = tags.splice(tagIndex, 1)[0]
        tags.splice(position, 0, tag)
      }
    },
    moveTagBetweenLocations: (state, action: PayloadAction<{
      name: TagType['name'],
      fromLocation: keyof PromptTagsType,
      toLocation: keyof PromptTagsType,
      position: number,
    }>) => {
      const { name, fromLocation, toLocation, position } = action.payload
      const fromTags = state[fromLocation]
      const toTags = state[toLocation]
      const tagIndex = fromTags.findIndex(tag => tag.name === name)
      if (tagIndex !== -1) {
        const tag = fromTags.splice(tagIndex, 1)[0]
        toTags.splice(position, 0, tag)
      }
    },
    setTagStrength: (state, action: PayloadAction<{
      name: TagType['name'],
      location: keyof PromptTagsType,
      strength: number,
    }>) => {
      const { name, location, strength } = action.payload
      const tags = state[location]
      const tagIndex = tags.findIndex(tag => tag.name === name)
      if (tagIndex !== -1) {
        tags[tagIndex].strength = strength
      }
    },
    increaseTagStrength: (state, action: PayloadAction<{
      name: TagType['name'],
      location: keyof PromptTagsType,
    }>) => {
      const { name, location } = action.payload
      const tags = state[location]
      const tagIndex = tags.findIndex(tag => tag.name === name)
      if (tagIndex !== -1) {
        // add 10% to the strength
        const strength = tags[tagIndex].strength
        tags[tagIndex].strength += strength * 0.1
      }
    },
    decreaseTagStrength: (state, action: PayloadAction<{
      name: TagType['name'],
      location: keyof PromptTagsType,
    }>) => {
      const { name, location } = action.payload
      const tags = state[location]
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
  moveTagInLocation,
  moveTagBetweenLocations,
  setTagStrength,
  increaseTagStrength,
  decreaseTagStrength,
} = tagsSlice.actions

export const selectTags = (state: RootState) => state.tags.tags
export const selectNegativeTags = (state: RootState) => state.tags.negativeTags

export const tagsReducer = tagsSlice.reducer