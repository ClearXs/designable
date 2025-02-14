import React, { useMemo, useState } from 'react'
import {
  Designer,
  DesignerToolsWidget,
  ViewToolsWidget,
  Workspace,
  OutlineTreeWidget,
  ResourceWidget,
  HistoryWidget,
  StudioPanel,
  CompositePanel,
  WorkspacePanel,
  ToolbarPanel,
  ViewportPanel,
  ViewPanel,
  SettingsPanel,
  ComponentTreeWidget,
  BOWidget,
} from '@clearx/designable-react'
import {
  SettingsForm,
  setNpmCDNRegistry,
} from '@clearx/designable-react-settings-form'
import {
  createDesigner,
  GlobalRegistry,
  Shortcut,
  KeyCode,
} from '@clearx/designable-core'
import {
  LogoWidget,
  ActionsWidget,
  PreviewWidget,
  SchemaEditorWidget,
  MarkupSchemaWidget,
} from './widgets'
import { saveSchema } from './service'
import {
  Form,
  Field,
  Input,
  Select,
  TreeSelect,
  Cascader,
  Radio,
  Checkbox,
  NumberPicker,
  Transfer,
  Password,
  DatePicker,
  TimePicker,
  Upload,
  Switch,
  Text,
  Card,
  ArrayCards,
  ObjectContainer,
  ArrayTable,
  Space,
  FormTab,
  FormCollapse,
  FormLayout,
  FormGrid,
  Rate,
  Slider,
} from '../src'
import { BoSchemaEditorWidget } from './widgets/BoSchemaEditorWidget'
import { TabPane, Tabs } from '@douyinfe/semi-ui'
import DataForm from './DataForm'
import { createRoot } from 'react-dom/client'
window.React = React

setNpmCDNRegistry('//unpkg.com')

GlobalRegistry.registerDesignerLocales({
  'zh-CN': {
    sources: {
      Inputs: '输入控件',
      Layouts: '布局组件',
      Arrays: '自增组件',
      Displays: '展示组件',
      Advanced: '高级组件',
    },
  },
  'en-US': {
    sources: {
      Inputs: 'Inputs',
      Layouts: 'Layouts',
      Arrays: 'Arrays',
      Displays: 'Displays',
      Advanced: 'Advanced',
    },
  },
  'ko-KR': {
    sources: {
      Inputs: '입력',
      Layouts: '레이아웃',
      Arrays: '배열',
      Displays: '디스플레이',
    },
  },
})

