import styled from '@emotion/styled'
import DeleteIcon from '@mui/icons-material/Delete'
import { Button, Paper } from '@mui/material'
import { useRef } from 'react'
import { useDrop } from 'react-dnd'
import { useAppDispatch, useAppSelector } from '../../../../store'
import { removeTag } from '../../../../store/reducers/tags'
import { selectIsDragging, setIsDragging } from '../../../../store/reducers/tagsState'

const BinAnimation = styled.div<{
  open: boolean
}>`
  max-height: ${({ open }) => (open ? '52.5px' : '0px')};
  transition: max-height 0.2s ease-in-out;
  overflow: hidden;
`

export const TagBin = () => {
  const dropRef = useRef<HTMLDivElement>(null)
  const isDragging = useAppSelector(selectIsDragging)
  const dispatch = useAppDispatch()

  const [{ isOver }, drop] = useDrop({
    accept: 'tag',
    drop: (item: { id: string }, monitor) => {
      const didDrop = monitor.didDrop()
      if (didDrop) {
        return
      }
      dispatch(removeTag({ id: item.id }))
      dispatch(setIsDragging(false))
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  drop(dropRef)

  return (
    <BinAnimation open={isDragging} ref={dropRef}>
      <Paper square sx={{ p: '0.5rem' }} elevation={isOver ? 4 : 2}>
        <Button fullWidth variant={isOver ? 'contained' : 'outlined'} color="error" startIcon={<DeleteIcon/>}>
          Remove Tag
        </Button>
      </Paper>
    </BinAnimation>
  )
}