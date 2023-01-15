import styled from '@emotion/styled'
import {Paper} from '@mui/material'
import {H1} from '../styled/Headers'

const LayoutGrid = styled.main`
  height: 100vh;
  width: 100vw;
  
  display: grid;
  gap: 1rem;
  padding: 1rem;
  
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    'tags output'
    'options output';
`

const TagsArea = styled.section`
  grid-area: tags;
`

const OutputArea = styled.section`
  grid-area: output;
`

const OptionsArea = styled.section`
  grid-area: options;
`

const StyledPaper = styled(Paper)`
  padding: 0.75rem;
`


export const DashboardLayout = () => {
  return (
    <LayoutGrid>
      <TagsArea>
        <StyledPaper>
          <H1>Tags</H1>
        </StyledPaper>
      </TagsArea>
      <OutputArea>
        <StyledPaper>
          <H1>Output</H1>
        </StyledPaper>
      </OutputArea>
      <OptionsArea>
        <StyledPaper>
          <H1>Options</H1>
        </StyledPaper>
      </OptionsArea>
    </LayoutGrid>
  )
}
