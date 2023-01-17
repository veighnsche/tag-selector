import {ImageOutputType} from 'shared'
import fs from 'fs'
import path from 'path'
import {promisify} from 'util'


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

  // convert the base64 images to PNG files and save it to the root outputs folder
  // images are stored in an array
  const imagePromises = imageOutput.images.map((image, index) => {
    const imageBuffer = Buffer.from(image, 'base64')
    const imageFileName = `image-${index}.png`
    const imageFilePath = path.join(outputsDir, imageFileName)

    return promisify(fs.writeFile)(
      imageFilePath,
      imageBuffer,
      'base64'
    )
  })

  await Promise.all(imagePromises)

  // save the image inputs to a JSON file

}
