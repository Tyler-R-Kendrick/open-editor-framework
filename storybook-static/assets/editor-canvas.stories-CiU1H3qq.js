import{j as e}from"./jsx-runtime-DlRdbTK2.js";import{E as t}from"./component-DgXOZYiR.js";import"./iframe-B_meevF9.js";import"./Icon-CM8U-gYh.js";import"./index-BAiAoPj4.js";const m={title:"Components/EditorCanvas",component:t,tags:["autodocs"],argTypes:{theme:{control:{type:"select"},options:["light","dark"],description:"Visual theme for the editor canvas"},"aria-label":{control:{type:"text"},description:"Accessibility label for the canvas"}},parameters:{docs:{description:{component:"An HTML5 Canvas-based editor panel for rendering and manipulating UI components. Supports touch interactions, keyboard shortcuts, and accessibility features."}}}},s={args:{theme:"light"},render:r=>e.jsx("div",{style:{height:"600px",width:"800px",border:"1px solid #e2e8f0"},children:e.jsx(t,{...r})})},n={args:{theme:"dark"},render:r=>e.jsx("div",{style:{height:"600px",width:"800px",border:"1px solid #475569",background:"#1e293b"},children:e.jsx(t,{...r})})},i={args:{theme:"light"},render:r=>e.jsx("div",{style:{height:"700px",width:"375px",border:"1px solid #e2e8f0"},children:e.jsx(t,{...r})}),parameters:{viewport:{defaultViewport:"mobile1"},docs:{description:{story:"Editor canvas optimized for mobile devices with touch-friendly interactions."}}}},a={args:{theme:"light"},render:r=>e.jsx("div",{style:{height:"800px",width:"768px",border:"1px solid #e2e8f0"},children:e.jsx(t,{...r})}),parameters:{viewport:{defaultViewport:"tablet"},docs:{description:{story:"Editor canvas on tablet-sized screens with optimized touch interactions."}}}},o={args:{theme:"light","aria-label":"Design Canvas - Create and edit UI components"},render:r=>e.jsx("div",{style:{height:"600px",width:"800px",border:"1px solid #e2e8f0"},children:e.jsx(t,{...r})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'light'
  },
  render: args => <div style={{
    height: '600px',
    width: '800px',
    border: '1px solid #e2e8f0'
  }}>
      <EditorCanvas {...args} />
    </div>
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'dark'
  },
  render: args => <div style={{
    height: '600px',
    width: '800px',
    border: '1px solid #475569',
    background: '#1e293b'
  }}>
      <EditorCanvas {...args} />
    </div>
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'light'
  },
  render: args => <div style={{
    height: '700px',
    width: '375px',
    border: '1px solid #e2e8f0'
  }}>
      <EditorCanvas {...args} />
    </div>,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Editor canvas optimized for mobile devices with touch-friendly interactions.'
      }
    }
  }
}`,...i.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'light'
  },
  render: args => <div style={{
    height: '800px',
    width: '768px',
    border: '1px solid #e2e8f0'
  }}>
      <EditorCanvas {...args} />
    </div>,
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'Editor canvas on tablet-sized screens with optimized touch interactions.'
      }
    }
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'light',
    'aria-label': 'Design Canvas - Create and edit UI components'
  },
  render: args => <div style={{
    height: '600px',
    width: '800px',
    border: '1px solid #e2e8f0'
  }}>
      <EditorCanvas {...args} />
    </div>
}`,...o.parameters?.docs?.source}}};const g=["Default","DarkTheme","MobileView","TabletView","WithCustomLabel"];export{n as DarkTheme,s as Default,i as MobileView,a as TabletView,o as WithCustomLabel,g as __namedExportsOrder,m as default};
