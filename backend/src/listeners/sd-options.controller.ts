import { AxiosError } from 'axios'
import { SdOptionsType } from 'frontend/src/types/sd-options'
import { SdStatus } from 'frontend/src/types/sd-status'
import { SocketEvent } from 'frontend/src/types/socket-event'
import { Socket } from 'socket.io'
import { fetchLoras, fetchLycoris, fetchVaes } from './api-helper'
import {
  fetchEmbeddings,
  fetchHypernetworks,
  getCurrentOptions,
  getModelOptions,
  getSamplingMethods,
  setSdOptions,
} from './sd-options'

export function fetchSdModelsController(socket: Socket) {
  return () => {
    getModelOptions()
    .then(models => {
      socket.emit(SocketEvent.FETCH_SD_MODELS, { models })
    })
    .catch((error: AxiosError) => {
      socket.emit(SocketEvent.ERROR, { error })
    })
  }
}

export function fetchSamplingMethodsController(socket: Socket) {
  return () => {
    getSamplingMethods()
    .then(samplers => {
      socket.emit(SocketEvent.FETCH_SAMPLERS, { samplers })
    })
    .catch((error: AxiosError) => {
      socket.emit(SocketEvent.ERROR, { error })
    })
  }
}

export function fetchOptionsController(socket: Socket) {
  return () => {
    getCurrentOptions()
    .then(options => {
      socket.emit(SocketEvent.FETCH_SD_OPTIONS, { options })
    })
    .catch((error: AxiosError) => {
      socket.emit(SocketEvent.ERROR, { error })
    })
  }
}

export function setOptionsController(socket: Socket) {
  return async ({ options }: { options: Partial<SdOptionsType> }) => {
    socket.emit(SocketEvent.SD_STATUS, SdStatus.BUSY)
    const status = await setSdOptions(options)
      .catch((error: AxiosError) => {
        socket.emit(SocketEvent.SD_STATUS, SdStatus.ERROR)
        socket.emit(SocketEvent.ERROR, { error })
      })

    if (status !== 200) {
      socket.emit(SocketEvent.SD_STATUS, SdStatus.ERROR)
      socket.emit(SocketEvent.ERROR, { error: 'Error setting options', options })
    }

    socket.emit(SocketEvent.SD_STATUS, SdStatus.READY)

    const newOptions = await getCurrentOptions()
    .catch((error: AxiosError) => {
      socket.emit(SocketEvent.ERROR, { error })
    })

    socket.emit(SocketEvent.FETCH_SD_OPTIONS, { options: newOptions })
  }
}

export function fetchOptimizersController(socket: Socket) {
  return async () => {
    const [embeddings, hypernetworks, loras, lycoris] = await Promise.all([
      fetchEmbeddings()
      .catch((error: AxiosError) => {
        socket.emit(SocketEvent.ERROR, { error })
        return []
      }),
      fetchHypernetworks()
      .catch((error: AxiosError) => {
        socket.emit(SocketEvent.ERROR, { error })
        return []
      }),
      fetchLoras()
      .catch((error: AxiosError) => {
        socket.emit(SocketEvent.ERROR, { error })
        return []
      }),
      fetchLycoris()
      .catch((error: AxiosError) => {
        socket.emit(SocketEvent.ERROR, { error })
        return []
      }),
    ])

    socket.emit(SocketEvent.FETCH_OPTIMIZERS, { embeddings, hypernetworks, loras, lycoris })
  }
}

export function fetchVeasController(socket: Socket) {
  return async () => {
    const vaes = await fetchVaes()
    .catch((error: AxiosError) => {
      socket.emit(SocketEvent.ERROR, { error })
    })

    socket.emit(SocketEvent.FETCH_VAES, { vaes })
  }
}