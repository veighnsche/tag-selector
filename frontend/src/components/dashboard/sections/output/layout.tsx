import styled from '@emotion/styled'
import { OutputImage } from './OutputImage'

const LayoutFlex = styled.div`
  width: 100%;
  height: 80vh;
  
  display: flex;
  flex-direction: column;
`

export const OutputLayout = () => {
  return (
    <LayoutFlex>
      <OutputImage/>
    </LayoutFlex>
  )
}
