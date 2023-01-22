import styled from '@emotion/styled'
import { ImageTag } from './ImageTag'

interface ImageTagsProps {
  tags?: string[]
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 0.25rem;
  padding: 0.5rem;
`

export const ImageTagList = ({ tags = [] }: ImageTagsProps) => {
  return (
    <TagContainer>
      {tags.map((tag) => (
        <ImageTag tag={tag} key={tag}/>
      ))}
    </TagContainer>
  )
}