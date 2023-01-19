import { ButtonGroup } from '@mui/material'
import { GenerateButton } from './GenerateButton'
import { PlayButton } from './PlayButton'

export const HeaderButtonsRight = () => {
  return (
    <ButtonGroup>
      <PlayButton />
      <GenerateButton/>
    </ButtonGroup>
  )
}
