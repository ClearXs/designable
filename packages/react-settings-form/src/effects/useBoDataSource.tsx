import { BusinessObject, TreeNode } from '@designable/core'
import { onFieldReact } from '@formily/core'

export const useBoDataSource = (node: TreeNode, bo: BusinessObject) => {
  onFieldReact('name', (field) => {
    if (!node.props['name']) {
      node.props['name'] = node.bo?.id
    }
    // 设置字段标识数据源
    field['dataSource'] = bo.root?.dataSource

    // 设置选中之后动态替换BoNode的TreeNode
    field['onInput'] = (key) => {
      const selectBoNode = bo.root?.find('key', key)
      const preBoNode = bo.root?.find('id', node.id)
      if (selectBoNode) {
        // 当选中一个bo结点后
        // 1.如果视图结点没有选择有bo，绑定新的bo
        // 2.如果视图结点已经选择有bo，之前bo的视图结点为空，并绑定新的bo
        // 3.如果绑定的bo结点是由视图结点临时创建，则删除
        if (preBoNode) {
          preBoNode.treeNode = undefined
        }
        if (preBoNode && preBoNode.lifecycle === 'temporary') {
          preBoNode.removeThis()
        }
        // 对应Bo结点赋值视图结点
        selectBoNode.treeNode = node
        bo.displaceInnerAttribute(selectBoNode.schema, node)
        node.props['name'] = selectBoNode.key
      }
    }
  })
}
