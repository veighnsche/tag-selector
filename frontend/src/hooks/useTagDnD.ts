import { useEffect, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { useAppDispatch } from '../store'
import { moveTagBetweenLocations } from '../store/reducers/tags'
import { setIsDragging } from '../store/reducers/tagsState'
import { PromptTagsType, TagType } from '../types/image-input'

interface UseTagDnDParams {
  location: keyof PromptTagsType
  arrayIdx: number
  tag: TagType
}

export function useTagDnD({ location, arrayIdx, tag }: UseTagDnDParams) {
  const ref = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (ref.current) {
      ref.current.ondragstart = () => {
        dispatch(setIsDragging(true))
      }
      ref.current.ondragend = () => {
        dispatch(setIsDragging(false))
      }

      return () => {
        if (ref.current) {
          ref.current.ondragstart = null
          ref.current.ondragend = null
        }
      }
    }
  }, [ref.current])

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

  return ref
}