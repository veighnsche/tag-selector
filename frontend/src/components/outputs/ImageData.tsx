import styled from '@emotion/styled'
import { Box, Button, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useFetchImageData } from '../../hooks/useFetchImageData'
import { ImageDataType } from '../../types/image-data'

const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open: boolean
}>`
  width: ${(props) => (props.open ? '25vw' : '0vw')};
  height: 100%;
  transition: width 0.8s ease-in-out;
  overflow: hidden;
  transform: translateX(50%);
`

//  - not capitalized and align text to the left
const StyledButton = styled(Button)`
  text-transform: none;
`

interface ImageDataProps {
  filename: string
  open: boolean
}

export const ImageData = ({ filename, open }: ImageDataProps) => {
  const [imageData, setImageData] = useState<ImageDataType | null>(null)
  const fetchImageData = useFetchImageData()

  useEffect(() => {
    if (filename && open) {
      fetchImageData(filename).then((data) => {
        setImageData(data)
      })
    }
  }, [filename, open])

  return (
    <StyledPaper open={open}>
      {imageData ? (
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Box>
            <Typography variant="caption">Prompt</Typography>
            <StyledButton variant="outlined" size="small" fullWidth>
              {imageData.prompt}
            </StyledButton>
          </Box>

        </div>
      ) : null}
    </StyledPaper>
  )
}
