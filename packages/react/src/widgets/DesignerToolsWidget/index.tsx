import React, { Fragment, useRef } from 'react'
import { observer } from '@formily/reactive-react'
import { CursorType, ScreenType } from '@clearx/designable-core'
import {
  useCursor,
  useHistory,
  useScreen,
  usePrefix,
  useWorkbench,
} from '../../hooks'
import { IconWidget } from '../IconWidget'
import cls from 'classnames'
import './styles.scss'
import { Button, ButtonGroup, InputNumber, Tooltip } from '@douyinfe/semi-ui'
import { TextWidget } from '../TextWidget'

type DesignerToolsType = 'HISTORY' | 'CURSOR' | 'SCREEN_TYPE'

export type IDesignerToolsWidgetProps = {
  className?: string
  style?: React.CSSProperties
  use?: DesignerToolsType[]
}

export const DesignerToolsWidget: React.FC<IDesignerToolsWidgetProps> =
  observer((props) => {
    const screen = useScreen()
    const cursor = useCursor()
    const workbench = useWorkbench()
    const history = useHistory()
    const sizeRef = useRef<{ width?: any; height?: any }>({})
    const prefix = usePrefix('designer-tools')
    const { use = ['HISTORY', 'CURSOR', 'SCREEN_TYPE'] } = props
    const renderHistoryController = () => {
      if (!use.includes('HISTORY')) return null
      return (
        <ButtonGroup size="small" style={{ marginRight: 20 }}>
          <Tooltip
            position="bottom"
            content={
              <TextWidget token={'panels.widgets.DesignableTools.Undo'} />
            }
          >
            <Button
              size="small"
              disabled={!history?.allowUndo}
              onClick={() => {
                history.undo()
              }}
            >
              <IconWidget infer="Undo" />
            </Button>
          </Tooltip>

          <Tooltip
            position="bottom"
            content={
              <TextWidget token={'panels.widgets.DesignableTools.Redo'} />
            }
          >
            <Button
              size="small"
              disabled={!history?.allowRedo}
              onClick={() => {
                history.redo()
              }}
            >
              <IconWidget infer="Redo" />
            </Button>
          </Tooltip>
        </ButtonGroup>
      )
    }

    const renderCursorController = () => {
      if (workbench.type !== 'DESIGNABLE') return null
      if (!use.includes('CURSOR')) return null
      return (
        <ButtonGroup size="small" style={{ marginRight: 20 }}>
          <Tooltip
            position="bottom"
            content={
              <TextWidget token={'panels.widgets.DesignableTools.Move'} />
            }
          >
            <Button
              size="small"
              disabled={cursor.type === CursorType.Normal}
              onClick={() => {
                cursor.setType(CursorType.Normal)
              }}
            >
              <IconWidget infer="Move" />
            </Button>
          </Tooltip>
          <Tooltip
            position="bottom"
            content={
              <TextWidget token={'panels.widgets.DesignableTools.Selection'} />
            }
          >
            <Button
              size="small"
              disabled={cursor.type === CursorType.Selection}
              onClick={() => {
                cursor.setType(CursorType.Selection)
              }}
            >
              <IconWidget infer="Selection" />
            </Button>
          </Tooltip>
        </ButtonGroup>
      )
    }

    const renderResponsiveController = () => {
      if (!use.includes('SCREEN_TYPE')) return null
      if (screen.type !== ScreenType.Responsive) return null
      return (
        <Fragment>
          <InputNumber
            size="small"
            value={screen.width}
            style={{ width: 70, textAlign: 'center' }}
            onNumberChange={(value) => {
              sizeRef.current.width = value
            }}
            onBlur={() => {
              screen.setSize(sizeRef.current.width, screen.height)
            }}
          />
          <IconWidget
            size={10}
            infer="Close"
            style={{ padding: '0 3px', color: '#999' }}
          />
          <InputNumber
            value={screen.height}
            size="small"
            style={{
              width: 70,
              textAlign: 'center',
              marginRight: 10,
            }}
            onNumberChange={(value) => {
              sizeRef.current.height = value
            }}
            onBlur={() => {
              screen.setSize(screen.width, sizeRef.current.height)
            }}
          />
          {(screen.width !== '100%' || screen.height !== '100%') && (
            <Tooltip
              position="bottom"
              content={
                <TextWidget token={'panels.widgets.DesignableTools.Recover'} />
              }
            >
              <Button
                size="small"
                style={{ marginRight: 20 }}
                onClick={() => {
                  screen.resetSize()
                }}
              >
                <IconWidget infer="Recover" />
              </Button>
            </Tooltip>
          )}
        </Fragment>
      )
    }

    const renderScreenTypeController = () => {
      if (!use.includes('SCREEN_TYPE')) return null
      return (
        <ButtonGroup size="small" style={{ marginRight: 20 }}>
          <Tooltip
            position="bottom"
            content={<TextWidget token={'panels.widgets.DesignableTools.PC'} />}
          >
            <Button
              size="small"
              disabled={screen.type === ScreenType.PC}
              onClick={() => {
                screen.setType(ScreenType.PC)
              }}
            >
              <IconWidget infer="PC" />
            </Button>
          </Tooltip>
          <Tooltip
            position="bottom"
            content={
              <TextWidget token={'panels.widgets.DesignableTools.Mobile'} />
            }
          >
            <Button
              size="small"
              disabled={screen.type === ScreenType.Mobile}
              onClick={() => {
                screen.setType(ScreenType.Mobile)
              }}
            >
              <IconWidget infer="Mobile" />
            </Button>
          </Tooltip>
          <Tooltip
            position="bottom"
            content={
              <TextWidget token={'panels.widgets.DesignableTools.Responsive'} />
            }
          >
            <Button
              size="small"
              disabled={screen.type === ScreenType.Responsive}
              onClick={() => {
                screen.setType(ScreenType.Responsive)
              }}
            >
              <IconWidget infer="Responsive" />
            </Button>
          </Tooltip>
        </ButtonGroup>
      )
    }

    const renderMobileController = () => {
      if (!use.includes('SCREEN_TYPE')) return null
      if (screen.type !== ScreenType.Mobile) return
      return (
        <Tooltip
          position="bottom"
          content={<TextWidget token={'panels.widgets.DesignableTools.Flip'} />}
        >
          <Button
            size="small"
            style={{ marginRight: 20 }}
            onClick={() => {
              screen.setFlip(!screen.flip)
            }}
          >
            <IconWidget
              infer="Flip"
              style={{
                transition: 'all .15s ease-in',
                transform: screen.flip ? 'rotate(-90deg)' : '',
              }}
            />
          </Button>
        </Tooltip>
      )
    }

    return (
      <div style={props.style} className={cls(prefix, props.className)}>
        {renderHistoryController()}
        {renderCursorController()}
        {renderScreenTypeController()}
        {renderMobileController()}
        {renderResponsiveController()}
      </div>
    )
  })
