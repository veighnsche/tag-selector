import { Chip } from '@mui/material'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { moveTagBetweenLocations, newTag, selectGetId, selectLocateTagByName } from '../../store/reducers/tags'
import { TagType } from '../../types'
import { makeTagLabel } from '../../utils/tags'
import { ClipRetrievalPopover } from '../clipRetrieval/ClipRetrievalPopover'

export const ImageTag = ({ tag }: { tag: TagType }) => {
  const { name, muted } = tag
  const locateTag = useAppSelector(selectLocateTagByName)
  const getId = useAppSelector(selectGetId)
  const dispatch = useAppDispatch()
  const [clipAnchorEl, setClipAnchorEl] = useState<HTMLElement | null>(null)
  const isClipOpen = Boolean(clipAnchorEl)
  const label = makeTagLabel(tag)
  const {
    isTags,
    isNegativeTags,
    isTagPool,
    found,
  } = locateTag(name)


  function handleLeftClick() {
    if (!found) {
      dispatch(newTag({ name, location: 'tagPool' }))
      return
    }
    dispatch(moveTagBetweenLocations({
      id: getId(name) as string,
      to: isTagPool ? 'tags' : isTags ? 'negativeTags' : 'tagPool',
    }))
  }

  return (
    <>
      <Chip
        size="small"
        key={name}
        label={label}
        variant={found ? 'filled' : 'outlined'}
        color={isTags ? 'primary' : isNegativeTags ? 'secondary' : 'default'}
        onClick={handleLeftClick}
        onContextMenu={(e) => {
          e.preventDefault()
          setClipAnchorEl(e.currentTarget)
        }}
        sx={{ opacity: muted ? 0.5 : 1 }}
      />
      <ClipRetrievalPopover
        anchorEl={clipAnchorEl}
        handleClose={() => setClipAnchorEl(null)}
        isOpen={isClipOpen}
        prompt={name}
      />
    </>
  )
}