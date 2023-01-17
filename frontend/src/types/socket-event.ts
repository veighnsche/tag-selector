export enum SocketEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ERROR = 'error',

  SD_STATUS = 'sd-status',
  GENERATE_IMAGE = 'generate-image',
  IMAGE_OUTPUT = 'image-output',
  FETCH_IMAGES = 'fetch-images',
  REMOVE_IMAGE = 'remove-image',
}
