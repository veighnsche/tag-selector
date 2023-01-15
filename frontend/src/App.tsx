import React, {useEffect} from 'react'
import socketio from 'socket.io-client'

const socket = socketio('http://localhost:5000')

function App() {
  const [connected, setConnected] = React.useState(false)
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to socket.io server')
      setConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from socket.io server')
      setConnected(false)
    })

    socket.on('message', (message) => {
      console.log('Received message from socket.io server', message)

    })
  }, [])

  return (
    <div>
      <h1>Socket.io Client</h1>
      <p>Connected: {connected ? 'Yes' : 'No'}</p>
      <button onClick={() => {
        socket.emit('message', 'Hello from the client!')
        console.log('Sent message to socket.io server')
      }}>test</button>
    </div>
  )
}

export default App
