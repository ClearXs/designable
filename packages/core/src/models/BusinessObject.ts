import { isArr } from '@designable/shared'
import { define, observable } from '@formily/reactive'
import { Engine } from './Engine'
import { TreeNode } from './TreeNode'
import { FromNodeEvent, RemoveNodeEvent, RootNodeCreateEvent } from '../events'

export type BOSchema = {
  id?: string
  key?: string
  type?: FieldType
  parentId?: string
  depth?: number
  icon?: string
  precision?: number
  scala?: number
  children?: BOSchema[]
}

export type BoDataSource = {
  label?: string
  value?: string
  title?: string
  key?: string
  text?: string
  children?: BoDataSource
  [key: string]: any
}

export class BusinessObject {
  id: string
  root?: BoNode

  constructor(private engine: Engine) {
    this.engine.subscribeTo(RootNodeCreateEvent, (event) => {
      const treeNodeRoot = event.data.source as TreeNode
      const root =
        treeNodeRoot &&
        GlobalBOTransferRegistry.getHandler(treeNodeRoot)?.transform(
          treeNodeRoot,
          undefined
        )
      if (root) {
        this.root = root
      }
    })

    this.engine.subscribeTo(RemoveNodeEvent, (event) => {
      const removeNode = (treeNode) => {
        const parent = treeNode.parent
        const parentNode = parent && this.root.find(parent.id)
        parentNode && parentNode.remove(treeNode.id)
      }
      const { target } = event.data
      if (isArr(target)) {
        target.forEach((tn) => removeNode(tn))
      } else {
        removeNode(target)
      }
    })

    this.engine.subscribeTo(FromNodeEvent, (event) => {
      const { source, target } = event.data
      if (source.id && source.id !== target.id) {
        target.id = source.id
      }
      const node = GlobalBOTransferRegistry.getHandler(
        source as TreeNode
      )?.transform(target, this.root)
      if (node && node.root) {
        this.root = node
      } else {
        node && this.append(node)
      }
    })
  }

  append(boNode: BoNode) {
    const node = this.root?.find(boNode.parentId)
    node?.add(boNode)
  }
}

export class BoNode {
  id: string
  key: string
  type: FieldType
  parentId: string
  depth?: number
  icon?: string
  precision?: number
  scala?: number
  treeNode: TreeNode
  children: BoNode[] = []

  constructor() {
    this.makeObservable()
  }

  get root() {
    return this.depth === 0
  }

  get leaf() {
    return !this.children || this.children.length < 0
  }

  get name() {
    return this.treeNode?.props?.['title'] || this.treeNode?.getMessage('title')
  }

  /**
   * 根据id获取BoNode实例，不断递归子结点
   * @param id bo id
   * @returns BoNode or undefined
   */
  find(id: string): BoNode | undefined {
    if (Object.is(this.id, id)) {
      return this
    }
    if (this.children && this.children.length > 0) {
      return this.children.find((chiNode) => chiNode.find(id))
    }
    return undefined
  }

  /**
   * 根据chiId获取BoNode
   * @param chiId chiId
   */
  findByChiId(chiId: string): BoNode | undefined {
    if (!this.children || this.children.length < 0) {
      return undefined
    }
    return this.children.find((chiNode) => {
      if (chiNode.id === chiId) {
        return chiNode
      }
      return chiNode.findByChiId(chiId)
    })
  }

  /**
   * 当前bo对象添加子结点
   * @param boNode bonode
   */
  add(boNode: BoNode) {
    const chiNode = this.children.find((chiNode) => chiNode.id === boNode.id)
    if (chiNode) {
      chiNode['treeNode'] = boNode['treeNode']
    } else {
      boNode['depth'] = this.depth + 1
      boNode['parentId'] = this.id
      this.children.push(boNode)
    }
  }

