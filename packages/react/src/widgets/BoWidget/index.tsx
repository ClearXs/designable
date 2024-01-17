import React, { useLayoutEffect, useRef } from 'react'
import cls from 'classnames'
import { usePrefix, useBo, useWorkbench } from '../../hooks'
import { observer } from '@formily/reactive-react'
import { BoTreeNode } from './BoTreeNode'
import { Insertion } from './Insertion'
import { NodeContext } from './context'
import { useBoViewPort } from '../../hooks/useBoViewport'
import { TreeNode, Viewport } from '@designable/core'
import { globalThisPolyfill } from '@designable/shared'

export interface IBoTreeWidgetProps {
  className?: string
  style?: React.CSSProperties
  onClose?: () => void
  renderTitle?: (node: TreeNode) => React.ReactNode
  renderActions?: (node: TreeNode) => React.ReactNode
}

export const BOWidget: React.FC<IBoTreeWidgetProps> = observer(
  ({ onClose, style, renderActions, renderTitle, className, ...props }) => {
    const ref = useRef<HTMLDivElement>()
    const prefix = usePrefix('bo-tree')
    const workbench = useWorkbench()
    const current = workbench?.activeWorkspace || workbench?.currentWorkspace
    const workspaceId = current?.id
    const bo = useBo(workspaceId)
    const boViewport = useBoViewPort(workspaceId)
    const boViewportRef = useRef<Viewport>()
    useLayoutEffect(() => {
      if (!workspaceId) return
      if (boViewportRef.current && boViewportRef.current !== boViewport) {
        boViewportRef.current.onUnmount()
      }
      if (ref.current && boViewport) {
        boViewport.onMount(ref.current, globalThisPolyfill)
      }
      boViewportRef.current = boViewport
      return () => {
        boViewport.onUnmount()
      }
    }, [workspaceId, boViewport])

    if (!bo || !workspaceId || !boViewport) return null

    return (
      <NodeContext.Provider value={{ renderActions, renderTitle }}>
        <div
          {...props}
          className={cls(prefix + '-container', className)}
          style={style}
        >
          <div className={prefix + '-content'} ref={ref}>
            <BoTreeNode node={bo.root} workspaceId={workspaceId} />
            <div
              className={prefix + '-aux'}
              style={{
                pointerEvents: 'none',
              }}
            >
              <Insertion workspaceId={workspaceId} />
            </div>
          </div>
        </div>
      </NodeContext.Provider>
    )
  }
)
