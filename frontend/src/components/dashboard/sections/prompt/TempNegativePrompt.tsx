import { TextField } from '@mui/material'
import { ChangeEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../store'
import { selectNegativePrompt, setNegativePrompt } from '../../../../store/reducers/inputs'

export const TempNegativePrompt = () => {
  const negativePrompt = useAppSelector(selectNegativePrompt)
  const dispatch = useAppDispatch()

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    dispatch(setNegativePrompt(event.target.value))
  }

  return (
    <TextField label="Negative prompt" value={negativePrompt} onChange={handleChange}/>
  )
}
