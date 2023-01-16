import styled from '@emotion/styled'
import React from 'react'
import { H1 } from '../../../styled/Headers'
import { HeaderButtonsRight } from './HeaderButtonsRight'

const LayoutFlex = styled.div`
  width: 100%;
  
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
`

const FlexAuto = styled.div`
  flex: 1;
`

export const HeaderLayout = () => {
  return (
    <LayoutFlex>
      <H1>Tag Selector</H1>
      <FlexAuto/>
      <HeaderButtonsRight/>
    </LayoutFlex>
  )
}
