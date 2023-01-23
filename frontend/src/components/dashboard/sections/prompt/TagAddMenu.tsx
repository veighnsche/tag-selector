import { SendOutlined } from '@mui/icons-material'
import { Box, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Popover } from '@mui/material'
import React, { ComponentProps, useEffect, useState } from 'react'
import { useAppDispatch } from '../../../../store'
import { newTags } from '../../../../store/reducers/tags'
import { PromptTagsType } from '../../../../types/image-input'

const formControlColorMap: Record<keyof PromptTagsType, ComponentProps<typeof FormControl>['color']> = {
  tags: 'primary',
  negativeTags: 'secondary',
  tagPool: 'primary',
}

interface TagAddMenuProps {
  isOpen: boolean
  handleClose: () => void
  anchorEl: HTMLElement | null
  location: keyof PromptTagsType
}

export const TagAddMenu = ({ isOpen, handleClose, anchorEl, location }: TagAddMenuProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [value, setValue] = useState<string>('')
  const dispatch = useAppDispatch()

  function handleAdd() {
    const tags = value.split(',').map((tag) => tag.trim())
    dispatch(newTags({ names: tags, location }))
    setValue('')
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
        handleClose()
      }}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Box width="40rem" p={1}>
        <FormControl
          variant="outlined"
          fullWidth
          size="small"
          color={formControlColorMap[location]}
        >
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
                handleClose()
              }
              if (e.key === 'Escape') {
                handleClose()
              }
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => {
                  handleAdd()
                  handleClose()
                }}>
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
