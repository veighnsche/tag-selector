import axios from 'axios'
import { SdModelType } from 'frontend/src/types/sd-models'
import { SdOptionsType } from 'frontend/src/types/sd-options'
import { SdSamplersType } from 'frontend/src/types/sd-samplers'
import { SD_URL } from '../constants'

export function getModelOptions(): Promise<SdModelType[]> {
  return axios.get(`${SD_URL}/sdapi/v1/sd-models`)
  .then((response) => response.data)
}

export function getSamplingMethods(): Promise<SdSamplersType[]> {
  return axios.get(`${SD_URL}/sdapi/v1/samplers`)
  .then((response) => response.data)
}

export function getCurrentOptions(): Promise<SdOptionsType> {
  return axios.get(`${SD_URL}/sdapi/v1/options`)
  .then((response) => response.data)
}

export async function setSdOptions(options: Partial<SdOptionsType>): Promise<number> {
  return axios.post(`${SD_URL}/sdapi/v1/options`, options)
    .then((response) => response.status)
}