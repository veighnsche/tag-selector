import styled from '@emotion/styled'
import { ImageRatio } from './ImageRatio'

const LayoutFlex = styled.div`
  width: 100%;
  
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const OptionsLayout = () => {
  return (
    <LayoutFlex>
      <ImageRatio />
    </LayoutFlex>
  )
}