import { ImageCustomData, ImageCustomDataType } from 'frontend/src/types/image-custom-data'
import fs from 'fs'
import { addMetadata, getMetadata } from 'meta-png'
import { getOutputsDir } from './image-crud'

export function addMetadataToImage(uri: string, data: ImageCustomDataType): Uint8Array {
  const buffer = Buffer.from(uri, 'base64')
  const uit8Array = new Uint8Array(buffer)

  return Object.entries(data).reduce((uit8Array, [key, value]) => {
    return addMetadata(uit8Array, key, JSON.stringify(value))
  }, uit8Array)
}

export function fetchMetaDataFromImage(filename: string): ImageCustomDataType {
  const outputsDir = getOutputsDir()
  const filepath = `${outputsDir}\\${filename}`
  const buffer = fs.readFileSync(filepath)
  const uit8Array = new Uint8Array(buffer)
  return Object.values(ImageCustomData).reduce((acc, key) => {
    const value = getMetadata(uit8Array, key)
    return {
      ...acc,
      [key]: value ? JSON.parse(value) : undefined,
    }
  }, {} as ImageCustomDataType)
}