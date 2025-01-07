import React from 'react'
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
import { Slider as SemiSlider } from '@douyinfe/semi-ui'
import { connect, mapProps } from '@formily/react'

export const Sliding = connect(
  SemiSlider,
  mapProps({
    onInput: 'onChange',
    value: 'value',
  }),
)

export const Slider: DnFC<React.ComponentProps<typeof Sliding>> = Sliding

Slider.Behavior = createBehavior({
  name: 'Slider',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Slider',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Slider),
  },
  designerLocales: AllLocales.Slider,
})

Slider.Resource = createResource({
  icon: 'SliderSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'number',
        title: 'Slider',
        'x-decorator': 'FormItem',
        'x-component': 'Slider',
      },
    },
  ],
})

GlobalRegistry.registerBOTransfer({
  adaptive(node) {
    return node.props['x-component'] === 'Slider'
  },
  transform(node, root) {
    return GlobalBOFieldProps.transform(node, root, {
      precision: 12,
      scala: 2,
      attrType: 'field',
      type: 'number',
      icon: 'NumberType',
    })
  },
})
