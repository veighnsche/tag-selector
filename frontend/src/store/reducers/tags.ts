import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'
import { ImageInputsType, PromptTagsType, TagType } from '../../types/image-input'
import { RootState } from '../index'

const initialState: PromptTagsType = {
  tags: [],
  negativeTags: [],
  tagPool: [],
}

function findTag(state: PromptTagsType, id: TagType['id']): keyof PromptTagsType {
  const locations: Readonly<(keyof PromptTagsType)[]> = ['tags', 'negativeTags', 'tagPool'] as const
  for (const location of locations) {
    const index = state[location].findIndex((tag) => tag.id === id)
    if (index !== -1) {
      return location
    }
  }
  throw new Error(`Tag ${id} not found`)
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
      state[location].push({ name, strength: 1, id: uuid() })
    },
    newTags: (state, action: PayloadAction<{
      names: TagType['name'][],
      location: keyof PromptTagsType,
    }>) => {
      const { names, location } = action.payload
      state[location].push(...names.map(name => ({ name, strength: 1, id: uuid() })))
    },
    moveTagBetweenLocations: (state, action: PayloadAction<{
      id: TagType['id'],
      to: keyof PromptTagsType,
      position?: number,
    }>) => {
      const { id, to, position } = action.payload
      const from = findTag(state, id)
      const tag = state[from].find(tag => tag.id === id)
      if (tag) {
        state[from] = state[from].filter(tag => tag.id !== id)
        if (position !== undefined) {
          state[to].splice(position, 0, tag)
        }
        else {
          state[to].push(tag)
        }
      }
    },
    removeTag: (state, action: PayloadAction<{
      id: TagType['id'],
    }>) => {
      const { id } = action.payload
      const location = findTag(state, id)
      state[location] = state[location].filter(tag => tag.id !== id)
    },
    setTagStrength: (state, action: PayloadAction<{
      id: TagType['id'],
      location: keyof PromptTagsType,
      strength: number,
    }>) => {
      const { id, location, strength } = action.payload
      const tags = state[location]
      const tagIndex = tags.findIndex(tag => tag.id === id)
      if (tagIndex !== -1) {
        tags[tagIndex].strength = strength
      }
    },
    increaseTagStrength: (state, action: PayloadAction<{
      id: TagType['id'],
      location: keyof PromptTagsType,
    }>) => {
      const { id, location } = action.payload
      const tags = state[location]
      const tagIndex = tags.findIndex(tag => tag.id === id)
      if (tagIndex !== -1) {
        // add 10% to the strength
        const strength = tags[tagIndex].strength
        tags[tagIndex].strength += strength * 0.1
      }
    },
    decreaseTagStrength: (state, action: PayloadAction<{
      id: TagType['id'],
      location: keyof PromptTagsType,
    }>) => {
      const { id, location } = action.payload
      const tags = state[location]
      const tagIndex = tags.findIndex(tag => tag.id === id)
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
  newTags,
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

export const selectGetId = (state: RootState) =>
  (name: TagType['name']): TagType['id'] | undefined => {
    const { tags, negativeTags, tagPool } = state.tags
    const tag = [...tags, ...negativeTags, ...tagPool].find(tag => tag.name === name)
    return tag?.id
  }

export const selectTagsForInputs = (state: RootState) =>
  (inputs: ImageInputsType): ImageInputsType => {
    const { tags, negativeTags } = state.tags
    const { prompt: { negativePrompt, scene } } = inputs
    return {
      ...inputs,
      prompt: {
        scene: [scene.trim(), ...tags.map(tag => tag.name)].filter(Boolean).join(', '),
        negativePrompt: [negativePrompt.trim(), ...negativeTags.map(tag => tag.name)].filter(Boolean).join(', '),
      },
    }
  }

export const tagsReducer = tagsSlice.reducer