import React, { Fragment } from 'react'
import { observer } from '@formily/reactive-react'
import { useDesigner } from '@designable/react'
import { TreeSelect } from '@douyinfe/semi-ui'
import { GlobalRegistry } from '@designable/core'
export interface IDictionaryDataSourceSetterProps {
  className?: string
  style?: React.CSSProperties
  onChange: (dic: string) => void
  value: string
}

export const DictionaryDataSourceSetter: React.FC<IDictionaryDataSourceSetterProps> =
  observer((props) => {
    const engine = useDesigner()
    const dictionary = engine.getDictionary()
    return (
      <Fragment>
        <TreeSelect
          placeholder={GlobalRegistry.getDesignerMessage(
            'SettingComponents.DataSetSetter.dictionary.placeholder'
          )}
          value={props.value}
          treeData={dictionary}
          expandAll
          onSelect={(key) => {
            props.onChange(key)
          }}
        />
      </Fragment>
    )
  })
