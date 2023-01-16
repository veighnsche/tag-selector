import axios, { AxiosError } from 'axios'
import { Socket } from 'socket.io'

interface RequestType {
  scene: string;
}

export function generateImage(emitEvent: string, socket: Socket) {
  return ({scene}: RequestType) => {
    console.log('Generating image for scene:', scene)
    console.time('generateImage')

    axios.post('http://127.0.0.1:7860/api/v1/generate', {
      prompt: scene,
      steps: 20
    })
      .then(response => {
        console.timeEnd('generateImage')
        socket.emit(emitEvent, response.data)
      })
      .catch((error: AxiosError) => {
        console.error("Error while generating image:", error)
        console.timeEnd('generateImage')
      })

  }
}
