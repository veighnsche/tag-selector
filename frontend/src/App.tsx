import React from 'react'
import { Provider } from 'react-redux'
import { DashboardLayout } from './components/dashboard'
import { SocketProvider } from './components/providers/SocketProvider'
import { store } from './store'

function App() {
  return (
    <SocketProvider>
      <Provider store={store}>
        <DashboardLayout/>
      </Provider>
    </SocketProvider>
  )
}

export default App
