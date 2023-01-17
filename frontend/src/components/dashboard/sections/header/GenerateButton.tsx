import { Button } from '@mui/material'
import React from 'react'

import { useGenerateImage } from '../../../../hooks/useGenerateImage'
import { useAppSelector } from '../../../../store'
import { selectSdStatus } from '../../../../store/reducers/sdStatus'
import { SdStatus } from '../../../../types'

export const GenerateButton = () => {
  const sdStatus = useAppSelector(selectSdStatus)
  const generateImage = useGenerateImage()

  function handleClick() {
    generateImage()
  }

  return (
    <Button
      variant="contained"
      onClick={handleClick}
      disabled={sdStatus === SdStatus.BUSY}
    >
      Generate one
    </Button>
  )
}
