import { Chip, Tooltip } from '@mui/material'
import { deepOrange, deepPurple } from '@mui/material/colors'
import { ComponentProps, ReactElement, MouseEvent, useState } from 'react'
import { useTagDnD } from '../../../../hooks/useTagDnD'
import { OptimizerTypes, PromptTagsType, TagType } from '../../../../types/image-input'
import { makeTagLabel } from '../../../../utils/tags'
import { EmbeddingIcon } from '../../../icons/EmbeddingIcon'
import { HypernetworkIcon } from '../../../icons/HypernetworkIcon'
import { LoraIcon } from '../../../icons/LoraIcon'
import { OptimizerEditMenu } from './OptimizerEditMenu'

const iconsMap: Record<OptimizerTypes, ReactElement> = {
  [OptimizerTypes.EMBEDDING]: <EmbeddingIcon/>,
  [OptimizerTypes.HYPERNETWORK]: <HypernetworkIcon/>,
  [OptimizerTypes.LORA]: <LoraIcon/>,
}

const colorsMap: Record<OptimizerTypes, string> = {
  [OptimizerTypes.EMBEDDING]: deepOrange[500],
  [OptimizerTypes.HYPERNETWORK]: deepPurple[500],
  [OptimizerTypes.LORA]: deepOrange[500],
}

interface OptimizerTagProps extends Omit<ComponentProps<typeof Chip>, 'label' | 'icon'> {
  type: OptimizerTypes
  location: keyof PromptTagsType
  tag: TagType
  arrayIdx: number
}

export const OptimizerTag = ({ tag, type, sx, ...props }: OptimizerTagProps) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const isMenuOpen = Boolean(menuAnchorEl)
  const label = makeTagLabel(tag)

  function handleMenuOpen(event: MouseEvent<HTMLElement>) {
    setMenuAnchorEl(event.currentTarget)
  }

  function handleMenuClose() {
    setMenuAnchorEl(null)
  }

  const chipProps: OptimizerTagProps & Pick<ComponentProps<typeof Chip>, 'label' | 'icon'> = {
    ...props,
    tag,
    type,
    label,
    icon: iconsMap[type],
    variant: 'outlined',
    sx: {
      ...sx,
      borderColor: colorsMap[type],
      opacity: tag.muted ? 0.5 : 1,
    },
    onClick: handleMenuOpen,
  }

  return (
    <>
      <Tooltip title={type}>
        {type === OptimizerTypes.EMBEDDING ? (
          <EmbeddingTagChip {...chipProps} />
        ) : (
          <Chip {...chipProps} />
        )}
      </Tooltip>
      <OptimizerEditMenu
        isOpen={isMenuOpen}
        handleClose={handleMenuClose}
        anchorEl={menuAnchorEl}
        tag={tag}
      />
    </>
  )
}

const EmbeddingTagChip = ({ location, tag, arrayIdx, ...props }: Omit<OptimizerTagProps, 'type'>) => {
  const ref = useTagDnD({
    location,
    tag,
    arrayIdx,
  })
  return <Chip ref={ref} {...props}/>
}