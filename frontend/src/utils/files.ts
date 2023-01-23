export function extractFileIndex(fileName: string): number {
  const indexString = fileName.split('-')[0]
  return Number(indexString)
}

export function prefixWithImageUrl(fileName: string): string {
  return `${process.env.REACT_APP_SERVER_URL}/outputs/${fileName}`
}

export function extractImageSize(fileName: string): { width: number; height: number } {
  const sizeString = fileName.split('-')[1]
  const [width, height] = sizeString.split('x').map(Number)
  return {
    width,
    height,
  }
}