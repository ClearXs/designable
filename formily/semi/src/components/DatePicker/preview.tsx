import React from 'react'
import { DatePicker as FormilyDatePicker } from '@formily/semi'
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

export const DatePicker: DnFC<React.ComponentProps<typeof FormilyDatePicker>> =
  FormilyDatePicker

DatePicker.Behavior = createBehavior(
  {
    name: 'DatePicker',
    extends: ['Field'],
    selector: (node) =>
      node.props['x-component'] === 'DatePicker' &&
      node.props['x-component-props']?.['type'] === undefined,
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.DatePicker),
    },
    designerLocales: AllLocales.DatePicker,
  },
  {
    name: 'DatePicker.RangePicker',
    extends: ['Field'],
    selector: (node) =>
      node.props['x-component'] === 'DatePicker' &&
      node.props['x-component-props']?.['type'] === 'dateTimeRange',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.DatePicker.RangePicker),
    },
    designerLocales: AllLocales.DateRangePicker,
  }
)

DatePicker.Resource = createResource(
  {
    icon: 'DatePickerSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          type: 'string',
          title: 'DatePicker',
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
        },
      },
    ],
  },
  {
    icon: 'DateRangePickerSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          type: 'string[]',
          title: 'DateRangePicker',
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
          'x-component-props': {
            type: 'dateTimeRange',
          },
        },
      },
    ],
  }
)

GlobalRegistry.registerBOTransfer({
  adaptive(node) {
    return node.props['x-component'] === 'DatePicker'
  },
  transform(node, root) {
    return GlobalBOFieldProps.transform(node, root, {
      type: 'date',
      attrType: 'field',
      icon: 'DateType',
    })
  },
})
