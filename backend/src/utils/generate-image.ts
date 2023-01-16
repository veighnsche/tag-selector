import axios, { AxiosError } from 'axios'
import { SD_URL } from '../constants'

export interface GenerateImageType {
  scene: string;
}

export function generateImage({ scene }: GenerateImageType) {
  console.log('Generating image for scene:', scene)
  console.time('generateImage')

  return axios.post(`${SD_URL}/sdapi/v1/txt2img`, {
    prompt: scene,
    steps: 20,
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