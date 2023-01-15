import styled from '@emotion/styled'
import {OutputImage} from './OutputImage'

const LayoutFlex = styled.div`
  width: 100%;
  
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const OutputLayout = () => {
  return (
    <LayoutFlex>
      <OutputImage/>
    </LayoutFlex>
  )
}
