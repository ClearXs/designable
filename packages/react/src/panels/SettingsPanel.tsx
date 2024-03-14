import React, { useState } from 'react'
import { observer } from '@formily/reactive-react'
import { TextWidget, IconWidget } from '../widgets'
import { usePrefix, useWorkbench } from '../hooks'
import cls from 'classnames'
export interface ISettingPanelProps {
  title?: React.ReactNode
  extra?: React.ReactNode
  children: any
}

export const SettingsPanel: React.FC<ISettingPanelProps> = observer((props) => {
  const prefix = usePrefix('settings-panel')
  const workbench = useWorkbench()
  const [pinning, setPinning] = useState(false)
  const [visible, setVisible] = useState(true)

  const innerVisible =
    workbench.type === 'DESIGNABLE' || workbench.type === 'CUSTOM_DESIGNABLE'
  if (!innerVisible) {
    return null
  }
  if (!visible) {
    return (
      <div
        className={prefix + '-opener'}
        onClick={() => {
          setVisible(true)
        }}
      >
        <IconWidget infer="Setting" size={20} />
      </div>
    )
  }
  return (
    <div className={cls(prefix, { pinning })}>
      <div className={prefix + '-header'}>
        <div className={prefix + '-header-title'}>
          <TextWidget>{props.title}</TextWidget>
        </div>
        <div className={prefix + '-header-actions'}>
          <div className={prefix + '-header-extra'}>{props.extra}</div>
          {!pinning && (
            <IconWidget
              infer="PushPinOutlined"
              className={prefix + '-header-pin'}
              onClick={() => {
                setPinning(!pinning)
              }}
            />
          )}
          {pinning && (
            <IconWidget
              infer="PushPinFilled"
              className={prefix + '-pin-filled'}
              onClick={() => {
                setPinning(!pinning)
              }}
            />
          )}
          <IconWidget
            infer="Close"
            className={prefix + '-header-close'}
            onClick={() => {
              setVisible(false)
            }}
          />
        </div>
      </div>
      <div className={prefix + '-body'}>{innerVisible && props.children}</div>
    </div>
  )
})
