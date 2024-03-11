import { Chip } from '@mui/material';
import { ComponentProps, useRef, useState } from 'react';
import { useTagDnD } from '../../../../hooks/useTagDnD';
import { PromptTagsType, TagType } from '../../../../types/image-input';
import { makeTagLabel } from '../../../../utils/tags';
// import { ClipRetrievalPopover } from '../../../clipRetrieval/ClipRetrievalPopover'
import { TagEditMenu } from './TagEditMenu';

const colorMap: Record<
  keyof PromptTagsType,
  ComponentProps<typeof Chip>['color']
> = {
  tags: 'primary',
  negativeTags: 'secondary',
  tagPool: 'default',
};

interface TagsProps {
  location: keyof PromptTagsType;
  tag: TagType;
  arrayIdx: number;
}

export const Tag = ({ location, tag, arrayIdx }: TagsProps) => {
  const label = makeTagLabel(tag);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(menuAnchorEl);
  // const [clipAnchorEl, setClipAnchorEl] = useState<null | HTMLElement>(null)
  // const isClipOpen = Boolean(clipAnchorEl)

  const ref = useRef<HTMLDivElement>(null);
  const [, makeDnd] = useTagDnD({
    location,
    tag,
    arrayIdx,
  });

  makeDnd(ref);

  return (
    <div ref={ref}>
      <Chip
        key={tag.name}
        label={label}
        color={tag.muted ? 'default' : colorMap[location]}
        sx={{ opacity: tag.muted || tag.hidden ? 0.5 : 1, maxWidth: '333px' }}
        variant="outlined"
        onClick={(e) => {
          setMenuAnchorEl(e.currentTarget);
        }}
        // onContextMenu={(e) => {
        //   e.preventDefault()
        //   setClipAnchorEl(e.currentTarget)
        // }}
      />
      <TagEditMenu
        isOpen={isMenuOpen}
        handleClose={() => setMenuAnchorEl(null)}
        anchorEl={menuAnchorEl}
        tag={tag}
      />
      {/*<ClipRetrievalPopover*/}
      {/*  anchorEl={clipAnchorEl}*/}
      {/*  handleClose={() => setClipAnchorEl(null)}*/}
      {/*  isOpen={isClipOpen}*/}
      {/*  prompt={tag.name}*/}
      {/*/>*/}
    </div>
  );
};
