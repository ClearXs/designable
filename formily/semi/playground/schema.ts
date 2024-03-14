export default {
  type: 'object',
  properties: {
    'field-group': {
      type: 'void',
      'x-component': 'CollapseItem',
      properties: {
        query: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
      },
    },
  },
}
