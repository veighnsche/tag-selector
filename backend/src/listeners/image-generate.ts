import axios, { AxiosError } from 'axios'
import { ImageInputsType, ImageOutputType, TagType } from 'frontend/src/types'
import { ImageGenerateParams } from 'frontend/src/types/image-generate-params'
import { OptimizerTypes, PromptTagsType } from 'frontend/src/types/image-input'
import { SdProgressType } from 'frontend/src/types/sd-progress'
import { SD_URL } from '../constants'
import seedrandom from 'seedrandom';

function isTagNameSurroundedByCurlyBraces(tag: string) {
  return tag.startsWith('{') && tag.endsWith('}')
}

function selectTagNameBySeed(tag: string, rng: seedrandom.PRNG) {
  const tagNames = tag.slice(1, -1).split('|')
  const tagIndex = Math.floor(rng() * tagNames.length)
  return tagNames[tagIndex]
}

const tagToPrompt = (rng: seedrandom.PRNG) => (tag: TagType): string => {
  if (tag.muted) {
    return ''
  }

  if (tag.optimizer === OptimizerTypes.HYPERNETWORK) {
    const strength = tag.strength || 100
    return `<hypernet:${tag.name}:${strength / 100}>`
  }

  if (tag.optimizer === OptimizerTypes.LORA) {
    const strength = tag.strength || 100
    return `<lora:${tag.name}:${strength / 100}>`
  }

  if (tag.optimizer === OptimizerTypes.LYCORIS) {
    const strength = tag.strength || 100
    return `<lyco:${tag.name}:${strength / 100}>`
  }

  if (isTagNameSurroundedByCurlyBraces(tag.name)) {
    tag.name = selectTagNameBySeed(tag.name, rng)
  }

  if (tag.strength && tag.strength !== 100) {
    return `(${tag.name}:${tag.strength / 100})`
  }

  return tag.name
}

export const selectTagsForInputs = ({
  tags, negativeTags, scene, negativePrompt, seed,
}: {
  tags: TagType[]
  negativeTags: TagType[]
  scene: string
  negativePrompt: string
  seed: number
}) => {
  const rng = seedrandom(seed.toString())
  const seededTagToPrompt = tagToPrompt(rng)
  return ({
    prompt: [scene.trim(), ...tags.map(seededTagToPrompt)].filter(Boolean).join(', '),
    negative: [negativePrompt.trim(), ...negativeTags.map(seededTagToPrompt)].filter(Boolean).join(', '),
  })
}


export function imageGenerate({
  prompt: { scene, negativePrompt },
  options: { width, height, steps, cfg, seed, restoreFaces, samplingMethod },
}: ImageInputsType, {
  tags,
  negativeTags,
}: PromptTagsType): Promise<ImageOutputType> {
  console.time('generateImage')

  const { prompt, negative } = selectTagsForInputs({
    tags,
    negativeTags,
    scene,
    negativePrompt,
    seed,
  })

  const params: ImageGenerateParams = {
    prompt,
    negative_prompt: negative,
    steps,
    width,
    height,
    cfg_scale: cfg,
    seed,
    restore_faces: restoreFaces,
    sampler_index: samplingMethod,
  }

  return axios.post(`${SD_URL}/sdapi/v1/txt2img`, params)
  .then(response => {
    console.timeEnd('generateImage')
    return response.data
  })
  .then((imageOutput: ImageOutputType) => ({
    ...imageOutput,
    info: JSON.parse(imageOutput.info as unknown as string),
  }))
  .catch((error: AxiosError) => {
    console.timeEnd('generateImage')
    throw error
  })
}

export function getProgress(): Promise<SdProgressType> {
  return axios.get(`${SD_URL}/sdapi/v1/progress`)
  .then(response => response.data)
}

export function interruptImageGenerate(): Promise<void> {
  return axios.post(`${SD_URL}/sdapi/v1/interrupt`)
}

export function withSeedNumber(input: ImageInputsType): ImageInputsType {
  if (input.options.seed !== -1) {
    return input
  }

  return {
    ...input,
    options: {
      ...input.options,
      seed: Math.floor(Math.random() * 4294967295), // max seed number is 2^32 - 1
    },
  }
}