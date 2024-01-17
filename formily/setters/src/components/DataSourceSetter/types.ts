export interface IDataSourceItem {
  label?: ''
  value?: any
  children?: any[]
}

export interface INodeItem {
  key: string
  duplicateKey?: string
  map?: { label: string; value: any }[]
  children?: INodeItem[]
  [key: string]: any
}

export interface ITreeDataSource {
  dataSource: INodeItem[]
  selectedKey: string
}
