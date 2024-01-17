import React from 'react'
import { Input as FormilyInput } from '@formily/semi'
import { createBehavior, createResource } from '@designable/core'
import { DnFC } from '@designable/react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import { GlobalRegistry } from '@designable/core'
import { GlobalBOFieldProps } from '@designable/core'

export const Input: DnFC<React.ComponentProps<typeof FormilyInput>> =
  FormilyInput

Input.Behavior = createBehavior(
  {
    name: 'Input',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Input',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.Input),
    },
    designerLocales: AllLocales.Input,
  },
  {
    name: 'Input.TextArea',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Input.TextArea',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.Input.TextArea),
    },
    designerLocales: AllLocales.TextArea,
  }
)

Input.Resource = createResource(
  {
    icon: 'InputSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          type: 'string',
          title: 'Input',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
      },
    ],
  },
  {
    icon: 'TextAreaSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          type: 'string',
          title: 'TextArea',
          'x-decorator': 'FormItem',
          'x-component': 'Input.TextArea',
        },
      },
    ],
  }
)

GlobalRegistry.registerBOTransfer({
  adaptive(node) {
    return Input.Behavior[0].selector(node)
  },
  transform(node, root) {
    return GlobalBOFieldProps.transform(node, root, {
      type: 'varchar',
      precision: 64,
    })
  },
})

GlobalRegistry.registerBOTransfer({
  adaptive(node) {
    return Input.Behavior[1].selector(node)
  },
  transform(node, root) {
    return GlobalBOFieldProps.transform(node, root, { type: 'text' })
  },
})
