import { IEngineProps } from '../types'
import { ITreeNode, TreeNode } from './TreeNode'
import { Workbench } from './Workbench'
import { Cursor } from './Cursor'
import { Keyboard } from './Keyboard'
import { Screen, ScreenType } from './Screen'
import { Event, uid, globalThisPolyfill } from '@clearx/designable-shared'
import { BoSchema, BusinessObject } from './BusinessObject'
import { Dictionary } from './Dictionary'

/**
 * 设计器引擎
 */
export class Engine extends Event {
  id: string

  props: IEngineProps<Engine>

  cursor: Cursor

  workbench: Workbench

  keyboard: Keyboard

  screen: Screen

  bo: BusinessObject

  dictionary: Dictionary[]

  constructor(props: IEngineProps<Engine>) {
    super(props)
    this.props = {
      ...Engine.defaultProps,
      ...props,
    }
    this.init()
    this.id = uid()
    this.bo = new BusinessObject(this)
    this.dictionary = []
  }

  init() {
    this.workbench = new Workbench(this)
    this.screen = new Screen(this)
    this.cursor = new Cursor(this)
    this.keyboard = new Keyboard(this)
  }

  setCurrentTree(tree?: ITreeNode) {
    if (this.workbench.currentWorkspace) {
      this.workbench.currentWorkspace.operation.tree.from(tree)
    }
  }

  getCurrentTree() {
    return this.workbench?.currentWorkspace?.operation?.tree
  }

  setBoTree(schema?: BoSchema) {
    this.bo.from(schema)
  }

  getBoTree() {
    return this.bo.root
  }

  getBoSchema() {
    return this.bo.toBoSchema()
  }

  setDictionary(dictionary: Dictionary[]) {
    this.dictionary = dictionary
  }

  getDictionary() {
    return this.dictionary
  }

  getAllSelectedNodes() {
    let results: TreeNode[] = []
    for (let i = 0; i < this.workbench.workspaces.length; i++) {
      const workspace = this.workbench.workspaces[i]
      results = results.concat(workspace.operation.selection.selectedNodes)
    }
    return results
  }

  findNodeById(id: string) {
    return TreeNode.findById(id)
  }

  findMovingNodes(): TreeNode[] {
    const results = []
    this.workbench.eachWorkspace((workspace) => {
      workspace.operation.moveHelper.dragNodes?.forEach((node) => {
        if (!results.includes(node)) {
          results.push(node)
        }
      })
    })
    return results
  }

  createNode(node: ITreeNode, parent?: TreeNode) {
    return new TreeNode(node, parent)
  }

  mount() {
    this.attachEvents(globalThisPolyfill)
  }

  unmount() {
    this.detachEvents()
  }

  static defaultProps: IEngineProps<Engine> = {
    shortcuts: [],
    effects: [],
    drivers: [],
    rootComponentName: 'Root',
    sourceIdAttrName: 'data-designer-source-id',
    nodeIdAttrName: 'data-designer-node-id',
    contentEditableAttrName: 'data-content-editable',
    contentEditableNodeIdAttrName: 'data-content-editable-node-id',
    clickStopPropagationAttrName: 'data-click-stop-propagation',
    nodeSelectionIdAttrName: 'data-designer-node-helpers-id',
    nodeDragHandlerAttrName: 'data-designer-node-drag-handler',
    screenResizeHandlerAttrName: 'data-designer-screen-resize-handler',
    nodeResizeHandlerAttrName: 'data-designer-node-resize-handler',
    outlineNodeIdAttrName: 'data-designer-outline-node-id',
    boNodeIdAttrName: 'data-designer-bo-node-id',
    nodeTranslateAttrName: 'data-designer-node-translate-handler',
    defaultScreenType: ScreenType.PC,
  }
}
