import React from 'react'
import { Table } from '@douyinfe/semi-ui'
import {
  GlobalBOFieldProps,
  GlobalRegistry,
  TreeNode,
  createBehavior,
  createResource,
} from '@designable/core'
import {
  useTreeNode,
  TreeNodeWidget,
  DroppableWidget,
  useNodeIdProps,
  DnFC,
} from '@designable/react'
import { ArrayBase } from '@formily/semi'
import { observer } from '@formily/react'
import { LoadTemplate } from '../../common/LoadTemplate'
import cls from 'classnames'
import {
  queryNodesByComponentPath,
  hasNodeByComponentPath,
  findNodeByComponentPath,
  createEnsureTypeItemsNode,
} from '../../shared'
import { useDropTemplate } from '../../hooks'
import { createArrayBehavior } from '../ArrayBase'
import './styles.less'
import { createVoidFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import { TableProps } from '@douyinfe/semi-ui/lib/es/table'

const ensureObjectItemsNode = createEnsureTypeItemsNode('object')

const HeaderCell: React.FC = (props: any) => {
  return (
    <th
      {...props}
      data-designer-node-id={props.className.match(/data-id\:([^\s]+)/)?.[1]}
    >
      {props.children}
    </th>
  )
}

const BodyCell: React.FC = (props: any) => {
  return (
    <td
      {...props}
      data-designer-node-id={props.className.match(/data-id\:([^\s]+)/)?.[1]}
    >
      {props.children}
    </td>
  )
}

export const ArrayTable: DnFC<TableProps<any>> = observer((props) => {
  const node = useTreeNode()
  const nodeId = useNodeIdProps()
  useDropTemplate('ArrayTable', (source) => {
    const indexNode = new TreeNode({
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': {
          title: node.getMessage('index'),
        },
      },
      children: [
        {
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'ArrayTable.Index',
          },
        },
      ],
    })
    const columnNode = new TreeNode({
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': {
          title: `Title`,
        },
      },
      children: source.map((node) => {
        node.props.title = undefined
        return node
      }),
    })

    const operationNode = new TreeNode({
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': {
          title: node.getMessage('operation'),
        },
      },
      children: [
        {
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'ArrayTable.Remove',
          },
        },
      ],
    })
    const objectNode = new TreeNode({
      componentName: 'Field',
      props: {
        type: 'object',
      },
      children: [indexNode, columnNode, operationNode],
    })
    const additionNode = new TreeNode({
      componentName: 'Field',
      props: {
        type: 'void',
        title: node.getMessage('addData'),
        'x-component': 'ArrayTable.Addition',
      },
    })
    return [objectNode, additionNode]
  })
  const columns = queryNodesByComponentPath(node, [
    'ArrayTable',
    '*',
    'ArrayTable.Column',
  ])
  const additions = queryNodesByComponentPath(node, [
    'ArrayTable',
    'ArrayTable.Addition',
  ])
  const defaultRowKey = () => {
    return node.id
  }

  const renderTable = () => {
    if (node.children.length === 0) return <DroppableWidget />
    return (
      <ArrayBase disabled>
        <Table
          size="small"
          bordered
          {...props}
          scroll={{ x: '100%' }}
          className={cls(props.className)}
          style={{ marginBottom: 10, ...props.style }}
          rowKey={defaultRowKey}
          dataSource={[{ id: '1' }]}
          pagination={false}
          components={{
            header: {
              cell: HeaderCell,
            },
            body: {
              cell: BodyCell,
            },
          }}
        >
          {columns.map((node) => {
            const children = node.children.map((child) => {
              return <TreeNodeWidget node={child} key={child.id} />
            })
            const props = node.props['x-component-props']
            return (
              <Table.Column
                {...props}
                title={
                  <div data-content-editable="x-component-props.title">
                    {props.title}
                  </div>
                }
                dataIndex={node.id}
                className={`data-id:${node.id}`}
                key={node.id}
                render={(value, record, key) => {
                  return (
                    <ArrayBase.Item key={key} index={key} record={null}>
                      {children.length > 0 ? children : 'Droppable'}
                    </ArrayBase.Item>
                  )
                }}
              />
            )
          })}
          {columns.length === 0 && (
            <Table.Column render={() => <DroppableWidget />} />
          )}
        </Table>
        {additions.map((child) => {
          return <TreeNodeWidget node={child} key={child.id} />
        })}
      </ArrayBase>
    )
  }

  useDropTemplate('ArrayTable.Column', (source) => {
    return source.map((node) => {
      node.props.title = undefined
      return node
    })
  })

  return (
    <div {...nodeId} className="dn-array-table">
      {renderTable()}
      <LoadTemplate
        actions={[
          {
            title: node.getMessage('addIndex'),
            icon: 'AddIndex',
            type: 'tertiary',
            onClick: () => {
              if (
                hasNodeByComponentPath(node, [
                  'ArrayTable',
                  '*',
                  'ArrayTable.Column',
                  'ArrayTable.Index',
                ])
              )
                return
              const tableColumn = new TreeNode({
                componentName: 'Field',
                props: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: `Title`,
                  },
                },
                children: [
                  {
                    componentName: 'Field',
                    props: {
                      type: 'void',
                      'x-component': 'ArrayTable.Index',
                    },
                  },
                ],
              })
              const sortNode = findNodeByComponentPath(node, [
                'ArrayTable',
                '*',
                'ArrayTable.Column',
                'ArrayTable.SortHandle',
              ])
              if (sortNode) {
                sortNode.parent.insertAfter(tableColumn)
              } else {
                ensureObjectItemsNode(node).prepend(tableColumn)
              }
            },
          },
          {
            title: node.getMessage('addColumn'),
            icon: 'AddColumn',
            type: 'tertiary',
            onClick: () => {
              const operationNode = findNodeByComponentPath(node, [
                'ArrayTable',
                '*',
                'ArrayTable.Column',
                (name) => {
                  return name === 'ArrayTable.Remove'
                },
              ])
              const tableColumn = new TreeNode({
                componentName: 'Field',
                props: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: `Title`,
                  },
                },
              })
              if (operationNode) {
                operationNode.parent.insertBefore(tableColumn)
              } else {
                ensureObjectItemsNode(node).append(tableColumn)
              }
            },
          },
          {
            title: node.getMessage('addOperation'),
            icon: 'AddOperation',
            type: 'tertiary',
            onClick: () => {
              const oldOperationNode = findNodeByComponentPath(node, [
                'ArrayTable',
                '*',
                'ArrayTable.Column',
                (name) => {
                  return name === 'ArrayTable.Remove'
                },
              ])
              const oldAdditionNode = findNodeByComponentPath(node, [
                'ArrayTable',
                'ArrayTable.Addition',
              ])
              if (!oldOperationNode) {
                const operationNode = new TreeNode({
                  componentName: 'Field',
                  props: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': {
                      title: `Title`,
                    },
                  },
                  children: [
                    {
                      componentName: 'Field',
                      props: {
                        type: 'void',
                        'x-component': 'ArrayTable.Remove',
                      },
                    },
                  ],
                })
                ensureObjectItemsNode(node).append(operationNode)
              }
              if (!oldAdditionNode) {
                const additionNode = new TreeNode({
                  componentName: 'Field',
                  props: {
                    type: 'void',
                    title: 'Addition',
                    'x-component': 'ArrayTable.Addition',
                  },
                })
                ensureObjectItemsNode(node).insertAfter(additionNode)
              }
            },
          },
        ]}
      />
    </div>
  )
})

ArrayBase.mixin(ArrayTable)

ArrayTable.Behavior = createBehavior(createArrayBehavior('ArrayTable'), {
  name: 'ArrayTable.Column',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'ArrayTable.Column',
  designerProps: {
    droppable: true,
    allowDrop: (node) =>
      node.props['type'] === 'object' &&
      node.parent?.props?.['x-component'] === 'ArrayTable',
    propsSchema: createVoidFieldSchema(AllSchemas.ArrayTable.Column),
  },
  designerLocales: AllLocales.ArrayTableColumn,
})

ArrayTable.Resource = createResource({
  icon: 'ArrayTableSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'array',
        'x-decorator': 'FormItem',
        'x-component': 'ArrayTable',
      },
    },
  ],
})

GlobalRegistry.registerBOTransfer({
  adaptive(node) {
    return node.props['x-component'] === 'ArrayTable'
  },
  transform(node, root) {
    return GlobalBOFieldProps.transform(node, root, {
      attrType: 'table',
      icon: 'TableType',
    })
  },
})
