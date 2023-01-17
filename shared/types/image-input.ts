export interface TagType {
  name: string
  strength: number
}

export interface ImageInputsType {
  prompt: {
    scene: string,
    tags: TagType[],
    negativeTags: TagType[],
  }
  options: {
    width: number,
    height: number,
  }
}
