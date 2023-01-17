import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import {ImageOutputType} from 'shared'
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
    socket.on('generateImage', ({ data }: { data: ImageOutputType }) => {
      console.log(data)
      setGenerateImageData(data)
    })

    return () => {
      socket.off('generateImage')
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
