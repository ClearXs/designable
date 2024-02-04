import React, { Fragment, useMemo, useState } from 'react'
import { observer } from '@formily/reactive-react'
import { Button, Modal } from '@douyinfe/semi-ui'
import { TextWidget } from '@designable/react'
import { SchemaField } from '@designable/react-settings-form'
import { ISchema } from '@formily/react'
import { GlobalRegistry } from '@designable/core'
import { createForm } from '@formily/core'
import { Form } from '@formily/semi'

export interface IDynamicDataSourceSetterProps {
  className?: string
  style?: React.CSSProperties
  onChange: (request: RequestProps) => void
  value: RequestProps
  effects?: (form) => void
}

export type RequestProps = {
  // 请求url
  url: string
  // 请求method，默认为post
  method?:
    | 'get'
    | 'GET'
    | 'delete'
    | 'DELETE'
    | 'head'
    | 'HEAD'
    | 'options'
    | 'OPTIONS'
    | 'post'
    | 'POST'
    | 'put'
    | 'PUT'
    | 'patch'
    | 'PATCH'
    | 'purge'
    | 'PURGE'
    | 'link'
    | 'LINK'
    | 'unlink'
    | 'UNLINK'
  // 请求参数
  params?: KeyValue[]
  // 请求头
  headers?: KeyValue[]
  // 是否是内部接口，默认为true
  internal?: boolean
  // 返回结果转换参数
  mapping?: {
    // 取code参数，默认code
    code: string
    // 取data数据集的参数，默认data
    data: string
    // 判断是否成功的参数，默认为200
    success: any
    // 取value值的参数，默认为id
    value: string
    // 去label值的参数，默认为name
    label: string
  }
}

export type KeyValue = {
  key: string
  value: any
}

const getKeyValueTable = (
  title: string,
  values: KeyValue[] = [],
  add = true,
  remove = true
): ISchema => {
  const schema: ISchema = {
    type: 'array',
    title: title,
    'x-component': 'ArrayTable',
    'x-decorator': 'FormItem',
    'x-value': values,
    'x-component-props': {
      pagination: { pageSize: 10 },
      scroll: { x: '100%' },
      arrayBaseProps: {},
    },
    items: {
      type: 'object',
      properties: {
        columnKey: {
          type: 'void',
          'x-component': 'ArrayTable.Column',
          'x-component-props': { width: 200, title: 'Key' },
          properties: {
            key: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
          },
        },
        columnValue: {
          type: 'void',
          'x-component': 'ArrayTable.Column',
          'x-component-props': { width: 200, title: 'Value' },
          properties: {
            value: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
          },
        },
        columnOperation: {
          type: 'void',
          'x-component': 'ArrayTable.Column',
          'x-component-props': {
            dataIndex: 'operations',
            width: 200,
            fixed: 'right',
          },
          properties: {},
        },
      },
    },
    properties: {},
  }

  if (add) {
    schema['properties']['add'] = {
      type: 'void',
      'x-component': 'ArrayTable.Addition',
      'x-component-props': {
        method: 'unshift',
      },
      title: GlobalRegistry.getDesignerMessage(
        'SettingComponents.DataSetSetter.DynamicSetter.addColumn'
      ),
    }
  }
  if (remove) {
    schema['items']['properties']['columnOperation']['properties']['remove'] = {
      type: 'void',
      'x-component': 'FormItem',
      properties: {
        remove: {
          type: 'void',
          'x-component': 'ArrayTable.Remove',
        },
      },
    }
  }
  return schema
}

export const DynamicDataSourceSetter: React.FC<IDynamicDataSourceSetterProps> =
  observer((props) => {
    const { value, onChange, effects } = props
    const [modalVisible, setModalVisible] = useState(false)
    const openModal = () => setModalVisible(true)
    const closeModal = () => setModalVisible(false)
    const form = useMemo(() => {
      return createForm({
        initialValues: value,
        effects(form) {
          effects?.(form)
        },
      })
    }, [value])

    const schema = useMemo(() => {
      const schema: ISchema = { type: 'object', properties: {} }
      schema['properties']['url'] = {
        type: 'string',
        title: GlobalRegistry.getDesignerMessage(
          'SettingComponents.DataSetSetter.DynamicSetter.url'
        ),
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        required: true,
      }
      schema['properties']['method'] = {
        type: 'string',
        title: GlobalRegistry.getDesignerMessage(
          'SettingComponents.DataSetSetter.DynamicSetter.method'
        ),
        required: true,
        enum: ['POST', 'PUT', 'GET', 'DELETE', 'PATCH', 'PURGE'],
        'x-decorator': 'FormItem',
        'x-component': 'Radio.Group',
        'x-value': 'GET',
        'x-component-props': {
          type: 'button',
        },
      }
      schema['properties']['params'] = getKeyValueTable(
        GlobalRegistry.getDesignerMessage(
          'SettingComponents.DataSetSetter.DynamicSetter.params'
        )
      )
      schema['properties']['headers'] = getKeyValueTable(
        GlobalRegistry.getDesignerMessage(
          'SettingComponents.DataSetSetter.DynamicSetter.headers'
        )
      )
      schema['properties']['internal'] = {
        type: 'boolean',
        'x-decorator': 'FormItem',
        'x-component': 'Switch',
        title: GlobalRegistry.getDesignerMessage(
          'SettingComponents.DataSetSetter.DynamicSetter.internal'
        ),
        'x-component-props': {
          defaultValue: true,
        },
      }
      schema['properties']['mapping'] = getKeyValueTable(
        GlobalRegistry.getDesignerMessage(
          'SettingComponents.DataSetSetter.DynamicSetter.mapping'
        ),
        [
          { key: 'code', value: 'code' },
          { key: 'data', value: 'data' },
          { key: 'success', value: 200 },
          { key: 'value', value: 'id' },
          { key: 'label', value: 'name' },
        ],
        false,
        false
      )
      return schema
    }, [value])

    return (
      <Fragment>
        <Button block onClick={openModal}>
          <TextWidget token="SettingComponents.DataSetSetter.DynamicSetter.configureRequest" />
        </Button>
        <Modal
          title={
            <TextWidget token="SettingComponents.DataSetSetter.DynamicSetter.configureRequest" />
          }
          width="40%"
          bodyStyle={{ padding: 10 }}
          visible={modalVisible}
          onCancel={closeModal}
          closeOnEsc
          onOk={() => {
            form.submit((values) => {
              onChange?.(values)
              closeModal()
            })
          }}
        >
          <Form
            form={form}
            colon={false}
            labelWidth={100}
            labelAlign="left"
            wrapperAlign="right"
            feedbackLayout="loose"
            tooltipLayout="text"
          >
            <SchemaField schema={schema} />
          </Form>
        </Modal>
      </Fragment>
    )
  })
