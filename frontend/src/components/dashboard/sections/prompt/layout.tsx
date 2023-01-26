import styled from '@emotion/styled'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Scene } from './Scene'
import { TagList } from './TagList'

const LayoutFlex = styled.div`
  width: 100%;
  height: 100%;
  
  flex: 1;

  display: flex;
  flex-direction: column;
`

export const PromptLayout = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <LayoutFlex>
        <Scene/>
        <TagList location="tags"/>
        <TagList location="negativeTags"/>
        <TagList location="tagPool"/>
      </LayoutFlex>
    </DndProvider>
  )
}
