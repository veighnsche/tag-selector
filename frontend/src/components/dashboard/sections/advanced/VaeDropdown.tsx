import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React from 'react'
import { useEffectOnce } from '../../../../hooks/useEffectOnce'
import { useEmitters } from '../../../../hooks/useEmitters'
import { useAppSelector } from '../../../../store'
import { selectCurrentVae } from '../../../../store/reducers/sdOptions'
import { SocketEvent } from '../../../../types'
import { useSocket } from '../../../providers/SocketProvider'

export const VaeDropdown = () => {
  const [vaes, setVaes] = React.useState<string[]>([])
  const currentVae = useAppSelector(selectCurrentVae)
  const emit = useEmitters()
  const socket = useSocket()

  const selectableVaes = ['Automatic', 'None', ...vaes]

  useEffectOnce(() => {
    emit.fetchVaes()

    socket.on(SocketEvent.FETCH_VAES, ({ vaes }: { vaes: string[] }) => {
      setVaes(vaes)
      socket.off(SocketEvent.FETCH_VAES)
    })

    return () => {
      socket.off(SocketEvent.FETCH_VAES)
    }
  })

  function setVae(vae: string) {
    emit.setSdOptions({ sd_vae: vae })
  }

  return (
    <FormControl fullWidth>
      <InputLabel size="small">VAE</InputLabel>
      <Select
        label="VAE"
        size="small"
        value={currentVae}
        onChange={(e: SelectChangeEvent) => {
          setVae(e.target.value as string)
        }}
      >
        {selectableVaes.map((vae) => (
          <MenuItem key={vae} value={vae}>
            {vae}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}