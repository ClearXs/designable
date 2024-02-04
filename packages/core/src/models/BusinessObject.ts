import { isArr, uid } from '@designable/shared'
import { define, observable } from '@formily/reactive'
import { Engine } from './Engine'
import { TreeNode } from './TreeNode'
import { FromNodeEvent, RemoveNodeEvent, RootNodeCreateEvent } from '../events'
import { ISchema } from '@formily/json-schema'

export type AttrType = 'table' | 'field'

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

export type IconType =
  | 'NumberType'
  | 'StringType'
  | 'DateType'
  | 'BoolType'
  | 'ArrayType'
  | 'JSONType'
  | 'TextType'
  | 'ImageType'
  | 'AudioType'
  | 'TableType'

export type BoSchema = {
  // bo id
  id: string
  // bo code
  code: string
  // bo name
  name: string
  // attr schema
  attrs: BoAttrSchema[]
}

export type BoAttrSchema = {
  // bo id
  id: string
  // bo key
  key: string
  // bo name
  name?: string
  // bo是否是root
  root?: boolean
  // bo是否是leaf
  leaf?: boolean
  // attr type
  attrType: AttrType
  // bo type
  type: FieldType
  // bo parentId
  parentId: string
  // bo depth
  depth?: number
  // bo icon
  icon?: IconType
  // bo precision
  precision?: number
  // bo scala
  scala?: number
  // bo props即Schema props
  props: ISchema
  // 是否与TreeNode进行绑定
  binding: boolean
  // bo attr span
  span?: number
  // bo attr的生命周期
  lifecycle: 'temporary' | 'persistent'
  // 子
  children?: BoAttrSchema[]
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
  // bo id
  id: string
  // bo code
  code?: string
  // bo name
  name?: string
  // attr root
  root?: BoNode

  constructor(private engine: Engine) {
    this.id = uid()
    this.code = uid()
    this.name = uid()
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
        const parentNode = parent && this.root.find('id', parent.id)
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
      if (node?.isRoot() && this.root) {
        this.root.treeNode = node.treeNode
        this.root.treeNode.id = this.root.id
        this.displaceInnerAttribute(this.root.schema, node.treeNode)
      } else {
        node && this.append(node)
      }
    })
  }

  /**
   * 如果当前boNode已经存在，那么把对应的TreeNode进行赋值，否则加入到BoTree中
   * @param boNode boNode
   */
  public append(boNode: BoNode) {
    const node = this.root?.find('id', boNode.id)
    if (node) {
      node.treeNode = boNode.treeNode
      this.displaceInnerAttribute(node.schema, node.treeNode)
    } else {
      const parentNode = this.root?.find('id', boNode.parentId)
      parentNode?.add(boNode)
    }
  }

  /**
   * 基于某个BoSchema创建BoTree
   * @param boSchema boSchema
   */
  public from(boSchema?: BoSchema) {
    this.id = boSchema?.id || this.id
    this.code = boSchema?.code || this.code
    this.name = boSchema?.name || this.name
    if (boSchema?.attrs) {
      // TODO 目前取数组中是root的attr，如果不是则不会进行赋值
      const attr = boSchema.attrs.find((attr) => attr.root)
      if (attr) {
        this.root = BusinessObject.toBoNode(attr, undefined, (boNode) => {
          if (this.root) {
            const oldNode = this.root.find('id', boNode.id)
            if (oldNode) {
              boNode.treeNode = oldNode.treeNode
              // 替换属性
              this.displaceInnerAttribute(boNode.schema, oldNode.treeNode)
            }
          }
          return boNode
        })
      }
    }
  }

  public toBoSchema(): BoSchema {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      attrs: [BusinessObject.toBoAttrSchema(this.root)],
    }
  }

  /**
   * 替换内部结点的属性
   * name
   */
  public displaceInnerAttribute(boAttr?: BoAttrSchema, treeNode?: TreeNode) {
    if (treeNode) {
      treeNode.props['title'] = boAttr?.name
      if (boAttr?.id) {
        treeNode.setCacheId(boAttr.id)
      }
    }
  }

  private static toBoNode(
    attrSchema: BoAttrSchema,
    parent?: BoNode,
    map?: (boNode: BoNode) => BoNode
  ): BoNode {
    const boNode = new BoNode()
    boNode.id = attrSchema.id
    boNode.key = attrSchema.key
    boNode.attrType = attrSchema.attrType
    boNode.type = attrSchema.type
    boNode.depth = attrSchema.depth
    boNode.parentId = attrSchema.parentId
    boNode.icon = attrSchema.icon
    boNode.precision = attrSchema.precision
    boNode.scala = attrSchema.scala
    boNode.schema = attrSchema
    boNode.parent = parent
    boNode.lifecycle = 'persistent'
    boNode.children = attrSchema.children?.map((attr) =>
      BusinessObject.toBoNode(attr, boNode, map)
    )
    return map?.(boNode) || boNode
  }

  public static toBoAttrSchema(boNode: BoNode): BoAttrSchema {
    return {
      id: boNode.id,
      key: boNode.key,
      attrType: boNode.attrType,
      type: boNode.type,
      depth: boNode.depth,
      parentId: boNode.parentId,
      name: boNode.name,
      root: boNode.isRoot(),
      leaf: boNode.isLeaf(),
      precision: boNode.precision,
      scala: boNode.scala,
      binding: boNode.binding(),
      span: boNode.span(),
      lifecycle: boNode.lifecycle,
      props: boNode.treeNode?.props || {},
      children: boNode.children?.map(BusinessObject.toBoAttrSchema),
    }
  }
}

