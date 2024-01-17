import React, { useRef, useEffect, useContext } from 'react'
import {
  BoNode,
  ClosestPosition,
  CursorStatus,
  DragMoveEvent,
} from '@designable/core'
import { autorun } from '@formily/reactive'
import { observer } from '@formily/reactive-react'
import {
  usePrefix,
  useCursor,
  useSelection,
  useMoveHelper,
  useDesigner,
} from '../../hooks'
import { IconWidget } from '../IconWidget'
import cls from 'classnames'
import './styles.less'
import { isFn } from '@designable/shared'
import { NodeContext } from './context'
import { NodeTitleWidget } from '../NodeTitleWidget'
export interface IBoFieldNodeProps {
  node: BoNode
  style?: React.CSSProperties
  className?: string
  workspaceId?: string
}

export const BoTreeNode: React.FC<IBoFieldNodeProps> = observer(
  ({ node, className, style, workspaceId }) => {
    const prefix = usePrefix('bo-tree-node')
    const engine = useDesigner()
    const ref = useRef<HTMLDivElement>()
    const ctx = useContext(NodeContext)
    const request = useRef(null)
    const cursor = useCursor()
    const selection = useSelection(workspaceId)
    const moveHelper = useMoveHelper(workspaceId)

    useEffect(() => {
      return engine.subscribeTo(DragMoveEvent, () => {
        const closestNodeId = moveHelper?.closestNode?.id
        const closestDirection = moveHelper?.boViewportClosestDirection
        const id = node.id
        if (!ref.current) return
        if (
          closestNodeId === id &&
          closestDirection === ClosestPosition.Inner
        ) {
          if (!ref.current.classList.contains('droppable')) {
            ref.current.classList.add('droppable')
          }
          if (!ref.current.classList.contains('expanded')) {
            if (request.current) {
              clearTimeout(request.current)
              request.current = null
            }
            request.current = setTimeout(() => {
              ref.current.classList.add('expanded')
            }, 600)
          }
        } else {
          if (request.current) {
            clearTimeout(request.current)
            request.current = null
          }
          if (ref.current.classList.contains('droppable')) {
            ref.current.classList.remove('droppable')
          }
        }
      })
    }, [node, moveHelper, cursor])

    useEffect(() => {
      return autorun(() => {
        const selectedIds = selection?.selected || []
        const id = node.id
        if (!ref.current) return
        if (selectedIds.includes(id)) {
          if (!ref.current.classList.contains('selected')) {
            ref.current.classList.add('selected')
          }
        } else {
          if (ref.current.classList.contains('selected')) {
            ref.current.classList.remove('selected')
          }
        }
        if (
          cursor.status === CursorStatus.Dragging &&
          moveHelper?.dragNodes?.length
        ) {
          if (ref.current.classList.contains('selected')) {
            ref.current.classList.remove('selected')
          }
        }
      })
    }, [node, selection, moveHelper])

    if (!node) return null

    const renderIcon = (node: BoNode) => {
      const icon = node.icon
      if (icon) {
        return <IconWidget infer={icon} size={12} />
      }
      return <IconWidget infer="Component" size={12} />
    }

    const renderTitle = (bo: BoNode) => {
      if (isFn(ctx.renderTitle)) return ctx.renderTitle(bo.treeNode)
      return (
        <span>
          <NodeTitleWidget node={bo.treeNode} />
        </span>
      )
    }

    const renderActions = (bo: BoNode) => {
      if (isFn(ctx.renderActions)) return ctx.renderActions(bo.treeNode)
    }

    return (
      <div
        style={style}
        ref={ref}
        className={cls(prefix, className, 'expanded')}
        data-designer-bo-node-id={node.id}
      >
        <div className={prefix + '-header'}>
          <div
            className={prefix + '-header-head'}
            style={{
              left: -node.depth * 16,
              width: node.depth * 16,
            }}
          ></div>
          <div className={prefix + '-header-content'}>
            <div className={prefix + '-header-base'}>
              {(node?.children?.length > 0 || (node && node.root)) && (
                <div
                  className={prefix + '-expand'}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (ref.current?.classList?.contains('expanded')) {
                      ref.current?.classList.remove('expanded')
                    } else {
                      ref.current?.classList.add('expanded')
                    }
                  }}
                >
                  <IconWidget infer="Expand" size={10} />
                </div>
              )}
              <div className={prefix + '-icon'}>{renderIcon(node)}</div>
              <div className={prefix + '-title'}>{renderTitle(node)}</div>
            </div>
            <div
              className={prefix + '-header-actions'}
              data-click-stop-propagation
            >
              {renderActions(node)}
              {!node.root && (
                <IconWidget
                  className={cls(prefix + '-hidden-icon', {
                    hidden: node.treeNode.hidden,
                  })}
                  infer={node.treeNode.hidden ? 'EyeClose' : 'Eye'}
                  size={14}
                  onClick={() => {
                    node.treeNode.hidden = !node.treeNode.hidden
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <div className={prefix + '-children'}>
          {node.children?.map((child) => {
            return (
              <BoTreeNode
                node={child}
                key={child.id}
                workspaceId={workspaceId}
              />
            )
          })}
        </div>
      </div>
    )
  }
)
