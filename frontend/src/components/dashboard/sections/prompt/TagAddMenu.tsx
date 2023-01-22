import { SendOutlined } from '@mui/icons-material'
import { Box, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Popover } from '@mui/material'
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
    <Popover
      open={isOpen}
      onClose={() => {
        handleAdd()
        handleClose()
      }}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
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
              if (e.key === 'Escape') {
                handleClose()
              }
              if (e.key === 'c') {
                e.preventDefault()
                setValue(value + 'c')
              }
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton edge="end" onClick={handleAdd}>
                  <SendOutlined/>
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>
    </Popover>
  )
}