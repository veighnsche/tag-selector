import styled from '@emotion/styled'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { useAppDispatch, useAppSelector } from '../../store'
import { removeImage, selectImages } from '../../store/reducers/images'
import { SocketEvent } from '../../types'
import { useSocket } from '../providers/SocketProvider'

const ImagesWrapper = styled.div`
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

const DeleteButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: white;
  font-size: 1.5rem;
  padding: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 1;
    color: red;
  }
`

export const Images = () => {
  const socket = useSocket()
  const dispatch = useAppDispatch()
  const images = useAppSelector(selectImages)
  const url = process.env.REACT_APP_SERVER_URL + '/outputs/'

  function handleDelete(index: number, image: string) {
    dispatch(removeImage(index))
    socket.emit(SocketEvent.REMOVE_IMAGE, { fileName: image })
  }

  return (
    <ImagesWrapper>
      {images.map((image, index) => {
        const fileIndex = Number(image.split('-')[0])
        return (
          <ImageContainer key={fileIndex}>
            <StyledImage src={url + image} alt={image}/>
            <DeleteButton onClick={() => handleDelete(index, image)}>
              <DeleteOutlinedIcon/>
            </DeleteButton>
          </ImageContainer>
        )
      })}
    </ImagesWrapper>
  )
}