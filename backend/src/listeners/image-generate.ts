import axios, { AxiosError } from 'axios'
import { ImageInputsType, ImageOutputType } from 'frontend/src/types'
import { ImageGenerateParams } from 'frontend/src/types/image-generate-params'
import { SdProgressType } from 'frontend/src/types/sd-progress'
import { SD_URL } from '../constants'

export function imageGenerate({
  prompt: { scene, negativePrompt },
  options: { width, height, steps, cfg, seed, restoreFaces, samplingMethod },
}: ImageInputsType): Promise<ImageOutputType> {
  console.time('generateImage')

  const params: ImageGenerateParams = {
    prompt: scene,
    negative_prompt: negativePrompt,
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
  .catch((error: AxiosError) => {
    console.error('Error while generating image:', error)
    console.timeEnd('generateImage')
    throw error
  })
}

export function getProgress(): Promise<SdProgressType> {
  return axios.get(`${SD_URL}/sdapi/v1/progress`)
  .then(response => response.data)
}