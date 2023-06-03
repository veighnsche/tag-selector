import styled from '@emotion/styled'
import { HighResFix } from './HighResFix'

const LayoutFlex = styled.div`
  width: 100%;
`

export const HighResFixLayout = () => {
  return (
    <LayoutFlex>
      <HighResFix />
    </LayoutFlex>
  )
}