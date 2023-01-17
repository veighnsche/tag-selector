import styled from '@emotion/styled'
import { Paper } from '@mui/material'
import { OutputsContainer } from './container'
import { FetchImagesButton } from './FetchImagesButton'
import { Images } from './Images'

const StyledPaper = styled(Paper)`
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const OutputsLayout = () => {
  return (
    <OutputsContainer>
      <StyledPaper>
        <Images/>
        <FetchImagesButton/>
      </StyledPaper>
    </OutputsContainer>
  )
}