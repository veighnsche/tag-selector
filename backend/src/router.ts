import {Server, Socket} from 'socket.io'
import {appInfoRequest} from './listeners/app-info'

enum SocketEvent {
  AppInfoRequest = 'appInfoRequest',
  AppInfoResponse = 'appInfoResponse'
}

export function socketRouter(socket: Socket, io: Server) {
  socket.on(SocketEvent.AppInfoRequest, appInfoRequest(SocketEvent.AppInfoResponse, socket))
}
