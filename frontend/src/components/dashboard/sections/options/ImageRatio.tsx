import styled from '@emotion/styled'
import { Button, Paper } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../../store'
import { selectRatio, setRatio } from '../../../../store/reducers/inputs'

const StyledPaper = styled(Paper)`
  padding: 0.75rem;
  width: 100%;

  display: flex;
  justify-content: space-between;
  gap: 1rem;
`

const RatioButton = styled(Button)`
  width: 100%;
  height: 4rem;
`

enum ImageRatios {
  '341:768' = '341:768',
  '512:512' = '512:512',
  '768:341' = '768:341',
  '512:768' = '512:768',
  '768:768' = '627:627',
  '768:512' = '768:512',
}

export const ImageRatio = () => {
  const dispatch = useAppDispatch()
  const { width: selectedWidth, height: selectedHeight } = useAppSelector(selectRatio)
  const selectedRatio = `${selectedWidth}:${selectedHeight}` as ImageRatios

  return (
    <StyledPaper elevation={3}>
      {Object.values(ImageRatios).map((ratio) => {
        const [width, height] = ratio.split(':')
        .map((value) => parseInt(value, 10))

        const handleClick = () => {
          dispatch(setRatio({ width, height }))
        }

        return (
          <RatioButton
            key={ratio}
            variant="outlined"
            onClick={handleClick}
          >
            <Paper
              elevation={6}
              sx={{
                width: width / 20,
                height: height / 20,
                backgroundColor: ratio === selectedRatio
                  ? 'secondary.main'
                  : 'primary.main',
              }}
            />
          </RatioButton>
        )
      })}
    </StyledPaper>
  )
}