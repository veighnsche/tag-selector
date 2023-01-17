import styled from '@emotion/styled'
import { ImageOutputType } from '@shared/types/image-output'
import { SocketEvent } from '@shared/types/socket-event'
import { useEffect, useState } from 'react'
import { useSocket } from '../../../providers/SocketProvider'



const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
  height: 100%;
`

const StyledImage = styled.img`
  max-width: 100%;
  max-height: 100%;
`

export const OutputImage = () => {
  const socket = useSocket()
  const [generateImageData, setGenerateImageData] = useState<ImageOutputType | null>(null)

  useEffect(() => {
    socket.on(SocketEvent.IMAGE_OUTPUT, ({ data }: { data: ImageOutputType }) => {
      console.log(data)
      setGenerateImageData(data)
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
