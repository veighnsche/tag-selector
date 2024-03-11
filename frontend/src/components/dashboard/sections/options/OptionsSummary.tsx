import { Box, IconButton, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { selectSeed, setSeed } from '../../../../store/reducers/inputs';
import { RandomIcon } from '../../../icons/RandomIcon';

export const OptionsSummary = () => {
  const seed = useAppSelector(selectSeed);
  const dispatch = useAppDispatch();
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      width="90%"
    >
      <span>Options</span>
      {seed !== -1 && (
        <Box
          maxHeight="0.5rem"
          display="flex"
          alignItems="center"
          gap="0.5rem"
          sx={{ opacity: 0.5 }}
        >
          <Typography variant="caption" fontWeight={600}>
            Seed:
          </Typography>
          <Typography variant="caption">{seed}</Typography>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setSeed(-1));
            }}
          >
            <RandomIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};
