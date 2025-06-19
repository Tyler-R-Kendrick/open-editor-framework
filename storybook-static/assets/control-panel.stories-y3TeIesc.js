import{j as e}from"./jsx-runtime-DlRdbTK2.js";import{C as t,d as m}from"./component-CKYhYuGs.js";import"./iframe-B_meevF9.js";const b=({property:r,theme:n,onChange:s})=>e.jsxs("div",{style:{position:"relative"},children:[e.jsx("input",{type:"text",value:String(r.value??""),onChange:o=>s(r.key,o.target.value),placeholder:"Enter text...",style:{width:"100%",padding:"12px 16px",border:`2px solid ${n==="dark"?"#6366f1":"#8b5cf6"}`,borderRadius:"12px",background:n==="dark"?"#1e1b4b":"#faf5ff",color:n==="dark"?"#e0e7ff":"#581c87",fontSize:"14px",outline:"none",transition:"all 0.3s ease"}}),e.jsx("div",{style:{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",fontSize:"12px",color:n==="dark"?"#a5b4fc":"#8b5cf6",pointerEvents:"none"},children:"✨"})]}),y=({property:r,theme:n,onChange:s})=>e.jsxs("div",{style:{padding:"16px",background:n==="dark"?"#2d1b69":"#f0f4ff",borderRadius:"8px",border:`1px solid ${n==="dark"?"#5b21b6":"#c7d2fe"}`},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"8px",fontSize:"12px",fontWeight:"600",color:n==="dark"?"#a5b4fc":"#5b21b6"},children:[e.jsx("span",{children:"Custom Slider"}),e.jsx("span",{children:String(r.value)})]}),e.jsx("input",{type:"range",min:r.min||0,max:r.max||100,step:r.step||1,value:Number(r.value??0),onChange:o=>s(r.key,parseInt(o.target.value)),style:{width:"100%",height:"8px",borderRadius:"4px",background:`linear-gradient(90deg, ${n==="dark"?"#6366f1":"#8b5cf6"} 0%, ${n==="dark"?"#3730a3":"#7c3aed"} 100%)`,outline:"none",accentColor:n==="dark"?"#6366f1":"#8b5cf6"}})]}),v=({property:r,theme:n,onChange:s})=>e.jsx("div",{children:e.jsx("input",{type:"date",value:String(r.value??""),onChange:o=>s(r.key,o.target.value),style:{width:"100%",padding:"8px 12px",border:`1px solid ${n==="dark"?"#6b7280":"#d1d5db"}`,borderRadius:"6px",background:n==="dark"?"#4b5563":"#ffffff",color:n==="dark"?"#f8fafc":"#1e293b",fontSize:"14px",outline:"none"}})}),w={title:"Components/ControlPanel",component:t,parameters:{docs:{description:{component:"A control panel for editing component properties with support for various input types and accessibility features."}}},argTypes:{theme:{control:{type:"select"},options:["light","dark"],description:"Visual theme of the control panel"},"aria-label":{control:{type:"text"},description:"Accessibility label for the control panel"},config:{control:{type:"object"},description:"Configuration for field renderers and sections"}}},i={args:{theme:"light"},render:r=>e.jsx("div",{style:{height:"600px",width:"350px",border:"1px solid #e2e8f0"},children:e.jsx(t,{...r})})},d={args:{theme:"dark"},render:r=>e.jsx("div",{style:{height:"600px",width:"350px",border:"1px solid #475569",background:"#1e293b"},children:e.jsx(t,{...r})})},a={args:{theme:"light","aria-label":"Custom Properties Panel"},render:r=>e.jsx("div",{style:{height:"600px",width:"350px",border:"1px solid #e2e8f0"},children:e.jsx(t,{...r})})},l={args:{theme:"light"},parameters:{viewport:{defaultViewport:"mobile1"}},render:r=>e.jsx("div",{style:{height:"100vh",width:"100vw"},children:e.jsx(t,{...r})})},p={args:{theme:"light"},render:r=>e.jsxs("div",{style:{height:"600px",width:"350px",border:"1px solid #e2e8f0"},children:[e.jsx(t,{...r}),e.jsxs("div",{style:{marginTop:"20px",padding:"16px",background:"#f8fafc",borderRadius:"8px",fontFamily:"monospace",fontSize:"12px"},children:[e.jsx("strong",{children:"Events:"})," Check the browser console to see events fired by the control panel."]})]})},c={args:{theme:"light"},render:r=>e.jsx("div",{style:{height:"400px",width:"280px",border:"1px solid #e2e8f0"},children:e.jsx(t,{...r})})},g={args:{theme:"light"},render:r=>e.jsx("div",{style:{height:"100vh",width:"350px",border:"1px solid #e2e8f0"},children:e.jsx(t,{...r})})},x={args:{theme:"light",config:{fieldRenderers:{...m,text:b}}},render:r=>e.jsxs("div",{style:{height:"600px",width:"350px",border:"1px solid #e2e8f0"},children:[e.jsx(t,{...r}),e.jsxs("div",{style:{marginTop:"20px",padding:"16px",background:"#faf5ff",borderRadius:"8px",border:"1px solid #e9d5ff"},children:[e.jsx("strong",{children:"Custom Text Renderer:"})," This story demonstrates a custom text field renderer with enhanced styling."]})]})},h={args:{theme:"light",config:{sections:[{title:"Basic Properties",fields:["text","color"]},{title:"Typography",fields:["fontSize","fontFamily"]},{title:"Layout & Effects",fields:["backgroundColor","borderRadius","opacity","visible"]}]}},render:r=>e.jsxs("div",{style:{height:"600px",width:"350px",border:"1px solid #e2e8f0"},children:[e.jsx(t,{...r}),e.jsxs("div",{style:{marginTop:"20px",padding:"16px",background:"#f0f9ff",borderRadius:"8px",border:"1px solid #bae6fd"},children:[e.jsx("strong",{children:"Custom Sections:"})," Properties are grouped into custom sections with different field groupings."]})]})},f={args:{theme:"dark",config:{fieldRenderers:{...m,text:b},sections:[{title:"Content & Style",fields:["text","color","fontSize"]},{title:"Visual Effects",fields:["backgroundColor","opacity"]}]}},render:r=>e.jsxs("div",{style:{height:"600px",width:"350px",border:"1px solid #475569",background:"#1e293b"},children:[e.jsx(t,{...r}),e.jsxs("div",{style:{marginTop:"20px",padding:"16px",background:"#1e1b4b",borderRadius:"8px",border:"1px solid #3730a3",color:"#e0e7ff"},children:[e.jsx("strong",{children:"Fully Customized:"})," Combines custom renderers with custom sections in dark theme."]})]})},u={args:{theme:"light",config:{fieldRenderers:{...m,range:y,"custom-date":v,"enhanced-text":b},sections:[{title:"Built-in Types (Enhanced)",fields:["text","range","color"]},{title:"Custom Field Types",fields:["custom-date","enhanced-text"]}]}},render:r=>e.jsxs("div",{style:{height:"600px",width:"350px",border:"1px solid #e2e8f0"},children:[e.jsx(t,{...r}),e.jsxs("div",{style:{marginTop:"20px",padding:"16px",background:"#f0f9ff",borderRadius:"8px",border:"1px solid #bae6fd"},children:[e.jsx("strong",{children:"Custom Field Types:"})," This demonstrates the flexible field renderer system. You can override built-in types and add completely new field types like 'custom-date' and 'enhanced-text'."]})]})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'light'
  },
  render: args => <div style={{
    height: '600px',
    width: '350px',
    border: '1px solid #e2e8f0'
  }}>
      <ControlPanel {...args} />
    </div>
}`,...i.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'dark'
  },
  render: args => <div style={{
    height: '600px',
    width: '350px',
    border: '1px solid #475569',
    background: '#1e293b'
  }}>
      <ControlPanel {...args} />
    </div>
}`,...d.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'light',
    'aria-label': 'Custom Properties Panel'
  },
  render: args => <div style={{
    height: '600px',
    width: '350px',
    border: '1px solid #e2e8f0'
  }}>
      <ControlPanel {...args} />
    </div>
}`,...a.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'light'
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  },
  render: args => <div style={{
    height: '100vh',
    width: '100vw'
  }}>
      <ControlPanel {...args} />
    </div>
}`,...l.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'light'
  },
  render: args => <div style={{
    height: '600px',
    width: '350px',
    border: '1px solid #e2e8f0'
  }}>
      <ControlPanel {...args} />
      <div style={{
      marginTop: '20px',
      padding: '16px',
      background: '#f8fafc',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '12px'
    }}>
        <strong>Events:</strong> Check the browser console to see events fired by the control panel.
      </div>
    </div>
}`,...p.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'light'
  },
  render: args => <div style={{
    height: '400px',
    width: '280px',
    border: '1px solid #e2e8f0'
  }}>
      <ControlPanel {...args} />
    </div>
}`,...c.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'light'
  },
  render: args => <div style={{
    height: '100vh',
    width: '350px',
    border: '1px solid #e2e8f0'
  }}>
      <ControlPanel {...args} />
    </div>
}`,...g.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'light',
    config: {
      fieldRenderers: {
        ...defaultFieldRenderers,
        text: CustomTextRenderer
      }
    }
  },
  render: args => <div style={{
    height: '600px',
    width: '350px',
    border: '1px solid #e2e8f0'
  }}>
      <ControlPanel {...args} />
      <div style={{
      marginTop: '20px',
      padding: '16px',
      background: '#faf5ff',
      borderRadius: '8px',
      border: '1px solid #e9d5ff'
    }}>
        <strong>Custom Text Renderer:</strong> This story demonstrates a custom text field renderer with enhanced styling.
      </div>
    </div>
}`,...x.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'light',
    config: {
      sections: [{
        title: 'Basic Properties',
        fields: ['text', 'color']
      }, {
        title: 'Typography',
        fields: ['fontSize', 'fontFamily']
      }, {
        title: 'Layout & Effects',
        fields: ['backgroundColor', 'borderRadius', 'opacity', 'visible']
      }]
    } satisfies Parameters<typeof ControlPanel>[0]['config']
  },
  render: args => <div style={{
    height: '600px',
    width: '350px',
    border: '1px solid #e2e8f0'
  }}>
      <ControlPanel {...args} />
      <div style={{
      marginTop: '20px',
      padding: '16px',
      background: '#f0f9ff',
      borderRadius: '8px',
      border: '1px solid #bae6fd'
    }}>
        <strong>Custom Sections:</strong> Properties are grouped into custom sections with different field groupings.
      </div>
    </div>
}`,...h.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'dark',
    config: {
      fieldRenderers: {
        ...defaultFieldRenderers,
        text: CustomTextRenderer
      },
      sections: [{
        title: 'Content & Style',
        fields: ['text', 'color', 'fontSize']
      }, {
        title: 'Visual Effects',
        fields: ['backgroundColor', 'opacity']
      }]
    } satisfies Parameters<typeof ControlPanel>[0]['config']
  },
  render: args => <div style={{
    height: '600px',
    width: '350px',
    border: '1px solid #475569',
    background: '#1e293b'
  }}>
      <ControlPanel {...args} />
      <div style={{
      marginTop: '20px',
      padding: '16px',
      background: '#1e1b4b',
      borderRadius: '8px',
      border: '1px solid #3730a3',
      color: '#e0e7ff'
    }}>
        <strong>Fully Customized:</strong> Combines custom renderers with custom sections in dark theme.
      </div>
    </div>
}`,...f.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'light',
    config: {
      fieldRenderers: {
        // Override built-in types
        ...defaultFieldRenderers,
        range: CustomSliderRenderer,
        // Add completely custom types
        'custom-date': DatePickerRenderer,
        'enhanced-text': CustomTextRenderer
      },
      sections: [{
        title: 'Built-in Types (Enhanced)',
        fields: ['text', 'range', 'color']
      }, {
        title: 'Custom Field Types',
        fields: ['custom-date', 'enhanced-text']
      }]
    }
  },
  render: args => <div style={{
    height: '600px',
    width: '350px',
    border: '1px solid #e2e8f0'
  }}>
      <ControlPanel {...args} />
      <div style={{
      marginTop: '20px',
      padding: '16px',
      background: '#f0f9ff',
      borderRadius: '8px',
      border: '1px solid #bae6fd'
    }}>
        <strong>Custom Field Types:</strong> This demonstrates the flexible field renderer system.
        You can override built-in types and add completely new field types like &apos;custom-date&apos; and &apos;enhanced-text&apos;.
      </div>
    </div>
}`,...u.parameters?.docs?.source}}};const R=["Default","DarkTheme","WithCustomLabel","MobileView","Interactive","Compact","FullHeight","WithCustomRenderer","CustomSections","FullyCustomized","CustomFieldTypes"];export{c as Compact,u as CustomFieldTypes,h as CustomSections,d as DarkTheme,i as Default,g as FullHeight,f as FullyCustomized,p as Interactive,l as MobileView,a as WithCustomLabel,x as WithCustomRenderer,R as __namedExportsOrder,w as default};
