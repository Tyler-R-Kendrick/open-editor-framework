import{j as o}from"./jsx-runtime-DlRdbTK2.js";import{E as n}from"./component-D7r2Nr0J.js";import"./iframe-B_meevF9.js";import"./Icon-CM8U-gYh.js";import"./index-BAiAoPj4.js";const m={title:"Components/EditorToolbar",component:n,tags:["autodocs"],argTypes:{theme:{control:{type:"select"},options:["light","dark"],description:"Visual theme for the toolbar"},onThemeChange:{action:"onThemeChange",description:"Callback when theme is changed"}},parameters:{docs:{description:{component:"A comprehensive toolbar providing file operations, editing controls, zoom management, and theme switching. Includes keyboard shortcuts and mobile-responsive design."}}}},t={args:{theme:"light",onThemeChange:e=>console.log("Theme changed to:",e)},render:e=>o.jsx("div",{style:{height:"60px",width:"100%",border:"1px solid #e2e8f0"},children:o.jsx(n,{...e})})},r={args:{theme:"dark",onThemeChange:e=>console.log("Theme changed to:",e)},render:e=>o.jsx("div",{style:{height:"60px",width:"100%",border:"1px solid #475569",background:"#1e293b"},children:o.jsx(n,{...e})})},s={args:{theme:"light",onThemeChange:e=>console.log("Theme changed to:",e)},render:e=>o.jsx("div",{style:{height:"60px",width:"375px",border:"1px solid #e2e8f0"},children:o.jsx(n,{...e})}),parameters:{viewport:{defaultViewport:"mobile1"},docs:{description:{story:"Toolbar on mobile devices with condensed layout and hidden non-essential elements."}}}},a={args:{theme:"light",onThemeChange:e=>console.log("Theme changed to:",e)},render:e=>o.jsxs("div",{children:[o.jsx("div",{style:{height:"60px",width:"100%",border:"1px solid #e2e8f0"},children:o.jsx(n,{...e})}),o.jsx("p",{style:{marginTop:"16px",fontSize:"14px",color:"#64748b",fontFamily:"system-ui, sans-serif"},children:"Click buttons or use keyboard shortcuts to see actions in console. Try Ctrl+N, Ctrl+S, Ctrl+Z, etc."})]}),parameters:{docs:{description:{story:"Toolbar with event handlers attached. Check the console to see events fired by toolbar actions."}}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'light',
    onThemeChange: theme => console.log('Theme changed to:', theme)
  },
  render: args => <div style={{
    height: '60px',
    width: '100%',
    border: '1px solid #e2e8f0'
  }}>
      <EditorToolbar {...args} />
    </div>
}`,...t.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'dark',
    onThemeChange: theme => console.log('Theme changed to:', theme)
  },
  render: args => <div style={{
    height: '60px',
    width: '100%',
    border: '1px solid #475569',
    background: '#1e293b'
  }}>
      <EditorToolbar {...args} />
    </div>
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'light',
    onThemeChange: theme => console.log('Theme changed to:', theme)
  },
  render: args => <div style={{
    height: '60px',
    width: '375px',
    border: '1px solid #e2e8f0'
  }}>
      <EditorToolbar {...args} />
    </div>,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Toolbar on mobile devices with condensed layout and hidden non-essential elements.'
      }
    }
  }
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'light',
    onThemeChange: theme => console.log('Theme changed to:', theme)
  },
  render: args => <div>
      <div style={{
      height: '60px',
      width: '100%',
      border: '1px solid #e2e8f0'
    }}>
        <EditorToolbar {...args} />
      </div>
      <p style={{
      marginTop: '16px',
      fontSize: '14px',
      color: '#64748b',
      fontFamily: 'system-ui, sans-serif'
    }}>
        Click buttons or use keyboard shortcuts to see actions in console. Try Ctrl+N, Ctrl+S, Ctrl+Z, etc.
      </p>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Toolbar with event handlers attached. Check the console to see events fired by toolbar actions.'
      }
    }
  }
}`,...a.parameters?.docs?.source}}};const p=["Default","DarkTheme","MobileView","WithActions"];export{r as DarkTheme,t as Default,s as MobileView,a as WithActions,p as __namedExportsOrder,m as default};
