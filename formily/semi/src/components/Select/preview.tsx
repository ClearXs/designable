import React from 'react'
import { Select as FormilySelect } from '@clearx/formily-semi'
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

export const Select: DnFC<React.ComponentProps<typeof FormilySelect>> =
  FormilySelect

Select.Behavior = createBehavior({
  name: 'Select',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Select',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Select),
  },
  designerLocales: AllLocales.Select,
})

Select.Resource = createResource({
  icon: 'SelectSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: 'Select',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
      },
    },
  ],
})

GlobalRegistry.registerBOTransfer({
  adaptive(node) {
    return node.props['x-component'] === 'Select'
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
