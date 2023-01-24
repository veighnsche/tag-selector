import axios from 'axios'
import { ImageDataType } from 'frontend/src/types/image-data'
import { SD_URL } from '../constants'

interface ImageDataRawType {
  info: string
  items: {
    parameters: string
  }
}

export async function fetchImageData(filePath: string): Promise<unknown> {
  // first get the base64 encoded image data
  const imageBase64 = await fetch(filePath)
  .then(response => response.arrayBuffer())
  .then(buffer => Buffer.from(buffer).toString('base64'))

  // then send it with axios to the '/sdapi/v1/png-info' endpoint
  const imageDataRaw: ImageDataRawType = await axios
  .post(`${SD_URL}/sdapi/v1/png-info`, { image: imageBase64 })
  .then(response => response.data)

  // then parse the data and return it
  return parseRawImageData(imageDataRaw.items.parameters)
}

function parseRawImageData(raw: string): unknown {
  const lines = raw.split('\n')
  const prompt = lines[0]
  const { negativePrompt, options } = extractNegativePromptAndOptions(lines)
  const optionsArray = options.split(', ')
  const optionsObject = optionsArray.reduce((acc: Record<string, any>, option: string) => {
    const [encodedKey, encodedValue] = option.split(': ')
    const options = decodeOptions(encodedKey, encodedValue)
    return {
      ...acc,
      ...options,
    }
  }, {})

  return {
    prompt,
    negativePrompt,
    ...optionsObject,
  }
}

function extractNegativePromptAndOptions(lines: string[]): { negativePrompt?: string, options: any } {
  if (!lines[1]) {
    return {
      options: lines[0],
    }
  }
  if (lines[1]?.startsWith('Negative prompt:')) {
    const negativePrompt = lines[1].split('Negative prompt:')[1].trim()
    return {
      negativePrompt,
      options: lines[2],
    }
  }
  return {
    options: lines[1],
  }
}

function decodeOptions(encodedKey: string, encodedValue: string): Partial<ImageDataType> {
  const options = {
    [encodedKey]: {
      [encodedKey]: encodedValue,
    },
    Size: {
      width: Number(encodedValue.split('x')[0]),
      height: Number(encodedValue.split('x')[1]),
    },
    Seed: {
      seed: Number(encodedValue),
    },
    'CFG scale': {
      cfg: Number(encodedValue),
    },
    Sampler: {
      samplingMethod: encodedValue,
    },
    Steps: {
      steps: Number(encodedValue),
    },
    'Model hash': {
      modelHash: encodedValue,
    },
    Model: {
      model: encodedValue,
    },
  }

  return options[encodedKey]
}
