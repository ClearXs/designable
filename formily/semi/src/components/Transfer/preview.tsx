import React from 'react'
import { Transfer as FormilyTransfer } from '@formily/semi'
import {
  GlobalBOFieldProps,
  GlobalRegistry,
  createBehavior,
  createResource,
} from '@designable/core'
import { DnFC } from '@designable/react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const Transfer: DnFC<React.ComponentProps<typeof FormilyTransfer>> =
  FormilyTransfer

Transfer.Behavior = createBehavior({
  name: 'Transfer',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Transfer',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Transfer),
  },
  designerLocales: AllLocales.Transfer,
})

Transfer.Resource = createResource({
  icon: 'TransferSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: 'Transfer',
        'x-decorator': 'FormItem',
        'x-component': 'Transfer',
      },
    },
  ],
})

GlobalRegistry.registerBOTransfer({
  adaptive(node) {
    return node.props['x-component'] === 'Transfer'
  },
  transform(node, root) {
    return GlobalBOFieldProps.transform(node, root, {
      attrType: 'field',
      type: 'array',
      icon: 'ArrayType',
    })
  },
})
