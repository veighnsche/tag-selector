import { ButtonGroup } from '@mui/material'
import { GenerateButton } from './GenerateButton'
import { PlayButton } from './PlayButton'
import { StopOrSkipButton } from './StopOfSkipButton'

export const HeaderButtonsRight = () => {
  return (
    <ButtonGroup>
      <PlayButton />
      <StopOrSkipButton />
      <GenerateButton/>
    </ButtonGroup>
  )
}
