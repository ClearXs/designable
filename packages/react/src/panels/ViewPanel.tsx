import React, { useEffect, useState } from 'react'
import {
  TreeNode,
  ITreeNode,
  WorkbenchTypes,
  BusinessObject,
  BoSchema,
} from '@designable/core'
import { observer } from '@formily/reactive-react'
import { useBo, useTree, useWorkbench } from '../hooks'
import { Viewport } from '../containers'
import { requestIdle } from '@designable/shared'

export interface IViewPanelProps {
  type: WorkbenchTypes
  children: (
    tree: TreeNode,
    bo: BusinessObject,
    onChange: (tree?: ITreeNode, boSchema?: BoSchema) => void
  ) => React.ReactElement
  scrollable?: boolean
  dragTipsDirection?: 'left' | 'right'
}

export const ViewPanel: React.FC<IViewPanelProps> = observer((props) => {
  const [visible, setVisible] = useState(true)
  const workbench = useWorkbench()
  const tree = useTree()
  const bo = useBo()
  useEffect(() => {
    if (workbench.type === props.type) {
      requestIdle(() => {
        requestAnimationFrame(() => {
          setVisible(true)
        })
      })
    } else {
      setVisible(false)
    }
  }, [workbench.type])
  if (workbench.type !== props.type) return null
  const render = () => {
    return props.children(tree, bo, (payload, boSchema) => {
      if (payload) {
        payload && tree.from(payload)
        tree.takeSnapshot()
      }
      boSchema && bo.from(boSchema)
    })
  }
  if (workbench.type === 'DESIGNABLE')
    return (
      <Viewport dragTipsDirection={props.dragTipsDirection}>
        {render()}
      </Viewport>
    )
  return (
    <div
      style={{
        overflow: props.scrollable ? 'overlay' : 'hidden',
        height: '100%',
        cursor: 'auto',
        userSelect: 'text',
      }}
    >
      {visible && render()}
    </div>
  )
})

ViewPanel.defaultProps = {
  scrollable: true,
}
