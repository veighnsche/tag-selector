import { SendOutlined } from '@mui/icons-material'
import { Box, FormControl, IconButton, InputAdornment, InputLabel, Menu, OutlinedInput } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../../../store'
import { newTags } from '../../../../store/reducers/tags'

interface TagAddMenuProps {
  isOpen: boolean
  handleClose: () => void
  anchorEl: HTMLElement | null
}

export const TagAddMenu = ({ isOpen, handleClose, anchorEl }: TagAddMenuProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [value, setValue] = useState<string>('')
  const dispatch = useAppDispatch()

  function handleAdd() {
    const tags = value.split(',').map((tag) => tag.trim())
    dispatch(newTags({ names: tags, location: 'tagPool' }))
    setValue('')
    handleClose()
  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }, [isOpen])

  return (
    <Menu open={isOpen} onClose={handleClose} anchorEl={anchorEl}>
      <Box width="40rem" p={1}>
        <FormControl variant="outlined" fullWidth size="small">
          <InputLabel>Comma separated</InputLabel>
          <OutlinedInput
            inputRef={inputRef}
            label="Comma separated"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAdd()
              }
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton edge="end" onClick={handleAdd}>
                  <SendOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>
    </Menu>
  )
}