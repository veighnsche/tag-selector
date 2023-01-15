import {TextField} from '@mui/material'
import {ChangeEvent} from 'react'
import {useAppDispatch, useAppSelector} from '../../../../store'
import {selectScene, setScene} from '../../../../store/reducers/inputs'

export const PromptScene = () => {
  const scene = useAppSelector(selectScene)
  const dispatch = useAppDispatch()

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    dispatch(setScene(event.target.value))
  }

  return (
    <TextField label="Scene" value={scene} onChange={handleChange}/>
  )
}
