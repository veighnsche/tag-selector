import { Chip, Tooltip } from '@mui/material';
import { deepOrange, deepPurple, teal } from '@mui/material/colors';
import { ComponentProps, MouseEvent, ReactElement, useState } from 'react';
import {
  OptimizerTypes,
  PromptTagsType,
  TagType,
} from '../../../../types/image-input';
import { makeTagLabel } from '../../../../utils/tags';
import { EmbeddingIcon } from '../../../icons/EmbeddingIcon';
import { HypernetworkIcon } from '../../../icons/HypernetworkIcon';
import { LoraIcon } from '../../../icons/LoraIcon';
import { EmbeddingTagChip } from './EmbeddingTag';
import { OptimizerEditMenu } from './OptimizerEditMenu';

const iconsMap: Record<OptimizerTypes, ReactElement> = {
  [OptimizerTypes.EMBEDDING]: <EmbeddingIcon />,
  [OptimizerTypes.HYPERNETWORK]: <HypernetworkIcon />,
  [OptimizerTypes.LORA]: <LoraIcon />,
  [OptimizerTypes.LYCORIS]: <LoraIcon />,
};

const colorsMap: Record<OptimizerTypes, string> = {
  [OptimizerTypes.EMBEDDING]: deepOrange[500],
  [OptimizerTypes.HYPERNETWORK]: deepPurple[500],
  [OptimizerTypes.LORA]: deepOrange[500],
  [OptimizerTypes.LYCORIS]: teal[500],
};

export interface OptimizerTagProps
  extends Omit<ComponentProps<typeof Chip>, 'label' | 'icon'> {
  type: OptimizerTypes;
  location: keyof PromptTagsType;
  tag: TagType;
  arrayIdx: number;
}

export const OptimizerTag = ({
  tag,
  type,
  sx,
  location,
  arrayIdx,
  ...props
}: OptimizerTagProps) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(menuAnchorEl);
  const label = makeTagLabel(tag);

  function handleMenuOpen(event: MouseEvent<HTMLElement>) {
    setMenuAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setMenuAnchorEl(null);
  }

  const chipProps: ComponentProps<typeof Chip> = {
    ...props,
    label,
    icon: iconsMap[type],
    variant: 'outlined',
    sx: {
      ...sx,
      borderColor: colorsMap[type],
      opacity: tag.muted ? 0.5 : 1,
    },
    onClick: handleMenuOpen,
  };

  return (
    <>
      <Tooltip title={type}>
        <div>
          <EmbeddingTagChip
            location={location}
            arrayIdx={arrayIdx}
            tag={tag}
            {...chipProps}
          />
        </div>
      </Tooltip>
      <OptimizerEditMenu
        isOpen={isMenuOpen}
        handleClose={handleMenuClose}
        anchorEl={menuAnchorEl}
        tag={tag}
      />
    </>
  );
};
