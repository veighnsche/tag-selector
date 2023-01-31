import { MutableRefObject } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { DragSourceHookSpec, DropTargetHookSpec } from 'react-dnd/src/hooks/types'
import { useAppDispatch } from '../store'
import { moveTagBetweenLocations } from '../store/reducers/tags'
import { setIsDragging } from '../store/reducers/tagsState'
import { PromptTagsType, TagType } from '../types/image-input'

interface UseTagDnDParams {
  location: keyof PromptTagsType
  arrayIdx: number
  tag: TagType
  collect?: {
    drop?: DropTargetHookSpec<TagType, void, void>['collect']
    drag?: DragSourceHookSpec<TagType, void, void>['collect']
  }
}

export type UseTagDnDReturn = [
  {
    collect: {
      drop: void
      drag: void
    }
  },
  (ref: MutableRefObject<HTMLDivElement | null>) => void
]

export function useTagDnD({ location, arrayIdx, tag, collect }: UseTagDnDParams): UseTagDnDReturn {
  const dispatch = useAppDispatch()

  const [collectedDropItems, drop] = useDrop({
    accept: 'tag',
    drop: (item: { id: string }) => {
      dispatch(moveTagBetweenLocations({
        id: item.id,
        to: location,
        position: arrayIdx,
      }))
      dispatch(setIsDragging(false))
    },
    collect: collect?.drop,
  })

  const [collectedDragItems, drag] = useDrag({
    type: 'tag',
    item: () => ({ id: tag.id }),
    collect: collect?.drag,
  })

  return [
    {
      collect: {
        drop: collectedDropItems,
        drag: collectedDragItems,
      },
    },
    (ref: MutableRefObject<HTMLDivElement | null>) => {
      drag(drop(ref))

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
    },
  ]
}