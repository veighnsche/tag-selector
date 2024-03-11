import axios from 'axios';
import { SD_URL } from '../constants';

interface ImageDataParameters {
  Prompt: string;
  Model: string;
  'Size-1': number;
  'Size-2': number;
  Steps: number;
  'CFG scale': number;
  Seed: number;
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
  const imageDataRaw: ImageDataRawType = await axios
  .post(`${SD_URL}/sdapi/v1/png-info`, { image: imageBase64 })
  .then(response => response.data);

  // then parse the data and return it
  return {
    model: imageDataRaw.parameters.Model,
    width: imageDataRaw.parameters['Size-1'],
    height: imageDataRaw.parameters['Size-2'],
    steps: imageDataRaw.parameters.Steps,
    cfg: imageDataRaw.parameters['CFG scale'],
    seed: imageDataRaw.parameters.Seed,
    samplingMethod: imageDataRaw.parameters.Sampler,
  };
}