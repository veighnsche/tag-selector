import styled from '@emotion/styled'
import { PromptScene } from './PromptScene'

const LayoutFlex = styled.div`
  width: 100%;
  height: 100%;
  
  display: flex;
  flex-direction: column;
  gap: 1rem;
`


export const PromptLayout = () => {
  return (
    <LayoutFlex>
      <PromptScene/>
    </LayoutFlex>
  )
}
