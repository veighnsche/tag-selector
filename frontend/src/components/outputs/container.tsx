import { ReactNode, useEffect } from 'react'
import { useEffectOnce } from '../../hooks/useEffectOnce'
import { useAppDispatch, useAppSelector } from '../../store'
import { addImagesToEnd, selectImages } from '../../store/reducers/images'
import { SocketEvent } from '../../types'
import { GetImagesPathsType } from '../../types/image-output'
import { useSocket } from '../providers/SocketProvider'

interface OutputsContainerProps {
  children: ReactNode;
}

export const OutputsContainer = ({ children }: OutputsContainerProps) => {
  const socket = useSocket()
  const dispatch = useAppDispatch()
  const images = useAppSelector(selectImages)

  useEffectOnce(() => {
    if (images.length === 0) {
      const params: GetImagesPathsType = {
        amount: 15,
      }

      socket.emit(SocketEvent.FETCH_IMAGES, params)
    }
  })

  useEffect(() => {
    socket.on(SocketEvent.FETCH_IMAGES, ({ images }: { images: string[] }) => {
      const url = process.env.REACT_APP_SERVER_URL + '/outputs/'
      dispatch(addImagesToEnd(images.map((image) => url + image)))
    })

    return () => {
      socket.off(SocketEvent.FETCH_IMAGES)
    }
  }, [])

  return <>{children}</>
}