import { Button } from '@mui/material'
import { ComponentProps } from 'react'
import { PromptTagsType } from '../../../../types/image-input'

export const buttonColorMap: Record<keyof PromptTagsType, ComponentProps<typeof Button>['color']> = {
  tags: 'primary',
  negativeTags: 'secondary',
  tagPool: 'inherit',
}