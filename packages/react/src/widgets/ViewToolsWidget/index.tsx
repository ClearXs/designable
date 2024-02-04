import React from 'react'
import { observer } from '@formily/reactive-react'
import { WorkbenchTypes } from '@designable/core'
import { IconWidget } from '../IconWidget'
import { usePrefix, useWorkbench } from '../../hooks'
import cls from 'classnames'
import { Button, ButtonGroup } from '@douyinfe/semi-ui'
import { TextWidget } from '../TextWidget'

export interface IViewToolsWidget {
  use?: WorkbenchTypes[]
  style?: React.CSSProperties
  className?: string
}

export const ViewToolsWidget: React.FC<IViewToolsWidget> = observer(
  ({ use, style, className }) => {
    const workbench = useWorkbench()
    const prefix = usePrefix('view-tools')
    return (
      <ButtonGroup style={style} className={cls(prefix, className)}>
        {use.includes('DESIGNABLE') && (
          <Button
            disabled={workbench.type === 'DESIGNABLE'}
            onClick={() => {
              workbench.type = 'DESIGNABLE'
            }}
            size="small"
            icon={<IconWidget infer="Design" />}
          >
            <TextWidget token={'panels.widgets.ViewTools.Designable'} />
          </Button>
        )}
        {use.includes('JSONTREE') && (
          <Button
            disabled={workbench.type === 'JSONTREE'}
            onClick={() => {
              workbench.type = 'JSONTREE'
            }}
            size="small"
            icon={<IconWidget infer="JSON" />}
          >
            <TextWidget token={'panels.widgets.ViewTools.JsonSchema'} />
          </Button>
        )}
        {use.includes('BOTREE') && (
          <Button
            disabled={workbench.type === 'BOTREE'}
            onClick={() => {
              workbench.type = 'BOTREE'
            }}
            size="small"
            icon={<IconWidget infer="Bo" />}
          >
            <TextWidget token={'panels.widgets.ViewTools.BoSchema'} />
          </Button>
        )}
        {use.includes('MARKUP') && (
          <Button
            disabled={workbench.type === 'MARKUP'}
            onClick={() => {
              workbench.type = 'MARKUP'
            }}
            size="small"
            icon={<IconWidget infer="Code" />}
          >
            <TextWidget token={'panels.widgets.ViewTools.MarkSchema'} />
          </Button>
        )}
        {use.includes('PREVIEW') && (
          <Button
            disabled={workbench.type === 'PREVIEW'}
            onClick={() => {
              workbench.type = 'PREVIEW'
            }}
            size="small"
            icon={<IconWidget infer="Play" />}
          >
            <TextWidget token={'panels.widgets.ViewTools.Preview'} />
          </Button>
        )}
      </ButtonGroup>
    )
  }
)

ViewToolsWidget.defaultProps = {
  use: ['DESIGNABLE', 'JSONTREE', 'PREVIEW'],
}
