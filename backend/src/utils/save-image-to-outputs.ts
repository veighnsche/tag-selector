import {ImageOutputType} from 'frontend/src/types'
import fs from 'fs'
import path from 'path'
import {promisify} from 'util'

function nameImage(index: number, imageOutput: ImageOutputType): string {
  // give the index 5 digits
  const indexString = index.toString().padStart(5, '0')
  // max 50 characters for the prompt
  const prompt = imageOutput.parameters.prompt.substring(0, 50)

  return `${indexString}-${prompt}.png`
}

async function getNextIndex(outputsDir: string) {
  // check in the folder what the next index should be
  // the index is decided by sorting the .png files in the folder
  // filter if parsing filename results in NaN
  // the file with the highest index will be the last file
  // the next index will be the last index + 1
  // if there are no .png files, the index is 0
  const files = await promisify(fs.readdir)(outputsDir)
  const sortedPngFiles = files
    .filter((file) => file.endsWith('.png') && !isNaN(Number(file.split('-')[0])))
    .sort((a, b) => {
      const aIndex = parseInt(a.split('-')[0])
      const bIndex = parseInt(b.split('-')[0])
      return aIndex - bIndex
    })
  return sortedPngFiles.length > 0
    ? parseInt(sortedPngFiles[sortedPngFiles.length - 1].split('-')[0]) + 1
    : 0
}

export async function SaveImageToOutputs(imageOutput: ImageOutputType): Promise<void> {
  // convert the base64 images to PNG files and save it to the root outputs folder
  // images are stored in an array

  // get root directory, current file is in root\backend\src\utils\save-image-to-outputs.ts
  const rootDir = path.resolve(__dirname, '..', '..', '..')

  // create the outputs folder if it doesn't exist
  const outputsDir = path.join(rootDir, 'outputs')

  if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir)
  }

  const nextIndex = await getNextIndex(outputsDir)

  // convert the base64 images to PNG files and save it to the root outputs folder
  // images are stored in an array
  const imagePromises = imageOutput.images.map((image, index) => {
    const imageBuffer = Buffer.from(image, 'base64')
    const imageFileName = nameImage(nextIndex + index, imageOutput)
    const imageFilePath = path.join(outputsDir, imageFileName)

    return promisify(fs.writeFile)(
      imageFilePath,
      imageBuffer,
      'base64',
    )
  })

  await Promise.all(imagePromises)

  // save the image inputs to a JSON file

}
