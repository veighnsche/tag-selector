import axios, { AxiosError } from 'axios'
import {ImageInputsType, ImageOutputType} from 'shared'
import { SD_URL } from '../constants'

export function generateImage({
  prompt: { scene },
  options: { width, height}
}: ImageInputsType): Promise<ImageOutputType> {
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
