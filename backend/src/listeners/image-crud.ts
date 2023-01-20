import { ImageOutputType } from 'frontend/src/types'
import { GetImagesPathsType } from 'frontend/src/types/image-output'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

interface ValidFile {
  index: number
  fileName: string
}

/**
 * Extracts the index from a list of file names.
 * @param {string[]} files - An array of file names in the format "00000-promptText.png"
 * @return {number[]} - An array of indexes extracted from the file names.
 */
function filterValidFiles(files: string[]): ValidFile[] {
  return files
  .map((file) => {
    const indexString = file.split('-')[0]
    const index = Number(indexString)
    if (isNaN(index)) {
      return false
    }

    return {
      index,
      fileName: file,
    }
  })
  .filter(Boolean) as ValidFile[]
}

/**
 * Finds the next index for a file by reading the directory and extracting the indexes from the existing file names.
 */
export async function getNextIndex(): Promise<number> {
  const outputsDir = getOutputsDir()
  const files = await getFiles(outputsDir)
  if (files.length === 0) {
    return 0
  }

  return Math.max(...files.map(file => file.index)) + 1
}

/**
 * Gets the output directory for storing generated files.
 * @return {string} - The path of the output directory.
 */
export function getOutputsDir(): string {
  // get root directory, current file is in root\backend\src\utils\save-image-to-outputs.ts
  const rootDir = path.resolve(__dirname, '..', '..', '..')
  // create the outputs folder if it doesn't exist
  const outputsDir = path.join(rootDir, 'outputs')

  if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir)
  }

  return outputsDir
}

/**
 * Generates a file name for an image based on its index and prompt.
 * @param {number} index - The index of the image.
 * @param {ImageOutputType} imageOutput - An object containing information about the image.
 * @return {string} - The generated file name in the format: "00000-promptText.png" (5 digits for index and max 50 characters for the prompt)
 */
function nameImage(index: number, imageOutput: ImageOutputType): string {
  // give the index 5 digits
  const indexString = index.toString().padStart(5, '0')
  // max 50 characters for the prompt
  const prompt = imageOutput.parameters.prompt.substring(0, 50)
  // replace all non-alphanumeric characters with underscores
  const promptString = prompt.replace(/[^a-zA-Z0-9]/g, '_')
  // only one underscore in a row
  const promptStringClean = promptString.replace(/_+/g, '_').trim()

  return `${indexString}-${imageOutput.info.seed}-${promptStringClean}.png`
}

async function getFiles(dir: string): Promise<ValidFile[]> {
  const files = await promisify(fs.readdir)(dir)
  return filterValidFiles(files)
}

interface SaveImageParams {
  buffer: Buffer
  index: number
  imageOutput: ImageOutputType
}

export async function saveImage({ buffer, index, imageOutput }: SaveImageParams): Promise<string> {
  const outputsDir = getOutputsDir()
  const filename = nameImage(index, imageOutput)
  const filepath = path.join(outputsDir, filename)

  await promisify(fs.writeFile)(
    filepath,
    buffer,
    'base64',
  )

  return filename
}

export async function getImagesPaths({ toIndex = Infinity, amount = Infinity }: GetImagesPathsType = {}): Promise<string[]> {
  const outputsDir = getOutputsDir();
  const files = await getFiles(outputsDir);
  // sort files by index in descending order
  files.sort((a, b) => b.index - a.index);
  // filter files by toIndex and slice to amount
  const filteredFiles = files.filter(file => file.index < toIndex).slice(0, amount);
  // return the file names
  return filteredFiles.map(file => file.fileName);
}

export async function removeImage(fileName: string): Promise<void> {
  const outputsDir = getOutputsDir();
  const filePath = path.join(outputsDir, fileName);
  await promisify(fs.unlink)(filePath);
}