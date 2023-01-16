import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { useSocket } from '../../../providers/SocketProvider'

interface GenerateImageData {
  images: string[]
  parameters: {
    prompt: string
  }
}

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
  height: 100%;
`

export const OutputImage = () => {
  const { socket } = useSocket()
  const [generateImageData, setGenerateImageData] = useState<GenerateImageData | null>(null)

  useEffect(() => {
    socket.on('generateImage', ({ data }: { data: GenerateImageData }) => {
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
        <img
          key={index}
          src={`data:image/png;base64,${image}`}
          alt={generateImageData?.parameters.prompt}
        />
      ))}
    </ImageWrapper>
  )
}