  /**
   * 根据子结点的id移除子结点的信息
   * @param chiId
   */
  remove(chiId: string): boolean {
    if (!this.children || this.children.length < 0) {
      return false
    }
    this.children = this.children.filter((chiNode) => {
      return chiNode.id !== chiId
    })
  }

  hasChildren(): boolean {
    return this.children && this.children.length > 0
  }

  /**
   * 返回dataSource数据
   * @param bos bo对象集
   * @returns
   */
  get dataSource(): BoDataSource[] {
    return this.recursiveDataSource([this])
  }

  private recursiveDataSource(bos?: BoNode[]): BoDataSource[] {
    return bos.map((bo) => {
      const name = bo.name
      return {
        value: bo.key,
        label: name,
        title: name,
        text: name,
        key: bo.key,
        disabled: bo.root === true,
        children: bo.recursiveDataSource(bo.children),
      }
    })
  }

  makeObservable() {
    define(this, {
      name: observable.computed,
      children: observable.shallow,
      dataSource: observable.computed,
    })
  }
}

export type FieldType =
  | 'bigint'
  | 'smallint'
  | 'int'
  | 'number'
  | 'double'
  | 'float'
  | 'decimal'
  | 'time'
  | 'timestamp'
  | 'date'
  | 'char'
  | 'varchar'
  | 'text'
  | 'bool'
  | 'object'
  | 'array'
  | 'table'

export type Transfer = {
  adaptive: (node: TreeNode) => boolean
  transform: (node: TreeNode, root?: BoNode) => BoNode
}

export type FieldProps = {
  icon: BoNode['icon']
  type: BoNode['type']
  transform: (
    node: TreeNode,
    boRoot?: BoNode,
    defaultProps?: Partial<BoNode>
  ) => BoNode
  /**
   * 以Bo root寻找，不断递归treeNode的paren
   * @param treeNode treeNode
   */
  findParentId: (treeNode: TreeNode, boRoot?: BoNode) => string
}

export const GlobalBOFieldProps: FieldProps = {
  icon: 'Help',
  type: 'varchar',
  findParentId(treeNode, root) {
    const boNode = root?.find(treeNode.id)
    if (boNode) return boNode.id
    if (treeNode.isRoot) {
      return treeNode.id
    }
    return GlobalBOFieldProps.findParentId(treeNode.parent, root)
  },
  transform(node, boRoot, defaultProps) {
    const boNode = new BoNode()
    boNode.id = node.id
    boNode.key = node.id
    boNode.type = defaultProps.type || GlobalBOFieldProps.type
    boNode.icon = defaultProps.icon || GlobalBOFieldProps.icon
    boNode.parentId = GlobalBOFieldProps.findParentId(node, boRoot)
    boNode.precision = defaultProps.precision
    boNode.scala = defaultProps.scala
    boNode.depth = node.depth
    boNode.treeNode = node
    if (node.children && node.children.length > 0) {
      boNode.children = node.children
        .filter((chi) => GlobalBOTransferRegistry.getHandler(chi))
        .map((chi) => GlobalBOTransferRegistry.getHandler(chi).transform(chi))
    }
    return boNode
  },
}

class BOTransferRegistry {
  private transfers: Transfer[]

  constructor() {
    this.transfers = []
  }

  register(...transfer: Transfer[]) {
    if (transfer && transfer.length > 0) {
      this.transfers.push(...transfer)
    }
  }

  getHandler(node: TreeNode): Transfer | undefined {
    return this.transfers.find((handler) => handler.adaptive(node))
  }
}

export const GlobalBOTransferRegistry = new BOTransferRegistry()

export const RootTransfer: Transfer = {
  adaptive: function (node: TreeNode): boolean {
    return node.componentName === 'Form'
  },
  transform: function (node, boRoot): BoNode {
    return GlobalBOFieldProps.transform(node, boRoot, {
      depth: 0,
      type: 'table',
    })
  },
}

GlobalBOTransferRegistry.register(RootTransfer)
