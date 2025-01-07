import React from 'react'
import { usePrefix } from '@clearx/designable-react'
import { SketchPicker } from 'react-color'
import './styles.scss'
import { Input, Popover } from '@douyinfe/semi-ui'

export interface IColorInputProps {
  value?: string
  onChange?: (color: string) => void
}

export const ColorInput: React.FC<IColorInputProps> = (props) => {
  const prefix = usePrefix('color-input')
  const color = props.value as string
  return (
    <div className={prefix}>
      <Input
        value={props.value}
        onChange={(value) => {
          props.onChange?.(value)
        }}
        placeholder="Color"
        prefix={
          <Popover
            autoAdjustOverflow
            trigger="click"
            closeOnEsc
            clickToHide
            content={
              <SketchPicker
                color={color}
                onChange={({ rgb }) => {
                  props.onChange?.(`rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`)
                }}
              />
            }
          >
            <div
              className={prefix + '-color-tips'}
              style={{
                backgroundColor: color,
              }}
            ></div>
          </Popover>
        }
      />
    </div>
  )
}
