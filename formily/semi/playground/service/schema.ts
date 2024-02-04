import { Engine } from '@designable/core'
import {
  transformToSchema,
  transformToTreeNode,
} from '@designable/formily-transformer'
import { Notification } from '@douyinfe/semi-ui'

export const saveSchema = (designer: Engine) => {
  localStorage.setItem(
    'formily-schema',
    JSON.stringify(transformToSchema(designer.getCurrentTree()))
  )
  localStorage.setItem('formily-bo', JSON.stringify(designer.getBoSchema()))
  Notification.success({ content: 'Save Success' })
}

export const loadInitialSchema = (designer: Engine) => {
  try {
    designer.setDictionary([
      { id: '123', value: 'dic', label: 'dic', key: 'dic' },
    ])
    designer.setBoTree(JSON.parse(localStorage.getItem('formily-bo')))
    designer.setCurrentTree(
      transformToTreeNode(JSON.parse(localStorage.getItem('formily-schema')))
    )
  } catch {}
}
