import React from 'react'
import { observer } from '@formily/reactive-react'
import { DroppableWidget } from '@clearx/designable-react'
import './styles.scss'

export const Container: React.FC<React.PropsWithChildren> = observer(
  (props) => {
    return <DroppableWidget>{props.children}</DroppableWidget>
  },
)

export const withContainer = (Target: React.ComponentType<any>) => {
  return (props: any) => {
    return (
      <DroppableWidget>
        <Target {...props} />
      </DroppableWidget>
    )
  }
}
