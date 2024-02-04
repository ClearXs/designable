export const Select = {
  'zh-CN': {
    title: '选择框',
    settings: {
      'x-component-props': {
        multiple: '多选',
        dataSet: '可选项',
        filter: '是否可搜索',
        borderless: '无边框模式',
        autoAdjustOverflow: {
          title: '是否自动调整方向',
          tooltip:
            '浮层被遮挡时是否自动调整方向（暂时仅支持竖直方向，且插入的父级为 body）',
        },
        autoClearSearchValue: {
          title: '是否自动清空搜索关键字',
          tooltip:
            '选中选项后，是否自动清空搜索关键字，当 mutilple、filter 都开启时生效）',
        },
        defaultOpen: '默认展开',
        filterOption: '选项筛选器',
        filterSort: '选项排序器',
        labelInValue: {
          title: '标签值',
          tooltip:
            '是否把每个选项的 label 包装到 value 中，会把 Select 的 value 类型从 string 变为 { value: string, label: ReactNode } 的格式',
        },
        listHeight: '弹窗滚动高度',
        maxTagCount: {
          title: '最多标签数量',
          tooltip: '最多显示多少个 tag，响应式模式会对性能产生损耗',
        },
        maxTagPlaceholder: {
          title: '最多标签占位',
          tooltip: '隐藏 tag 时显示的内容',
        },
        maxTagTextLength: '最多标签文本长度',
        showArrow: '显示箭头',
        virtual: '开启虚拟滚动',
      },
    },
  },
  'en-US': {
    title: 'Select',
    settings: {
      'x-component-props': {
        multiple: 'Multiple',
        borderless: 'Borderless',
        autoAdjustOverflow: 'Dropdown Match Select Width',
        autoClearSearchValue: 'autoClearSearchValue',
        defaultOpen: 'Default Open',
        filterOption: 'Filter Option',
        filterSort: 'Filter Sort',
        labelInValue: 'label InValue',
        listHeight: 'List Height',
        maxTagCount: 'Max Tag Count',
        maxTagPlaceholder: {
          title: 'Max Tag Placeholder',
          tooltip: 'Content displayed when tag is hidden',
        },
        maxTagTextLength: 'Max Tag Text Length',
        showArrow: 'Show Arrow',
        virtual: 'Use Virtual Scroll',
      },
    },
  },
}
