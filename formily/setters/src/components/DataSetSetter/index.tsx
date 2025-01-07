import React from 'react'
import { useField, Field, observer } from '@formily/react'
import { Field as FieldType } from '@formily/core'
import { IconWidget, TextWidget, usePrefix } from '@clearx/designable-react'
import { RadioGroup } from '@douyinfe/semi-ui'
import { StaticDataSourceSetter } from './StaticDataSourceSetter'
import { DictionaryDataSourceSetter } from './DictionaryDataSourceSetter'
import cls from 'classnames'
import './styles.scss'
import { DynamicDataSourceSetter } from './DynamicDataSourceSetter'
export interface IDataSetSetterProps {
  className?: string
  style?: React.CSSProperties
  value?: string
  onChange?: (value: string) => void
}

export const DataSetSetter: React.FC<IDataSetSetterProps> = observer(
  (props) => {
    const field = useField<FieldType>()
    const prefix = usePrefix('component-dataset-setter')
    return (
      <>
        <div className={cls(prefix, props.className)}>
          <RadioGroup
            className={prefix + '-radio'}
            direction="horizontal"
            options={[
              {
                label: (
                  <IconWidget
                    infer="StaticDataSet"
                    tooltip={{
                      content: (
                        <TextWidget token="SettingComponents.DataSetSetter.static" />
                      ),
                    }}
                  />
                ),
                value: 'static',
              },
              {
                label: (
                  <IconWidget
                    infer="DictionaryDataSet"
                    tooltip={{
                      content: (
                        <TextWidget token="SettingComponents.DataSetSetter.dictionary.title" />
                      ),
                    }}
                  />
                ),
                value: 'dictionary',
              },
              {
                label: (
                  <IconWidget
                    infer="DynamicDataSet"
                    tooltip={{
                      content: (
                        <TextWidget token="SettingComponents.DataSetSetter.dynamic" />
                      ),
                    }}
                  />
                ),
                value: 'dynamic',
              },
            ]}
            value={props.value}
            onChange={(e) => {
              props.onChange?.(e.target.value)
            }}
            type="button"
          />
          <Field
            name="optionList"
            basePath={field.address.parent()}
            visible={false}
            reactions={(staticField) => {
              staticField.visible = field.value === 'static'
              if (!staticField.visible) {
                staticField.value = []
              }
            }}
            component={[StaticDataSourceSetter]}
          />
          <Field
            name="dictionary"
            basePath={field.address.parent()}
            visible={false}
            reactions={(dicField) => {
              dicField.visible = field.value === 'dictionary'
              if (!dicField.visible) {
                dicField.value = undefined
              }
            }}
            component={[DictionaryDataSourceSetter]}
          />
          <Field
            name="dynamic"
            basePath={field.address.parent()}
            visible={false}
            reactions={(dynamicField) => {
              dynamicField.visible = field.value === 'dynamic'
              if (!dynamicField.visible) {
                dynamicField.value = {}
              }
            }}
            component={[DynamicDataSourceSetter]}
          />
        </div>
      </>
    )
  },
)
