import { ReactNode, useState } from 'react'
import { useEmitters } from '../../hooks/useEmitters'
import { useAppDispatch } from '../../store'
import { removeImage, setModalImage } from '../../store/reducers/images'
import { setSeed } from '../../store/reducers/inputs'
import { SocketEvent } from '../../types'
import { ImageDataType } from '../../types/image-data'
import { extractFileIndex, prefixWithImageUrl } from '../../utils/files'
import { useSocket } from '../providers/SocketProvider'

interface ImageWrapperProps {
  children: (props: ImageWrapperChildrenProps) => ReactNode
  filename: string
  arrayIdx: number
}

interface ImageWrapperChildrenProps {
  setSeed: () => void
  handleDelete: (index: number, filename: string) => void
  openModal: () => void
}

export const ImageDataWrapper = ({ children, filename, arrayIdx }: ImageWrapperProps) => {
  const [data, setData] = useState<ImageDataType | null>(null)
  const socket = useSocket()
  const dispatch = useAppDispatch()
  const emit = useEmitters()
  const fileIndex = extractFileIndex(filename)

  function fetchData(): Promise<ImageDataType> {
    if (data) {
      return Promise.resolve(data)
    }

    return new Promise(resolve => {
      socket.on(
        `${SocketEvent.FETCH_IMAGE_DATA}-${fileIndex}`,
        ({ imageData }: { imageData: ImageDataType }) => {
          socket.off(`${SocketEvent.FETCH_IMAGE_DATA}-${fileIndex}`)
          setData(imageData)
          resolve(imageData)
        },
      )

      emit.fetchImageData({
        fileName: filename,
        fileIndex,
        filePath: prefixWithImageUrl(filename),
      })
    })
  }

  function handleDelete() {
    dispatch(removeImage(arrayIdx))
    emit.removeImage(filename)
  }

  async function setSeedFromImage() {
    const data = await fetchData()
    dispatch(setSeed(data.seed))
  }

  function openModal() {
    dispatch(setModalImage(filename))
  }

  return (
    <>
      {children({
        setSeed: setSeedFromImage,
        handleDelete,
        openModal,
      })}
    </>
  )
}
