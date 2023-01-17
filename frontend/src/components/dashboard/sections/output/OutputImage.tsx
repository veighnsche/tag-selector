import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '../../../../store'
import { addImageToStart } from '../../../../store/reducers/images'
import { ImageOutputType, SocketEvent } from '../../../../types'
import { useSocket } from '../../../providers/SocketProvider'

const ImageWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

// stretch to fit parent
const StyledImage = styled.img`
  width: 100%;
  max-height: 80vh;
  object-fit: contain;
`

export const OutputImage = () => {
  const socket = useSocket()
  const [generateImageData, setGenerateImageData] = useState<ImageOutputType | null>(null)
  const dispatch = useAppDispatch()

  useEffect(() => {
    socket.on(SocketEvent.IMAGE_OUTPUT, ({ imageOutput }: { imageOutput: ImageOutputType }) => {
      setGenerateImageData(imageOutput)

      const prefixed = imageOutput.images.map((image) => `data:image/png;base64,${image}`)
      dispatch(addImageToStart(prefixed[0]))
    })

    return () => {
      socket.off(SocketEvent.IMAGE_OUTPUT)
    }
  })

  return (
    <ImageWrapper>
      {generateImageData?.images.map((image, index) => (
        <StyledImage
          key={index}
          src={`data:image/png;base64,${image}`}
          alt={generateImageData?.parameters.prompt}
        />
      ))}
    </ImageWrapper>
  )
}
