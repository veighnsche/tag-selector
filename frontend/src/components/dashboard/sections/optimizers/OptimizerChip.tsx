import { Chip, Tooltip } from '@mui/material';
import { deepOrange, deepPurple, teal } from '@mui/material/colors';
import { ComponentProps, ReactElement } from 'react';
import { OptimizerTypes } from '../../../../types/image-input';
import { EmbeddingIcon } from '../../../icons/EmbeddingIcon';
import { HypernetworkIcon } from '../../../icons/HypernetworkIcon';
import { LoraIcon } from '../../../icons/LoraIcon';

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

interface OptimizerChipProps
  extends Omit<ComponentProps<typeof Chip>, 'label' | 'icon'> {
  name: string;
  type: OptimizerTypes;
  active?: boolean;
}

export const OptimizerChip = ({
  name,
  type,
  active,
  sx,
  ...props
}: OptimizerChipProps) => (
  <Tooltip title={type}>
    <Chip
      label={name}
      icon={iconsMap[type]}
      variant={active ? 'filled' : 'outlined'}
      sx={{
        ...sx,
        borderColor: colorsMap[type],
        backgroundColor: active ? colorsMap[type] : undefined,
      }}
      {...props}
    />
  </Tooltip>
);
