import styled from '@emotion/styled'
import { Paper } from '@mui/material'
import React from 'react'
import { HeaderLayout } from './sections/header/layout'
import { OptionsLayout } from './sections/options/layout'
import { OutputLayout } from './sections/output/layout'
import { PromptLayout } from './sections/prompt/layout'

const LayoutGrid = styled.main`
  width: 100%;
  
  display: grid;
  gap: 1rem;

  grid-template-columns: 1fr 1fr;
  grid-template-rows: min-content 1fr 1fr;
  grid-template-areas:
    'header header'
    'prompt output'
    'options output';
`

const HeaderArea = styled.header`
  grid-area: header;
`

const PromptArea = styled.section`
  grid-area: prompt;
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
      <HeaderArea>
        <StyledPaper>
          <HeaderLayout/>
        </StyledPaper>
      </HeaderArea>
      <PromptArea>
        <StyledPaper>
          <PromptLayout/>
        </StyledPaper>
      </PromptArea>
      <OutputArea>
        <StyledPaper>
          <OutputLayout/>
        </StyledPaper>
      </OutputArea>
      <OptionsArea>
        <StyledPaper>
          <OptionsLayout/>
        </StyledPaper>
      </OptionsArea>
    </LayoutGrid>
  )
}
