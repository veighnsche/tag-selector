import { Chip } from '@mui/material'
import { ComponentProps, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { useAppDispatch } from '../../../../store'
import { moveTagBetweenLocations } from '../../../../store/reducers/tags'
import { PromptTagsType, TagType } from '../../../../types/image-input'

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
  const label = tag.name + (tag.strength === 1 ? '' : `:${tag.strength}`)
  const dispatch = useAppDispatch()

  // if a tag is dragged over another tag, it will be moved to the index of the tag it is dragged over
  const [, drop] = useDrop({
    accept: 'tag',
    drop: (item: { name: string }) => {
      dispatch(moveTagBetweenLocations({
        name: item.name,
        to: location,
        position: arrayIdx,
      }))
    },
  })

  const [, drag] = useDrag({
    type: 'tag',
    item: () => ({ name: tag.name }),
  })

  drag(drop(ref))

  return (
    <Chip
      ref={ref}
      key={tag.name}
      label={label}
      color={colorMap[location]}
      variant="outlined"
      onContextMenu={(e) => {
        e.preventDefault()
        console.log('right click')
      }}
    />
  )
}