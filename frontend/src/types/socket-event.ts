export enum SocketEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ERROR = 'error',

  SD_STATUS = 'sd-status',
  GENERATE_IMAGE = 'generate-image',
  IMAGE_OUTPUT = 'image-output',
  FETCH_IMAGES = 'fetch-images',
  FETCH_IMAGES_MODAL = 'fetch-images-modal',
  REMOVE_IMAGE = 'remove-image',
  FETCH_SD_MODELS = 'fetch-sd-models',
  FETCH_SD_OPTIONS = 'fetch-sd-options',
  SET_SD_OPTIONS = 'set-sd-options',
  FETCH_SAMPLERS = 'fetch-samplers',
  FETCH_IMAGE_DATA = 'fetch-image-data',
  PROGRESS = 'progress',
}
