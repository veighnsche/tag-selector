import styled from '@emotion/styled'
import { useAppSelector } from '../store'
import { selectProgress } from '../store/reducers/sdStatus'


const StyledProgress = styled.progress`
  width: 97vw;
  height: 4px;
  position: fixed;
  z-index: 100;
  margin: 0 1rem;
  border: none;
  transform: translateX(0.25%);
`

export function ProgressBar() {
  const progress = useAppSelector(selectProgress)
  return <StyledProgress value={progress} max="1"/>
}