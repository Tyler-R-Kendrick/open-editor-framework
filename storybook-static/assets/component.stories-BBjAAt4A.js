import{j as o}from"./jsx-runtime-DlRdbTK2.js";import{r as m}from"./iframe-B_meevF9.js";import{E as q}from"./component-D7r2Nr0J.js";import{C as M}from"./component-CBA6SaWP.js";import{E as V}from"./component-DgXOZYiR.js";import{C as W}from"./component-CKYhYuGs.js";import{$ as X,a as D}from"./Icon-CM8U-gYh.js";import"./index-BAiAoPj4.js";function O(e,a,t,r){Object.defineProperty(e,a,{get:t,set:r,enumerable:!0,configurable:!0})}var k={};O(k,"spectrum--darkest",()=>b,e=>b=e);var b;b="R-l9gW_spectrum--darkest";function n(e,a,t,r){Object.defineProperty(e,a,{get:t,set:r,enumerable:!0,configurable:!0})}var s={};n(s,"spectrum",()=>u,e=>u=e);n(s,"spectrum--dark",()=>f,e=>f=e);n(s,"spectrum--darkest",()=>h,e=>h=e);n(s,"spectrum--large",()=>$,e=>$=e);n(s,"spectrum--light",()=>g,e=>g=e);n(s,"spectrum--lightest",()=>x,e=>x=e);n(s,"spectrum--medium",()=>v,e=>v=e);var u,f,h,$,g,x,v;u="XhWg9q_spectrum";f="XhWg9q_spectrum--dark";h="XhWg9q_spectrum--darkest";$="XhWg9q_spectrum--large";g="XhWg9q_spectrum--light";x="XhWg9q_spectrum--lightest";v="XhWg9q_spectrum--medium";function L(e,a,t,r){Object.defineProperty(e,a,{get:t,set:r,enumerable:!0,configurable:!0})}var _={};L(_,"spectrum--large",()=>w,e=>w=e);var w;w="_1DrGeG_spectrum--large";function S(e,a,t,r){Object.defineProperty(e,a,{get:t,set:r,enumerable:!0,configurable:!0})}var C={};S(C,"spectrum--light",()=>y,e=>y=e);var y;y="YqfL3a_spectrum--light";function A(e,a,t,r){Object.defineProperty(e,a,{get:t,set:r,enumerable:!0,configurable:!0})}var T={};A(T,"spectrum--medium",()=>j,e=>j=e);var j;j="rfm_fq_spectrum--medium";function c(e){return e&&e.__esModule?e.default:e}let R={global:c(s),light:c(C),dark:c(k),medium:c(T),large:c(_)};const E=()=>{const[e,a]=m.useState("light"),t=m.useCallback(i=>{a(i.matches?"dark":"light")},[]);m.useEffect(()=>{const i=window.matchMedia("(prefers-color-scheme: dark)");return i.addEventListener("change",t),t(i),()=>{i.removeEventListener("change",t)}},[t]);const r=e==="dark"?"#374151":"#e2e8f0",P=i=>{a(i)};return o.jsx(X,{locale:navigator.language,children:o.jsx(D,{theme:R,colorScheme:e,children:o.jsxs("div",{className:"editor-container",role:"application","aria-label":"React Component Editor",style:{display:"flex",flexDirection:"column",height:"100vh",background:e==="dark"?"#1e293b":"#f8fafc",color:e==="dark"?"#f8fafc":"#1e293b"},children:[o.jsx("div",{style:{height:"60px",borderBottom:`1px solid ${r}`,background:e==="dark"?"#374151":"white"},children:o.jsx(q,{theme:e,onThemeChange:P})}),o.jsxs("div",{style:{display:"flex",flex:1,overflow:"hidden"},children:[o.jsx("div",{style:{width:"250px",borderRight:`1px solid ${r}`,overflow:"auto"},children:o.jsx(M,{theme:e,"aria-label":"Component Library"})}),o.jsx("div",{style:{flex:1,overflow:"auto"},children:o.jsx(V,{theme:e,"aria-label":"Design Canvas"})}),o.jsx("div",{style:{width:"300px",borderLeft:`1px solid ${r}`,overflow:"auto"},children:o.jsx(W,{theme:e,"aria-label":"Properties Panel"})})]})]})})})};E.__docgenInfo={description:"Main editor application using a simple flex layout",methods:[],displayName:"EditorApp"};const H={title:"Application/EditorApp",component:E,parameters:{layout:"fullscreen",docs:{description:{component:"Main editor application component that orchestrates the canvas, palette, and control panel with mobile and desktop support."}}},tags:["autodocs"]},p={parameters:{docs:{description:{story:"The complete editor application with all panels. Try switching between light/dark theme and resizing the window to see mobile layout."}}}},d={parameters:{viewport:{defaultViewport:"mobile1"},docs:{description:{story:"Mobile view with tab navigation at the bottom. Tap the tabs to switch between Canvas, Components, and Properties."}}}},l={parameters:{viewport:{defaultViewport:"tablet"},docs:{description:{story:"Tablet view showing responsive layout adaptation."}}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'The complete editor application with all panels. Try switching between light/dark theme and resizing the window to see mobile layout.'
      }
    }
  }
}`,...p.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile view with tab navigation at the bottom. Tap the tabs to switch between Canvas, Components, and Properties.'
      }
    }
  }
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'Tablet view showing responsive layout adaptation.'
      }
    }
  }
}`,...l.parameters?.docs?.source}}};const J=["Default","MobileView","TabletView"];export{p as Default,d as MobileView,l as TabletView,J as __namedExportsOrder,H as default};
