import axios from 'axios';
import { SdModelType } from 'frontend/src/types/sd-models';
import { SdOptionsType } from 'frontend/src/types/sd-options';
import { SdSamplersType } from 'frontend/src/types/sd-samplers';
import { SdUpscalersType } from 'frontend/src/types/sd-upscalers';
import { SD_URL } from '../constants';

export function getModelOptions(): Promise<SdModelType[]> {
  return axios.post(`${SD_URL}/sdapi/v1/refresh-checkpoints`)
  .then(() => axios.get(`${SD_URL}/sdapi/v1/sd-models`))
  .then((response) => response.data);
}

export function getSamplingMethods(): Promise<SdSamplersType[]> {
  return axios.get(`${SD_URL}/sdapi/v1/samplers`)
  .then((response) => response.data);
}

export function getUpscalers(): Promise<SdUpscalersType[]> {
  return axios.get(`${SD_URL}/sdapi/v1/upscalers`)
  .then((response) => response.data);
}

export function getCurrentOptions(): Promise<SdOptionsType> {
  return axios.get(`${SD_URL}/sdapi/v1/options`)
  .then((response) => response.data);
}

export function setSdOptions(options: Partial<SdOptionsType>): Promise<number> {
  return axios.post(`${SD_URL}/sdapi/v1/options`, options)
  .then((response) => response.status);
}

interface EmbeddingResponse {
  loaded: Record<string, any>;
}

export function fetchEmbeddings(): Promise<string[]> {
  return axios.get(`${SD_URL}/sdapi/v1/refresh-embeddings`)
  .then(() => axios.get(`${SD_URL}/sdapi/v1/embeddings`))
  .then((response) => response.data)
  .then((response: EmbeddingResponse) => Object.keys(response.loaded));
}

interface HypernetworkResponse {
  name: string;
  path: string;
}

export function fetchHypernetworks(): Promise<string[]> {
  return axios.get(`${SD_URL}/sdapi/v1/hypernetworks`)
  .then((response) => response.data)
  .then((response: HypernetworkResponse[]) => response.map((item) => item.name));
}