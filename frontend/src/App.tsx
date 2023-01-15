import React from 'react'
import {DashboardLayout} from './components/dashboard'
import {SocketProvider} from './components/providers/SocketProvider'

function App() {
  return (
    <SocketProvider>
      <DashboardLayout/>
    </SocketProvider>
  )
}

export default App
