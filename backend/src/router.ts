import {Server, Socket} from 'socket.io'
import {appInfoRequest} from './listeners/app-info'
import {generateImage} from './listeners/generate-image'

enum SocketEvent {
  AppInfoRequest = 'appInfoRequest',
  AppInfoResponse = 'appInfoResponse',
  GenerateImageRequest = 'generateImageRequest',
  GenerateImageResponse = 'generateImageResponse',
}

export function socketRouter(socket: Socket, io: Server) {
  socket.on(SocketEvent.AppInfoRequest, appInfoRequest(SocketEvent.AppInfoResponse, socket))
  socket.on(SocketEvent.GenerateImageRequest, generateImage(SocketEvent.GenerateImageResponse, socket))
}
