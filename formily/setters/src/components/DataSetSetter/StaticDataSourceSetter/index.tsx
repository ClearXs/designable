import React, { Fragment, useMemo, useState } from 'react'
import cls from 'classnames'
import { Form } from '@formily/core'
import { observable } from '@formily/reactive'
import { observer } from '@formily/reactive-react'
import { usePrefix, useTheme, TextWidget } from '@designable/react'
import { DataSettingPanel } from './DataSettingPanel'
import { TreePanel } from './TreePanel'
import { transformDataToValue, transformValueToData } from './shared'
import { IDataSourceItem, ITreeDataSource } from './types'
import './styles.less'
import { Button, Modal } from '@douyinfe/semi-ui'
export interface IStaticDataSourceSetterProps {
  className?: string
  style?: React.CSSProperties
  onChange: (dataSource: IDataSourceItem[]) => void
  value: IDataSourceItem[]
  allowExtendOption?: boolean
  defaultOptionValue?: {
    label: string
    value: any
  }[]
  effects?: (form: Form<any>) => void
}

export const StaticDataSourceSetter: React.FC<IStaticDataSourceSetterProps> =
  observer((props) => {
    const {
      className,
      value = [],
      onChange,
      allowExtendOption = true,
      defaultOptionValue,
      effects = () => {},
    } = props
    const theme = useTheme()
    const prefix = usePrefix('data-source-setter')
    const [modalVisible, setModalVisible] = useState(false)
    const treeDataSource: ITreeDataSource = useMemo(
      () =>
        observable({
          dataSource: transformValueToData(value),
          selectedKey: '',
        }),
      [value, modalVisible]
    )
    const openModal = () => setModalVisible(true)
    const closeModal = () => setModalVisible(false)
    return (
      <Fragment>
        <Button block onClick={openModal}>
          <TextWidget token="SettingComponents.DataSourceSetter.configureDataSource" />
        </Button>
        <Modal
          title={
            <TextWidget token="SettingComponents.DataSourceSetter.configureDataSource" />
          }
          width="65%"
          bodyStyle={{ padding: 10 }}
          visible={modalVisible}
          onCancel={closeModal}
          onOk={() => {
            onChange(transformDataToValue(treeDataSource.dataSource))
            closeModal()
          }}
        >
          <div
            className={`${cls(prefix, className)} ${prefix + '-' + theme} ${
              prefix + '-layout'
            }`}
          >
            <div className={`${prefix + '-layout-item left'}`}>
              <TreePanel
                defaultOptionValue={defaultOptionValue}
                treeDataSource={treeDataSource}
              ></TreePanel>
            </div>
            <div className={`${prefix + '-layout-item right'}`}>
              <DataSettingPanel
                allowExtendOption={allowExtendOption}
                treeDataSource={treeDataSource}
                effects={effects}
              ></DataSettingPanel>
            </div>
          </div>
        </Modal>
      </Fragment>
    )
  })
