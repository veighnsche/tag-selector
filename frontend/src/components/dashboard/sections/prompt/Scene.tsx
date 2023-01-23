import MenuIcon from '@mui/icons-material/Menu'
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'
import { ChangeEvent, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../store'
import { selectScene, setScene } from '../../../../store/reducers/inputs'
import { TagMenu } from './TagMenu'

export const Scene = () => {
  const scene = useAppSelector(selectScene)
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)
  const isMenuOpen = Boolean(menuAnchorEl)
  const dispatch = useAppDispatch()

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    dispatch(setScene(event.target.value))
  }

  function handleClose() {
    setMenuAnchorEl(null)
  }

  return (
    <>
      <FormControl>
        <InputLabel>Scene</InputLabel>
        <OutlinedInput
          label="Scene"
          value={scene}
          onChange={handleChange}
          startAdornment={
            <InputAdornment position="start">
              <IconButton size="small" onClick={(event) => setMenuAnchorEl(event.currentTarget)}>
                <MenuIcon fontSize="small"/>
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <TagMenu isMenuOpen={isMenuOpen} onClose={handleClose} menuAnchorEl={menuAnchorEl}/>
    </>
  )
}
