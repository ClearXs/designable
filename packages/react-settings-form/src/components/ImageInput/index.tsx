import React, { useContext } from 'react'
import { usePrefix, IconWidget } from '@designable/react'
import { SettingsFormContext } from '../../shared/context'
import cls from 'classnames'
import './styles.less'
import { Input, Upload } from '@douyinfe/semi-ui'
import { InputProps } from '@douyinfe/semi-ui/lib/es/input'
export interface ImageInputProps extends Omit<InputProps, 'onChange'> {
  value?: string
  onChange?: (value: string) => void
}

export const ImageInput: React.FC<ImageInputProps> = ({
  className,
  style,
  ...props
}) => {
  const prefix = usePrefix('image-input')
  const context = useContext(SettingsFormContext)
  return (
    <div className={cls(prefix, className)} style={style}>
      <Input
        {...props}
        onChange={(value) => {
          props.onChange?.(value)
        }}
        prefix={
          <Upload
            action={context.uploadAction}
            maxSize={1}
            onChange={(params: any) => {
              const response = params.file?.response
              const url =
                response?.url ||
                response?.downloadURL ||
                response?.imageURL ||
                response?.thumbUrl
              if (!url) return
              props.onChange?.(url)
            }}
          >
            <IconWidget infer="CloudUpload" style={{ cursor: 'pointer' }} />
          </Upload>
        }
      />
    </div>
  )
}

export const BackgroundImageInput: React.FC<ImageInputProps> = (props) => {
  const addBgValue = (value: any) => {
    if (/url\([^)]+\)/.test(value)) {
      return value
    }
    return `url(${value})`
  }
  const removeBgValue = (value: any) => {
    const matched = String(value).match(/url\(\s*([^)]+)\s*\)/)
    if (matched?.[1]) {
      return matched?.[1]
    }
    return value
  }
  return (
    <ImageInput
      value={removeBgValue(props.value)}
      onChange={(url) => {
        props.onChange?.(addBgValue(url))
      }}
    />
  )
}
