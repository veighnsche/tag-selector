import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'
import { OptimizerTypes, PromptTagsType, TagType } from '../../types/image-input'
import { findTag, getNameAndStrength } from '../../utils/tags'
import { RootState } from '../index'

export const initialPromptTagsState: PromptTagsType = {
  tags: [],
  negativeTags: [],
  tagPool: [],
}

interface FindOptimizerTagParams {
  state: PromptTagsType
  name: TagType['name']
  type: OptimizerTypes
}

function findOptimizerTag({ state, name, type }: FindOptimizerTagParams): (keyof PromptTagsType) | null {
  const locations: Readonly<(keyof PromptTagsType)[]> = ['tags', 'negativeTags', 'tagPool'] as const
  for (const location of locations) {
    const index = state[location].findIndex((tag) => tag.name === name && tag.optimizer === type)
    if (index !== -1) {
      return location
    }
  }
  return null
}

export const tagsSlice = createSlice({
  name: 'tags',
  initialState: initialPromptTagsState,
  reducers: {
    newTag: (state, action: PayloadAction<{
      name: TagType['name'],
      location: keyof PromptTagsType,
    }>) => {
      const { name, location } = action.payload
      state[location].push({ name, id: uuid() })
    },
    newTags: (state, action: PayloadAction<{
      names: TagType['name'][],
      location: keyof PromptTagsType,
      hidden?: boolean,
    }>) => {
      const { names, location } = action.payload
      const filtered = names.filter(Boolean)
      if (filtered.length === 0) return
      state[location].push(...filtered.map(name => ({
        ...getNameAndStrength(name),
        id: uuid(),
        hidden: action.payload.hidden,
      })))
    },
    toggleOptimizerTag: (state, action: PayloadAction<{
      name: TagType['name'],
      type: OptimizerTypes,
    }>) => {
      // check if tag already exists in tags
      const { name, type } = action.payload
      const location = findOptimizerTag({ state, name, type })
      if (location) {
        // remove tag from location
        state[location] = state[location].filter(tag => tag.name !== name || tag.optimizer !== type)
      }
      else {
        // add tag to tags at start
        state.tags.unshift({ name, id: uuid(), optimizer: type })
      }
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
    editTag: (state, action: PayloadAction<{
      id: TagType['id'],
      name: TagType['name'],
    }>) => {
      const { id, name } = action.payload
      const location = findTag(state, id)
      const tagIndex = state[location].findIndex(tag => tag.id === id)
      if (tagIndex !== -1) {
        const { name: newName, strength } = getNameAndStrength(name)
        state[location][tagIndex].name = newName
        state[location][tagIndex].strength = strength
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
        const strength = tags[tagIndex].strength
        if (strength === undefined) {
          tags[tagIndex].strength = 110
        } else {
          tags[tagIndex].strength! += 10
        }
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
        // subtract 0.1 from the strength
        const strength = tags[tagIndex].strength
        if (strength === undefined) {
          tags[tagIndex].strength = 90
        } else {
          tags[tagIndex].strength! -= 10
        }
      }
    },
    toggleMuteTag: (state, action: PayloadAction<{
      id: TagType['id'],
      location: keyof PromptTagsType,
    }>) => {
      const { id, location } = action.payload
      const tags = state[location]
      const tagIndex = tags.findIndex(tag => tag.id === id)
      if (tagIndex !== -1) {
        tags[tagIndex].muted = !tags[tagIndex].muted
      }
    },
    toggleHideTag: (state, action: PayloadAction<{
      id: TagType['id'],
      location: keyof PromptTagsType,
    }>) => {
      const { id, location } = action.payload
      const tags = state[location]
      const tagIndex = tags.findIndex(tag => tag.id === id)
      if (tagIndex !== -1) {
        tags[tagIndex].hidden = !tags[tagIndex].hidden
      }
    },
    setTagsFromImageData: (state, action: PayloadAction<Partial<PromptTagsType>>) => {
      const { tags, negativeTags, tagPool } = action.payload
      if (tags) state.tags = tags
      if (negativeTags) state.negativeTags = negativeTags
      if (tagPool) state.tagPool = tagPool
    },
    resetTags: (state) => {
      Object.assign(state, initialPromptTagsState)
    }
  }
})

export const {
  newTag,
  newTags,
  moveTagBetweenLocations,
  removeTag,
  editTag,
  increaseTagStrength,
  decreaseTagStrength,
  toggleMuteTag,
  toggleHideTag,
  setTagsFromImageData,
  resetTags,
  toggleOptimizerTag,
} = tagsSlice.actions

export const selectAllTags = (state: RootState) => state.tags
export const selectTags = (state: RootState) => state.tags.tags
export const selectNegativeTags = (state: RootState) => state.tags.negativeTags
export const selectTagPool = (state: RootState) => state.tags.tagPool
export const selectLocateTagByName = (state: RootState) =>
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

export const selectLocateTag = (state: RootState) =>
  (id: TagType['id']): keyof PromptTagsType => findTag(state.tags, id)

export const selectGetId = (state: RootState) =>
  (name: TagType['name']): TagType['id'] | undefined => {
    const { tags, negativeTags, tagPool } = state.tags
    const tag = [...tags, ...negativeTags, ...tagPool].find(tag => tag.name === name)
    return tag?.id
  }

export const selectHasOptimizerTag = (state: RootState) =>
  ({ name, type }: { name: TagType['name'], type: OptimizerTypes }): boolean => {
    const { tags, negativeTags, tagPool } = state.tags
    return [...tags, ...negativeTags, ...tagPool].some(tag => tag.name === name && tag.optimizer === type)
  }

export const tagsReducer = tagsSlice.reducer
