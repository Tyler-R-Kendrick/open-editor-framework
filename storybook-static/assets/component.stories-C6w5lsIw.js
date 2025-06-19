import{j as e}from"./jsx-runtime-DlRdbTK2.js";import{C as r}from"./component-CBA6SaWP.js";import"./iframe-B_meevF9.js";const c={title:"Components/ComponentPalette",component:r,tags:["autodocs"],argTypes:{theme:{control:{type:"select"},options:["light","dark"],description:"Visual theme for the component palette"},templateUrl:{control:{type:"text"},description:"URL to load component templates from"},"aria-label":{control:{type:"text"},description:"Accessibility label for the component palette"}},parameters:{docs:{description:{component:"A drag-and-drop component palette with external template loading capabilities. Displays available components for building interfaces with support for touch interactions, keyboard accessibility, and loading states."}}}},n={args:{theme:"light"},render:t=>e.jsx("div",{style:{height:"500px",width:"300px",border:"1px solid #e2e8f0"},children:e.jsx(r,{...t})})},s={args:{theme:"dark"},render:t=>e.jsx("div",{style:{height:"500px",width:"300px",border:"1px solid #475569",background:"#1e293b"},children:e.jsx(r,{...t})})},o={args:{theme:"light",templateUrl:"/assets/component-templates.json"},render:t=>e.jsx("div",{style:{height:"500px",width:"300px",border:"1px solid #e2e8f0"},children:e.jsx(r,{...t})})},a={args:{theme:"light",templateUrl:"/nonexistent-slow-url.json"},render:t=>e.jsx("div",{style:{height:"500px",width:"300px",border:"1px solid #e2e8f0"},children:e.jsx(r,{...t})})},i={args:{theme:"light",templateUrl:"/invalid-url-that-will-fail.json"},render:t=>e.jsx("div",{style:{height:"500px",width:"300px",border:"1px solid #e2e8f0"},children:e.jsx(r,{...t})})},l={args:{theme:"light","aria-label":"Custom Component Library"},render:t=>e.jsx("div",{style:{height:"500px",width:"300px",border:"1px solid #e2e8f0"},children:e.jsx(r,{...t})})},d={args:{theme:"light"},render:t=>e.jsx("div",{style:{height:"600px",width:"375px",border:"1px solid #e2e8f0",margin:"0 auto"},children:e.jsx(r,{...t})}),parameters:{viewport:{defaultViewport:"mobile1"}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'light'
  },
  render: args => <div style={{
    height: '500px',
    width: '300px',
    border: '1px solid #e2e8f0'
  }}>
      <ComponentPalette {...args} />
    </div>
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'dark'
  },
  render: args => <div style={{
    height: '500px',
    width: '300px',
    border: '1px solid #475569',
    background: '#1e293b'
  }}>
      <ComponentPalette {...args} />
    </div>
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'light',
    templateUrl: '/assets/component-templates.json'
  },
  render: args => <div style={{
    height: '500px',
    width: '300px',
    border: '1px solid #e2e8f0'
  }}>
      <ComponentPalette {...args} />
    </div>
}`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'light',
    templateUrl: '/nonexistent-slow-url.json' // This will trigger loading state briefly
  },
  render: args => <div style={{
    height: '500px',
    width: '300px',
    border: '1px solid #e2e8f0'
  }}>
      <ComponentPalette {...args} />
    </div>
}`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'light',
    templateUrl: '/invalid-url-that-will-fail.json'
  },
  render: args => <div style={{
    height: '500px',
    width: '300px',
    border: '1px solid #e2e8f0'
  }}>
      <ComponentPalette {...args} />
    </div>
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'light',
    'aria-label': 'Custom Component Library'
  },
  render: args => <div style={{
    height: '500px',
    width: '300px',
    border: '1px solid #e2e8f0'
  }}>
      <ComponentPalette {...args} />
    </div>
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'light'
  },
  render: args => <div style={{
    height: '600px',
    width: '375px',
    border: '1px solid #e2e8f0',
    margin: '0 auto'
  }}>
      <ComponentPalette {...args} />
    </div>,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
}`,...d.parameters?.docs?.source}}};const g=["Default","DarkTheme","WithCustomTemplateUrl","LoadingState","ErrorState","WithCustomAriaLabel","Mobile"];export{s as DarkTheme,n as Default,i as ErrorState,a as LoadingState,d as Mobile,l as WithCustomAriaLabel,o as WithCustomTemplateUrl,g as __namedExportsOrder,c as default};
