import React, { useEffect } from 'react'
import { useDesigner, TextWidget } from '@designable/react'
import { GlobalRegistry } from '@designable/core'
import { observer } from '@formily/react'
import { loadInitialSchema, saveSchema } from '../service'
import { Button, Notification, RadioGroup, Space } from '@douyinfe/semi-ui'

export const ActionsWidget = observer(() => {
  const designer = useDesigner()
  useEffect(() => {
    loadInitialSchema(designer)
  }, [])
  useEffect(() => {
    GlobalRegistry.setDesignerLanguage('zh-cn')
  }, [])
  return (
    <Space style={{ marginRight: 10 }}>
      <RadioGroup
        value={GlobalRegistry.getDesignerLanguage()}
        type="button"
        options={[
          { label: 'English', value: 'en-us' },
          { label: '简体中文', value: 'zh-cn' },
          { label: '한국어', value: 'ko-kr' },
        ]}
        onChange={(e) => {
          GlobalRegistry.setDesignerLanguage(e.target.value)
        }}
      />
      <Button
        onClick={() => {
          saveSchema(designer)
        }}
      >
        <TextWidget>Save</TextWidget>
      </Button>
      <Button
        type="primary"
        onClick={() => {
          Notification.info({
            position: 'top',
            content: JSON.stringify(designer.getBoSchema()),
          })
        }}
      >
        <TextWidget>BO</TextWidget>
      </Button>
    </Space>
  )
})
