import styled from '@emotion/styled'
import { Paper } from '@mui/material'
import { FetchImagesButton } from './FetchImagesButton'
import { ImageListDataWrapper } from './ImageListDataWrapper'
import { ImageList } from './ImageList'

const StyledPaper = styled(Paper)`
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const OutputsLayout = () => {
  return (
    <ImageListDataWrapper>
      <StyledPaper>
        <ImageList/>
        <FetchImagesButton/>
      </StyledPaper>
    </ImageListDataWrapper>
  )
}
