import { Socket } from 'socket.io'

interface AppInfoType {
  name: string;
  description: string;
  version: string
}

export function appInfoRequest(emitEvent: string, socket: Socket) {
  return () => {
    // Retrieve the app information
    const appInfo: AppInfoType = {
      name: 'Tag Selector backend',
      version: '0.0.0',
      description: 'Backend for the Tag Selector app'
    }

    // Send the app information to the client
    socket.emit(emitEvent, appInfo)
  }
}
