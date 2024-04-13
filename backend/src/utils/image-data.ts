import axios from 'axios';
import { SD_URL } from '../constants';

interface ImageDataParameters {
  Prompt: string;
  Model: string;
  'Size-1': string;
  'Size-2': string;
  Steps: string;
  'CFG scale': string;
  Seed: string;
  Sampler: string;
}

interface ImageDataRawType {
  info: string;
  parameters: ImageDataParameters;
}

export async function fetchImageData(filePath: string): Promise<unknown> {
  // first get the base64 encoded image data
  const imageBase64 = await fetch(filePath)
  .then(response => response.arrayBuffer())
  .then(buffer => Buffer.from(buffer).toString('base64'));

  // then send it with axios to the '/sdapi/v1/png-info' endpoint
  const { parameters }: ImageDataRawType = await axios
  .post(`${SD_URL}/sdapi/v1/png-info`, { image: imageBase64 })
  .then(response => response.data);

  // then parse the data and return it
  return {
    prompt: parameters.Prompt,
    model: parameters.Model,
    width: Number(parameters['Size-1']),
    height: Number(parameters['Size-2']),
    steps: Number(parameters.Steps),
    cfg: Number(parameters['CFG scale']),
    seed: Number(parameters.Seed),
    samplingMethod: parameters.Sampler,
  };
}