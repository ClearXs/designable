import { Workspace } from './Workspace'
import { Engine } from './Engine'
import { TreeNode, ITreeNode } from './TreeNode'
import { Selection } from './Selection'
import { Hover } from './Hover'
import { TransformHelper } from './TransformHelper'
import { MoveHelper } from './MoveHelper'
import {
  cancelIdle,
  ICustomEvent,
  isFn,
  requestIdle,
} from '@clearx/designable-shared'
import { RootNodeCreateEvent } from '../events/mutation/RootNodeCreateEvent'

export interface IOperation {
  tree?: ITreeNode
  selected?: string[]
}

export class Operation {
  workspace: Workspace

  engine: Engine

  tree: TreeNode

  selection: Selection

  hover: Hover

  transformHelper: TransformHelper

  moveHelper: MoveHelper

  requests = {
    snapshot: null,
  }

  constructor(workspace: Workspace) {
    this.engine = workspace.engine
    this.workspace = workspace
    this.tree = new TreeNode({
      componentName: this.engine.props.rootComponentName,
      ...this.engine.props.defaultComponentTree,
      operation: this,
    })
    this.hover = new Hover({
      operation: this,
    })
    this.selection = new Selection({
      operation: this,
    })
    this.moveHelper = new MoveHelper({
      operation: this,
    })
    this.transformHelper = new TransformHelper({
      operation: this,
    })
    this.selection.select(this.tree)

    this.dispatch(
      new RootNodeCreateEvent({ source: this.tree, target: this.tree }),
    )
  }

  dispatch<T>(event: ICustomEvent, callback?: () => T) {
    if (this.workspace.dispatch(event) === false) return
    if (isFn(callback)) return callback()
  }

  snapshot(type?: string) {
    cancelIdle(this.requests.snapshot)
    if (
      !this.workspace ||
      !this.workspace.history ||
      this.workspace.history.locking
    )
      return
    this.requests.snapshot = requestIdle(() => {
      this.workspace.history.push(type)
    })
  }

  from(operation?: IOperation) {
    if (!operation) return
    if (operation.tree) {
      this.tree.from(operation.tree)
    }
    if (operation.selected) {
      this.selection.selected = operation.selected
    }
  }

  serialize(): IOperation {
    return {
      tree: this.tree.serialize(),
      selected: [this.tree.id],
    }
  }
}
