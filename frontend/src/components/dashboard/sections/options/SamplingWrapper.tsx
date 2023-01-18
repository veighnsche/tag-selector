import { ReactNode, useEffect, useState } from 'react'
import { useEffectOnce } from '../../../../hooks/useEffectOnce'
import { useEmitters } from '../../../../hooks/useEmitters'
import { useAppDispatch } from '../../../../store'
import { setSamplingMethod } from '../../../../store/reducers/inputs'
import { SocketEvent } from '../../../../types'
import { SdSamplersType } from '../../../../types/sd-samplers'
import { useSocket } from '../../../providers/SocketProvider'
import { Loading } from './Loading'

interface SamplingWrapperProps {
  children: (props: SamplingWrapperChildrenProps) => ReactNode;
}

interface SamplingWrapperChildrenProps {
  samplers: SdSamplersType[];
  setSampler: (sampling: string) => void;
}

export const SamplingWrapper = ({ children }: SamplingWrapperProps) => {
  const socket = useSocket()
  const [samplers, setSamplers] = useState<SdSamplersType[]>([])
  const [loading, setLoading] = useState(samplers.length === 0)
  const emit = useEmitters()
  const dispatch = useAppDispatch()

  useEffectOnce(() => {
    if (samplers.length === 0) {
      emit.fetchSamplingMethods()
    }
  })

  useEffect(() => {
    socket.on(SocketEvent.FETCH_SAMPLERS, ({ samplers }: { samplers: SdSamplersType[] }) => {
      setSamplers(samplers)
      setLoading(false)
    })

    return () => {
      socket.off(SocketEvent.FETCH_SAMPLERS)
    }
  }, [])

  const setSampler = (sampling: string) => {
    dispatch(setSamplingMethod(sampling))
  }

  if (loading) {
    return <Loading subject={'sampling methods'} />
  }

  return (
    <>
      {children({ samplers, setSampler })}
    </>
  )
}