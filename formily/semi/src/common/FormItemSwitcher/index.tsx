import React from 'react'
import { Switch } from '@douyinfe/semi-ui'

export interface IFormItemSwitcherProps {
  value?: string
  onChange?: (value: string) => void
}

export const FormItemSwitcher: React.FC<IFormItemSwitcherProps> = (props) => {
  return (
    <Switch
      checked={props.value === 'FormItem'}
      onChange={(value) => {
        props.onChange(value ? 'FormItem' : undefined)
      }}
    />
  )
}
