export function extractFileIndex(fileName: string): number {
  const indexString = fileName.split('-')[0]
  return Number(indexString)
}