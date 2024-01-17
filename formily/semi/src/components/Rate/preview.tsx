import React from 'react'
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
import { Rating } from '@douyinfe/semi-ui'
import { connect, mapProps } from '@formily/react'

export const SemiRate = connect(
  Rating,
  mapProps({
    onInput: 'onChange',
    value: 'value',
  })
)

export const Rate: DnFC<React.ComponentProps<typeof SemiRate>> = SemiRate

Rate.Behavior = createBehavior({
  name: 'Rate',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Rate',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Rate),
  },
  designerLocales: AllLocales.Rate,
})

Rate.Resource = createResource({
  icon: 'RateSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'number',
        title: 'Rate',
        'x-decorator': 'FormItem',
        'x-component': 'Rate',
      },
    },
  ],
})

GlobalRegistry.registerBOTransfer({
  adaptive(node) {
    return node.props['x-component'] === 'Rate'
  },
  transform(node, root) {
    return GlobalBOFieldProps.transform(node, root, {
      type: 'number',
      precision: 12,
      scala: 2,
    })
  },
})
