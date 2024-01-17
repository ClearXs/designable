import { BusinessObject, TreeNode } from '@designable/core'
import { onFieldReact } from '@formily/core'

export const useBoDataSource = (node: TreeNode, bo: BusinessObject) => {
  onFieldReact('name', (field) => {
    if (!node.props['name']) {
      node.props['name'] = node.bo?.id
    }
    field['dataSource'] = bo.root?.dataSource
  })
}
