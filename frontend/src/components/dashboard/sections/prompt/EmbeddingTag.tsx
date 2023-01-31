import { Chip } from '@mui/material'
import { useRef } from 'react'
import { useTagDnD } from '../../../../hooks/useTagDnD'
import { OptimizerTagProps } from './OptimizerTag'

export const EmbeddingTagChip = ({ location, tag, arrayIdx, ...props }: Omit<OptimizerTagProps, 'type'>) => {
  const ref = useRef<HTMLDivElement>(null)
  const [, tagDnd] = useTagDnD({
    location,
    tag,
    arrayIdx,
  })

  tagDnd(ref)

  return (
    <div ref={ref}>
      <Chip {...props}/>
    </div>
  )
}