import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ImageInputsType, PromptTagsType, TagType } from '../../types/image-input'
import { RootState } from '../index'

const initialState: PromptTagsType = {
  tags: ['face', 'shoulders', 'arms', 'legs', 'feet', 'hair', 'clothes', 'background'].map((tag) => ({
    name: tag,
    strength: 1,
  })),
  negativeTags: ['car', 'building', 'tree', 'sky', 'water', 'ground'].map((tag) => ({
    name: tag,
    strength: 1,
  })),
  tagPool: [],
}

function findTag(state: PromptTagsType, name: TagType['name']): keyof PromptTagsType {
  const locations = ['tags', 'negativeTags', 'tagPool'] as const
  for (const location of locations) {
    const index = state[location].findIndex((tag) => tag.name === name)
    if (index !== -1) {
      return location
    }
  }
  throw new Error(`Tag ${name} not found`)
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
    moveTagBetweenLocations: (state, action: PayloadAction<{
      name: TagType['name'],
      to: keyof PromptTagsType,
      position?: number,
    }>) => {
      const { name, to, position } = action.payload
      const fromTags = state[findTag(state, name)]
      const toTags = state[to]
      const tagIndex = fromTags.findIndex(tag => tag.name === name)
      if (tagIndex !== -1) {
        const tag = fromTags.splice(tagIndex, 1)[0]
        if (position === undefined) {
          toTags.push(tag)
        }
        else {
          toTags.splice(position, 0, tag)
        }
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
  moveTagBetweenLocations,
  removeTag,
  setTagStrength,
  increaseTagStrength,
  decreaseTagStrength,
} = tagsSlice.actions

export const selectTags = (state: RootState) => state.tags.tags
export const selectNegativeTags = (state: RootState) => state.tags.negativeTags
export const selectTagPool = (state: RootState) => state.tags.tagPool
export const selectLocateTag = (state: RootState) =>
  (name: TagType['name']): Record<`is${Capitalize<keyof PromptTagsType>}`, boolean> & { found: boolean } => {
    const { tags, negativeTags, tagPool } = state.tags
    const isTags = tags.some(tag => tag.name === name)
    const isNegativeTags = negativeTags.some(tag => tag.name === name)
    const isTagPool = tagPool.some(tag => tag.name === name)
    return {
      isTags,
      isNegativeTags,
      isTagPool,
      found: isTags || isNegativeTags || isTagPool,
    }
  }

export const selectTagsForInputs = (state: RootState) =>
  (inputs: ImageInputsType): ImageInputsType => {
    const { tags, negativeTags } = state.tags
    const { prompt: { negativePrompt, scene } } = inputs
    return {
      ...inputs,
      prompt: {
        scene: [scene.trim(), ...tags.map(tag => tag.name)].join(', '),
        negativePrompt: [negativePrompt.trim(), ...negativeTags.map(tag => tag.name)].join(', '),
      },
    }
  }

export const tagsReducer = tagsSlice.reducer