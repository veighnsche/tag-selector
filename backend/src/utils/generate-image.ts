import axios, { AxiosError } from 'axios'
import { SD_URL } from '../constants'

export interface TagType {
  name: string
  strength: number
}

export interface InputsState {
  prompt: {
    scene: string,
    tags: TagType[],
    negativeTags: TagType[],
  }
  options: {
    width: number,
    height: number,
  }
}

export function generateImage({ prompt: { scene }, options: { width, height} }: InputsState) {
  console.log('Generating image for scene:', scene)
  console.time('generateImage')

  return axios.post(`${SD_URL}/sdapi/v1/txt2img`, {
    prompt: scene,
    steps: 20,
    width,
    height,
  })
  .then(response => {
    console.timeEnd('generateImage')
    return response.data
  })
  .catch((error: AxiosError) => {
    console.error('Error while generating image:', error)
    console.timeEnd('generateImage')
    throw error
  })
}