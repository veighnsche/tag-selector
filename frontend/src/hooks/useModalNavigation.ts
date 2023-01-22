import { useSocket } from '../components/providers/SocketProvider'
import { useAppDispatch, useAppSelector } from '../store'
import {
  nextModalImage,
  previousModalImage, selectImages,
  selectIsLastImage,
  selectModalImage,
  setModalImage,
} from '../store/reducers/images'
import { SocketEvent } from '../types'
import { extractFileIndex } from '../utils/files'
import { useEmitters } from './useEmitters'

export function useModalNavigation() {
  const images = useAppSelector(selectImages)
  const modalImage = useAppSelector(selectModalImage)
  const isLastImage = useAppSelector(selectIsLastImage)
  const dispatch = useAppDispatch()
  const emit = useEmitters()
  const socket = useSocket()

  function navigateFirst() {
    dispatch(setModalImage(images[0]))
  }

  function navigateNext() {
    if (!isLastImage) {
      dispatch(nextModalImage())
    }
    else if (modalImage) {
      socket.on(SocketEvent.FETCH_IMAGES_MODAL, ({ nextImage }: { nextImage: string }) => {
        if (nextImage) {
          dispatch(setModalImage(nextImage))
        }
        socket.off(SocketEvent.FETCH_IMAGES_MODAL)
      })
      // todo: toIndex should be the filename
      emit.fetchImagesModal({ amount: 10, toIndex: extractFileIndex(modalImage) })
    }
  }

  function navigatePrevious() {
    dispatch(previousModalImage())
  }

  return {
    navigateFirst,
    navigateNext,
    navigatePrevious,
  }
}