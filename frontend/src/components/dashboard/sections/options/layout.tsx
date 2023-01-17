import styled from '@emotion/styled'
import { ImageRatio } from './ImageRatio'

const LayoutFlex = styled.div`
  width: 100%;
  
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:'image-ratio sliders';
  gap: 1rem;
`

const ImageRatioArea = styled(ImageRatio)`
  grid-area: image-ratio;
`

const SlidersArea = styled.div`
  grid-area: sliders;
`

export const OptionsLayout = () => {
  return (
    <LayoutFlex>
      <ImageRatioArea />
      <SlidersArea />
    </LayoutFlex>
  )
}