const App = () => {
  const engine = useMemo(
    () =>
      createDesigner({
        shortcuts: [
          new Shortcut({
            codes: [
              [KeyCode.Meta, KeyCode.S],
              [KeyCode.Control, KeyCode.S],
            ],
            handler(ctx) {
              saveSchema(ctx.engine)
            },
          }),
        ],
        rootComponentName: 'Form',
      }),
    [],
  )

  const [mode, setMode] = useState<string>('designer')

  const DesignerPanel = (
    <>
      <CompositePanel>
        <CompositePanel.Item title="panels.Component" icon="Component">
          <ResourceWidget
            title="sources.Inputs"
            sources={[
              Input,
              Password,
              NumberPicker,
              Select,
              TreeSelect,
              Cascader,
              Transfer,
              Checkbox,
              Radio,
              Rate,
              DatePicker,
              TimePicker,
              Upload,
              Switch,
              ObjectContainer,
              Slider,
            ]}
          />
          <ResourceWidget
            title="sources.Layouts"
            sources={[Card, FormGrid, FormTab, FormLayout, FormCollapse, Space]}
          />
          <ResourceWidget
            title="sources.Arrays"
            sources={[ArrayCards, ArrayTable]}
            // sources={[]}
          />
          <ResourceWidget title="sources.Displays" sources={[]} />
          <ResourceWidget title="sources.Advanced" sources={[]} />
        </CompositePanel.Item>
        <CompositePanel.Item title="panels.OutlinedTree" icon="Outline">
          <OutlineTreeWidget />
        </CompositePanel.Item>
        <CompositePanel.Item title="panels.History" icon="History">
          <HistoryWidget />
        </CompositePanel.Item>
        <CompositePanel.Item title="panels.Model" icon="Database">
          <BOWidget />
        </CompositePanel.Item>
      </CompositePanel>
      <Workspace id="form">
        <WorkspacePanel>
          <ToolbarPanel>
            <DesignerToolsWidget />
            <ViewToolsWidget
              use={['DESIGNABLE', 'JSONTREE', 'MARKUP', 'PREVIEW', 'BOTREE']}
            />
          </ToolbarPanel>
          <ViewportPanel style={{ height: '100%' }}>
            <ViewPanel type="DESIGNABLE">
              {() => (
                <ComponentTreeWidget
                  components={{
                    Form,
                    Field,
                    Input,
                    Select,
                    TreeSelect,
                    Cascader,
                    Radio,
                    Checkbox,
                    NumberPicker,
                    Transfer,
                    Password,
                    DatePicker,
                    TimePicker,
                    Upload,
                    Switch,
                    Text,
                    Card,
                    ArrayCards,
                    ArrayTable,
                    Space,
                    FormTab,
                    FormCollapse,
                    FormGrid,
                    FormLayout,
                    ObjectContainer,
                    Rate,
                    Slider,
                  }}
                />
              )}
            </ViewPanel>
            <ViewPanel type="JSONTREE" scrollable={false}>
              {(tree, bo, onChange) => (
                <SchemaEditorWidget tree={tree} onChange={onChange} />
              )}
            </ViewPanel>
            <ViewPanel type="BOTREE" scrollable={false}>
              {(tree, bo, onChange) => (
                <BoSchemaEditorWidget bo={bo} onChange={onChange} />
              )}
            </ViewPanel>
            <ViewPanel type="MARKUP" scrollable={false}>
              {(tree) => <MarkupSchemaWidget tree={tree} />}
            </ViewPanel>
            <ViewPanel type="PREVIEW">
              {(tree) => <PreviewWidget tree={tree} />}
            </ViewPanel>
          </ViewportPanel>
        </WorkspacePanel>
      </Workspace>
      <SettingsPanel title="panels.PropertySettings">
        <SettingsForm />
      </SettingsPanel>
    </>
  )

  const PagePanel = (
    <>
      <Workspace id="form">
        <WorkspacePanel>
          <ViewportPanel>
            <ViewPanel type="CUSTOM">{() => <div>PagePanel</div>}</ViewPanel>
          </ViewportPanel>
        </WorkspacePanel>
      </Workspace>
      <SettingsPanel title="panels.PropertySettings">
        <DataForm />
      </SettingsPanel>
    </>
  )

  const PageDeployPanel = (
    <>
      <ViewportPanel>
        <ViewPanel type="CUSTOM">{() => <div>PageDeployPanel</div>}</ViewPanel>
      </ViewportPanel>
      <SettingsPanel></SettingsPanel>
    </>
  )

  let Panel
  if (mode === 'designer') {
    Panel = DesignerPanel
  } else if (mode === 'page') {
    Panel = PagePanel
  } else if (mode === 'deploy') {
    Panel = PageDeployPanel
  }

  return (
    <Designer engine={engine}>
      <StudioPanel
        logo={<LogoWidget />}
        body={
          <Tabs
            activeKey={mode}
            onTabClick={(key) => {
              setMode(key)
              if (key === 'page') {
                engine.workbench.type = 'CUSTOM_DESIGNABLE'
              } else if (key === 'designer') {
                engine.workbench.type = 'DESIGNABLE'
              } else if (key === 'deploy') {
                engine.workbench.type = 'CUSTOM'
              }
            }}
          >
            <TabPane tab="表单设计" itemKey="designer" />
            <TabPane tab="页面设置" itemKey="page" />
            <TabPane tab="页面发布" itemKey="deploy" />
          </Tabs>
        }
        actions={<ActionsWidget />}
      >
        {Panel}
      </StudioPanel>
    </Designer>
  )
}

createRoot(document.getElementById('root')).render(<App />)
