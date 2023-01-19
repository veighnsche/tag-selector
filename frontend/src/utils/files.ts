export function extractFileIndex(fileName: string): number {
  const indexString = fileName.split('-')[0]
  return Number(indexString)
}

export function prefixWithImageUrl(fileName: string): string {
  return `${process.env.REACT_APP_SERVER_URL}/outputs/${fileName}`
}
