import React from 'react'
import { TimePicker as FormilyTimePicker } from '@formily/semi'
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

export const TimePicker: DnFC<React.ComponentProps<typeof FormilyTimePicker>> =
  FormilyTimePicker

TimePicker.Behavior = createBehavior(
  {
    name: 'TimePicker',
    extends: ['Field'],
    selector: (node) =>
      node.props['x-component'] === 'TimePicker' &&
      node.props['x-component-props']?.['type'] === undefined,
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.TimePicker),
    },
    designerLocales: AllLocales.TimePicker,
  },
  {
    name: 'TimePicker.RangePicker',
    extends: ['Field'],
    selector: (node) => {
      return (
        node.props['x-component'] === 'TimePicker' &&
        node.props['x-component-props']?.['type'] === 'timeRange'
      )
    },
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.TimePicker.RangePicker),
    },
    designerLocales: AllLocales.TimeRangePicker,
  }
)

TimePicker.Resource = createResource(
  {
    icon: 'TimePickerSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          type: 'string',
          title: 'TimePicker',
          'x-decorator': 'FormItem',
          'x-component': 'TimePicker',
        },
      },
    ],
  },
  {
    icon: 'TimeRangePickerSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          type: 'string[]',
          title: 'TimeRangePicker',
          'x-decorator': 'FormItem',
          'x-component': 'TimePicker',
          'x-component-props': {
            type: 'timeRange',
          },
        },
      },
    ],
  }
)

GlobalRegistry.registerBOTransfer({
  adaptive(node) {
    return node.props['x-component'] === 'TimePicker'
  },
  transform(node, root) {
    return GlobalBOFieldProps.transform(node, root, {
      attrType: 'field',
      type: 'date',
      icon: 'DateType',
    })
  },
})
