import { ReactNode, useEffect } from 'react'
import { useEffectOnce } from '../../hooks/useEffectOnce'
import { useEmitters } from '../../hooks/useEmitters'
import { useAppDispatch, useAppSelector } from '../../store'
import { addImagesToEnd, selectImages } from '../../store/reducers/images'
import { SocketEvent } from '../../types'
import { GetImagesPathsType } from '../../types/image-output'
import { useSocket } from '../providers/SocketProvider'

interface OutputsContainerProps {
  children: ReactNode;
}

export const ImageListDataWrapper = ({ children }: OutputsContainerProps) => {
  const socket = useSocket()
  const dispatch = useAppDispatch()
  const images = useAppSelector(selectImages)
  const emit = useEmitters()

  useEffectOnce(() => {
    if (images.length === 0) {
      const params: GetImagesPathsType = {
        amount: 15,
      }

      emit.fetchImages(params)
    }
  })

  useEffect(() => {
    socket.on(SocketEvent.FETCH_IMAGES, ({ images }: { images: string[] }) => {
      dispatch(addImagesToEnd(images))
    })

    return () => {
      socket.off(SocketEvent.FETCH_IMAGES)
    }
  }, [])

  return <>{children}</>
}
