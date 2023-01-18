import styled from '@emotion/styled'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { IconButton } from '@mui/material'
import { useAppSelector } from '../../store'
import { selectImages } from '../../store/reducers/images'
import { ImageDataWrapper } from './ImageDataWrapper'

const ImageListWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
`

const ImageContainer = styled.div`
  position: relative;

  &:hover button {
    opacity: 0.5;
  }
`

const StyledImage = styled.img`
  max-height: 32vh;

  display: block;
  backface-visibility: hidden;
`

const OverlayButton = styled(IconButton)`
  position: absolute;

  color: white;
  font-size: 1.5rem;
  opacity: 0;
  transition: opacity, color 0.2s ease-in-out;

  &:hover {
    opacity: 1;
  }
`

const DeleteButton = styled(OverlayButton)`
  top: 0;
  right: 0;

  &:hover {
    color: red;
  }
`

const FetchDataButton = styled(OverlayButton)`
  top: 0;
  left: 0;

  &:hover {
    color: blue;
  }
`

export const Images = () => {
  const images = useAppSelector(selectImages)
  const url = process.env.REACT_APP_SERVER_URL + '/outputs/'

  return (
    <ImageListWrapper>
      {images.map((image, index) => (
        <ImageDataWrapper key={image} filename={image} arrayIdx={index}>
          {({ setSeed, handleDelete }) => {
            return (
              <ImageContainer>
                <StyledImage src={url + image} alt={image}/>
                <DeleteButton onClick={() => {
                  handleDelete(index, image)
                }}>
                  <DeleteOutlinedIcon/>
                </DeleteButton>
                <FetchDataButton onClick={() =>
                  setSeed()
                }>
                  <FileUploadIcon/>
                </FetchDataButton>
              </ImageContainer>
            )
          }}
        </ImageDataWrapper>
      ))}
    </ImageListWrapper>
  )
}