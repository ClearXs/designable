import React from 'react'
import { Checkbox as FormilyCheckbox } from '@clearx/formily-semi'
import {
  GlobalBOFieldProps,
  GlobalRegistry,
  createBehavior,
  createResource,
} from '@clearx/designable-core'
import { DnFC } from '@clearx/designable-react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export const Checkbox: DnFC<React.ComponentProps<typeof FormilyCheckbox>> =
  FormilyCheckbox

Checkbox.Behavior = createBehavior({
  name: 'Checkbox.Group',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Checkbox.Group',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Checkbox.Group),
  },
  designerLocales: AllLocales.CheckboxGroup,
})

Checkbox.Resource = createResource({
  icon: 'CheckboxGroupSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'Array<string | number>',
        title: 'Checkbox Group',
        'x-decorator': 'FormItem',
        'x-component': 'Checkbox.Group',
        enum: [
          { label: '选项1', value: 1 },
          { label: '选项2', value: 2 },
        ],
      },
    },
  ],
})

GlobalRegistry.registerBOTransfer({
  adaptive(node) {
    return node.props['x-component'] === 'Checkbox.Group'
  },
  transform(node, root) {
    return GlobalBOFieldProps.transform(node, root, {
      precision: 64,
      attrType: 'field',
      type: 'varchar',
      icon: 'StringType',
    })
  },
})
