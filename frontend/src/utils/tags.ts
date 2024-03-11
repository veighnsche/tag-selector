import Decimal from 'decimal.js-light';
import { TagType } from '../types';
import { PromptTagsType } from '../types/image-input';

function hasStrength(strength: number | undefined): strength is number {
  return strength !== 100 && !!strength;
}

export function makeTagLabel(tag: TagType) {
  return `${tag.name}${hasStrength(tag.strength) ? `:${tag.strength / 100}` : ''}`;
}

export function makeTagLabelWrapped(tag: TagType) {
  if (hasStrength(tag.strength)) {
    return `(${tag.name}:${tag.strength / 100})`;
  }
  return tag.name;
}

function countAndRemoveParentheses(name: string): {
  nameWithoutParentheses: string;
  strength: number;
} {
  // remove parentheses on both sides
  let strength = new Decimal(100);
  let nameWithoutParentheses = '';
  for (let i = 0; i < name.length; i++) {
    if (name[i] === '(') {
      strength = strength.mul(1.1);
      continue;
    } else if (name[i] === ')') {
      continue;
    }
    nameWithoutParentheses += name[i];
  }
  return { nameWithoutParentheses, strength: strength.toNumber() };
}

export function getNameAndStrength(name: string): Omit<TagType, 'id'> {
  if (!name.startsWith('(') && name.endsWith(')')) {
    return { name };
  }
  if (name.includes(':')) {
    const unwrapped = name.slice(1, -1);
    const [nameWithoutStrength, strength] = unwrapped.split(':');
    return { name: nameWithoutStrength, strength: Number(strength) * 100 };
  }
  const { nameWithoutParentheses, strength } = countAndRemoveParentheses(name);
  return { name: nameWithoutParentheses, strength };
}

export function findTag(
  state: PromptTagsType,
  id: TagType['id']
): keyof PromptTagsType {
  const locations: Readonly<(keyof PromptTagsType)[]> = [
    'tags',
    'negativeTags',
    'tagPool',
  ] as const;
  for (const location of locations) {
    const index = state[location].findIndex((tag) => tag.id === id);
    if (index !== -1) {
      return location;
    }
  }
  throw new Error(`Tag ${id} not found`);
}
