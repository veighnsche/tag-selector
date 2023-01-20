import styled from '@emotion/styled'
import { Chip } from '@mui/material'

interface ImageTagsProps {
  tags?: string[]
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem;
`

export const ImageTags = ({ tags = [] }: ImageTagsProps) => {
  return (
      <TagContainer>
        {tags.map((tag) => (
          <Chip size="small" key={tag} label={tag} variant="outlined"/>
        ))}
      </TagContainer>
  )
}