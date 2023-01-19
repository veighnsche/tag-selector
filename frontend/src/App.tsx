import styled from '@emotion/styled'
import React from 'react'
import { DashboardLayout } from './components/dashboard'
import { OutputsLayout } from './components/outputs/layout'
import { ProgressBar } from './components/ProgressBar'
import { SdOptionsProvider } from './components/providers/SdOptionsProvider'
import { SocketProvider } from './components/providers/SocketProvider'

const Wrapper = styled.main`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  display: flex;
  padding: 1rem 0;
`

const MaxWidthWrapper = styled.div`
  width: 97vw;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

function App() {
  return (
    <SocketProvider>
      <SdOptionsProvider>
        <ProgressBar/>
        <Wrapper>
          <MaxWidthWrapper>
            <DashboardLayout/>
            <OutputsLayout/>
          </MaxWidthWrapper>
        </Wrapper>
      </SdOptionsProvider>
    </SocketProvider>
  )
}

export default App
