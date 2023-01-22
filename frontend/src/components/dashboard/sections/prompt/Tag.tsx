import { Chip } from '@mui/material'
import { ComponentProps, useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { useAppDispatch } from '../../../../store'
import { moveTagBetweenLocations } from '../../../../store/reducers/tags'
import { setIsDragging } from '../../../../store/reducers/tagsState'
import { PromptTagsType, TagType } from '../../../../types/image-input'
import { TagEditMenu } from './TagEditMenu'

const colorMap: Record<keyof PromptTagsType, ComponentProps<typeof Chip>['color']> = {
  tags: 'primary',
  negativeTags: 'secondary',
  tagPool: 'default',
}

interface TagsProps {
  location: keyof PromptTagsType
  tag: TagType
  arrayIdx: number
}

export const Tag = ({ location, tag, arrayIdx }: TagsProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const label = tag.name + (tag.strength === 100 || !tag.strength ? '' : `:${tag.strength / 100}`)
  const dispatch = useAppDispatch()
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const isMenuOpen = Boolean(menuAnchorEl)

  // if a tag is dragged over another tag, it will be moved to the index of the tag it is dragged over
  const [, drop] = useDrop({
    accept: 'tag',
    drop: (item: { id: string }) => {
      dispatch(moveTagBetweenLocations({
        id: item.id,
        to: location,
        position: arrayIdx,
      }))
      dispatch(setIsDragging(false))
    },
  })

  const [, drag] = useDrag({
    type: 'tag',
    item: () => ({ id: tag.id }),
  })

  drag(drop(ref))

  return (
    <>
      <Chip
        ref={ref}
        key={tag.name}
        label={label}
        color={tag.muted ? 'default' : colorMap[location]}
        sx={{ opacity: tag.muted ? 0.5 : 1 }}
        variant="outlined"
        onDragStart={() => {
          dispatch(setIsDragging(true))
        }}
        onDragEnd={() => {
          dispatch(setIsDragging(false))
        }}
        onClick={(e) => {
          setMenuAnchorEl(e.currentTarget)
        }}
        onContextMenu={(e) => {
          e.preventDefault()
        }}
      />
      <TagEditMenu
        isOpen={isMenuOpen}
        handleClose={() => setMenuAnchorEl(null)}
        anchorEl={menuAnchorEl}
        tag={tag}
      />
    </>
  )
}