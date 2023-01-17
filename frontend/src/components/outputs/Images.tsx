import styled from '@emotion/styled'
import { useAppSelector } from '../../store'
import { selectImages } from '../../store/reducers/images'

const ImagesWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
`

const StyledImage = styled.img`
  max-height: 32vh;
`


export const Images = () => {
  const images = useAppSelector(selectImages)
  return (
    <ImagesWrapper>
      {images.map((image, index) => (
        <StyledImage key={index} src={image}/>
      ))}
    </ImagesWrapper>
  )
}