export class BoNode {
  id: string
  key: string
  attrType: AttrType
  type: FieldType
  // bo生命周期，通过{@code #from} persistent方式，或者 {@code eventBus#FromNodeEvent} temporary
  lifecycle: 'temporary' | 'persistent'
  parent?: BoNode
  parentId: string
  depth?: number
  icon?: IconType
  precision?: number
  scala?: number
  schema?: BoAttrSchema
  treeNode: TreeNode
  children: BoNode[] = []

  constructor() {
    this.makeObservable()
  }

  get root() {
    if (this.isRoot()) {
      return this
    } else {
      return this.find('id', this.parentId)?.root()
    }
  }

  get name() {
    return (
      this.treeNode?.props?.['title'] ||
      this.treeNode?.getMessage('title') ||
      this.schema?.name
    )
  }

  isLeaf() {
    return !this.children || this.children.length < 0
  }

  isRoot() {
    return this.depth === 0
  }

  binding() {
    return this.treeNode != null && this.treeNode !== undefined
  }

  span() {
    return undefined
  }

  /**
   * 返回dataSource数据
   * @param bos bo对象集
   * @returns
   */
  get dataSource(): BoDataSource[] {
    return this.recursiveDataSource([this])
  }

  get props() {
    return this.treeNode?.props
  }

  /**
   * 根据id获取BoNode实例，不断递归子结点
   * @param id bo id
   * @returns BoNode or undefined
   */
  find<K extends keyof BoNode>(key: K, value: BoNode[K]): BoNode | undefined {
    if (Object.is(this[key], value)) {
      return this
    }
    if (this.children && this.children.length > 0) {
      return this.children.find((chiNode) => chiNode.find(key, value))
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
      boNode['parent'] = this
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

  /**
   * 移除当前结点
   */
  removeThis(): boolean {
    return this.parent?.remove(this.id)
  }

  hasChildren(): boolean {
    return this.children && this.children.length > 0
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
        disabled: bo.isRoot() === true,
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

export type Transfer = {
  adaptive: (node: TreeNode) => boolean
  transform: (node: TreeNode, root?: BoNode) => BoNode
}

export type FieldProps = {
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
  findParentId(treeNode, root) {
    const boNode = root?.find('id', treeNode.id)
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
    boNode.attrType = defaultProps.attrType || (node.isRoot ? 'table' : 'field')
    boNode.type = defaultProps.type || 'varchar'
    boNode.icon =
      defaultProps.icon || (node.isRoot ? 'TableType' : 'StringType')
    boNode.parentId = node.isRoot
      ? undefined
      : GlobalBOFieldProps.findParentId(node, boRoot)
    boNode.precision = defaultProps.precision
    boNode.scala = defaultProps.scala
    boNode.depth = node.depth
    boNode.treeNode = node
    boNode.lifecycle = 'temporary'
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
      attrType: 'table',
    })
  },
}

GlobalBOTransferRegistry.register(RootTransfer)
