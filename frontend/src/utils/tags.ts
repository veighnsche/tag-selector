import { TagType } from '../types'

function hasStrength(strength: number | undefined): strength is number {
  return strength !== 100 && !!strength
}

export function makeTagLabel(tag: TagType) {
  return `${tag.name}${hasStrength(tag.strength) ? `:${tag.strength / 100}` : ''}`
}

export function makeTagLabelWrapped(tag: TagType) {
  if (hasStrength(tag.strength)) {
    return `(${tag.name}:${tag.strength / 100})`
  }
  return tag.name
}