import styled from '@emotion/styled'
import { Button } from '@mui/material'
import React from 'react'

import { useGenerateImage } from '../../../../hooks/useGenerateImage'
import { useAppSelector } from '../../../../store'
import { selectEtaRelative, selectSdStatus } from '../../../../store/reducers/sdStatus'
import { SdStatus } from '../../../../types'

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'busy',
})<{
  busy: boolean
}>`
  width: 10rem;
  text-transform: ${({ busy }) => busy ? 'none' : 'uppercase'};
`

export const GenerateButton = () => {
  const sdStatus = useAppSelector(selectSdStatus)
  const generateImage = useGenerateImage()
  const eta = useAppSelector(selectEtaRelative)

  function handleClick() {
    generateImage()
  }

  return (
    <StyledButton
      busy={eta !== null}
      variant="contained"
      onClick={handleClick}
      disabled={sdStatus === SdStatus.BUSY}
    >
      {eta !== null ? `${eta}` : 'Generate one'}
    </StyledButton>
  )
}
