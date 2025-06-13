import{f as z,u as T,i as f,a as v,x as s}from"./lit-DdJTlLfJ.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function o(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(i){if(i.ep)return;i.ep=!0;const a=o(i);fetch(i.href,a)}})();/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const x=e=>(t,o)=>{o!==void 0?o.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const E={attribute:!0,type:String,converter:T,reflect:!1,hasChanged:z},P=(e=E,t,o)=>{const{kind:n,metadata:i}=o;let a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),n==="setter"&&((e=Object.create(e)).wrapped=!0),a.set(o.name,e),n==="accessor"){const{name:r}=o;return{set(p){const $=t.get.call(this);t.set.call(this,p),this.requestUpdate(r,$,e)},init(p){return p!==void 0&&this.C(r,void 0,e,p),p}}}if(n==="setter"){const{name:r}=o;return function(p){const $=this[r];t.call(this,p),this.requestUpdate(r,$,e)}}throw Error("Unsupported decorator location: "+n)};function g(e){return(t,o)=>typeof o=="object"?P(e,t,o):((n,i,a)=>{const r=i.hasOwnProperty(a);return i.constructor.createProperty(a,n),r?Object.getOwnPropertyDescriptor(i,a):void 0})(e,t,o)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function l(e){return g({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const D=(e,t,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&typeof t!="object"&&Object.defineProperty(e,t,o),o);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function S(e,t){return(o,n,i)=>{const a=r=>r.renderRoot?.querySelector(e)??null;return D(o,n,{get(){return a(this)}})}}var L=Object.defineProperty,M=Object.getOwnPropertyDescriptor,d=(e,t,o,n)=>{for(var i=n>1?void 0:n?M(t,o):t,a=e.length-1,r;a>=0;a--)(r=e[a])&&(i=(n?r(t,o,i):r(i))||i);return n&&i&&L(t,o,i),i};const R=f`
:host {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #ffffff;
  touch-action: manipulation;
}

.canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: crosshair;
}

.canvas-layer {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: auto;
}

.canvas-background {
  background-image: 
    radial-gradient(circle, #e2e8f0 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
}

.canvas-overlay {
  pointer-events: none;
  z-index: 10;
}

.selection-indicator {
  position: absolute;
  border: 2px solid var(--editor-primary, #3b82f6);
  background: transparent;
  pointer-events: none;
  z-index: 20;
}

.resize-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--editor-primary, #3b82f6);
  border: 1px solid white;
  cursor: se-resize;
  z-index: 30;
}

.canvas-info {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
  pointer-events: none;
  z-index: 40;
}

/* Touch-specific styles */
@media (pointer: coarse) {
  .resize-handle {
    width: 16px;
    height: 16px;
  }
  
  .canvas-container {
    touch-action: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  :host {
    border: 2px solid black;
  }
  
  .selection-indicator {
    border-color: black;
    border-width: 3px;
  }
}

/* Dark theme */
:host([theme="dark"]) {
  background: #1e293b;
}

:host([theme="dark"]) .canvas-background {
  background-image: 
    radial-gradient(circle, #475569 1px, transparent 1px);
}
`;let c=class extends v{constructor(){super(...arguments),this.theme="light",this.canvasState={zoom:1,pan:{x:0,y:0},selectedComponents:[],clipboard:[],history:[],historyIndex:-1},this.components=[],this.isDragging=!1,this.isResizing=!1,this.lastTouch=null,this.ctx=null,this.animationId=null,this.touchStartTime=0,this.longPressTimer=null,this.handleTouchStart=e=>{e.preventDefault(),this.touchStartTime=Date.now();const t=e.touches[0],o=this.getTouchPoint(t);this.longPressTimer=window.setTimeout(()=>{this.handleLongPress(o)},500),e.touches.length===2&&this.handlePinchStart(e)},this.handleTouchMove=e=>{e.preventDefault(),this.longPressTimer&&(clearTimeout(this.longPressTimer),this.longPressTimer=null),e.touches.length===1?this.handlePan(e):e.touches.length===2&&this.handlePinch(e)},this.handleTouchEnd=e=>{if(e.preventDefault(),this.longPressTimer&&(clearTimeout(this.longPressTimer),this.longPressTimer=null),Date.now()-this.touchStartTime<200&&e.changedTouches.length===1){const o=e.changedTouches[0],n=this.getTouchPoint(o);this.handleTap(n)}this.isDragging=!1,this.isResizing=!1},this.handleKeyDown=e=>{switch(e.key){case"Delete":case"Backspace":this.deleteSelectedComponents();break;case"Escape":this.clearSelection();break;case"a":(e.ctrlKey||e.metaKey)&&(e.preventDefault(),this.selectAllComponents());break;case"c":(e.ctrlKey||e.metaKey)&&(e.preventDefault(),this.copySelectedComponents());break;case"v":(e.ctrlKey||e.metaKey)&&(e.preventDefault(),this.pasteComponents());break;case"z":(e.ctrlKey||e.metaKey)&&(e.preventDefault(),e.shiftKey?this.redo():this.undo());break}},this.handleKeyUp=e=>{},this.handleWheel=e=>{e.preventDefault();const t=e.deltaY>0?.9:1.1;this.canvasState.zoom=Math.max(.1,Math.min(5,this.canvasState.zoom*t))}}connectedCallback(){super.connectedCallback(),this.addEventListener("keydown",this.handleKeyDown),this.addEventListener("keyup",this.handleKeyUp)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("keydown",this.handleKeyDown),this.removeEventListener("keyup",this.handleKeyUp),this.animationId&&cancelAnimationFrame(this.animationId)}firstUpdated(){this.initializeCanvas(),this.startRenderLoop()}initializeCanvas(){if(!this.canvas)return;this.ctx=this.canvas.getContext("2d"),this.resizeCanvas();const e=window.devicePixelRatio||1,t=this.canvas.getBoundingClientRect();this.canvas.width=t.width*e,this.canvas.height=t.height*e,this.canvas.style.width=t.width+"px",this.canvas.style.height=t.height+"px",this.ctx&&this.ctx.scale(e,e)}resizeCanvas(){if(!this.canvas||!this.canvasContainer)return;const e=this.canvasContainer.getBoundingClientRect();this.canvas.style.width=e.width+"px",this.canvas.style.height=e.height+"px"}startRenderLoop(){const e=()=>{this.renderCanvas(),this.animationId=requestAnimationFrame(e)};e()}renderCanvas(){if(!this.ctx||!this.canvas)return;const{width:e,height:t}=this.canvas.getBoundingClientRect();this.ctx.clearRect(0,0,e,t),this.ctx.save(),this.ctx.translate(this.canvasState.pan.x,this.canvasState.pan.y),this.ctx.scale(this.canvasState.zoom,this.canvasState.zoom),this.components.forEach(o=>{this.renderComponent(o)}),this.ctx.restore()}renderComponent(e){if(!this.ctx)return;const{bounds:t}=e;this.ctx.fillStyle=e.properties.backgroundColor||"#ffffff",this.ctx.fillRect(t.x,t.y,t.width,t.height),this.ctx.strokeStyle=e.properties.borderColor||"#e2e8f0",this.ctx.lineWidth=e.properties.borderWidth||1,this.ctx.strokeRect(t.x,t.y,t.width,t.height),this.renderComponentContent(e),this.canvasState.selectedComponents.includes(e.id)&&this.renderSelectionIndicator(e)}renderComponentContent(e){if(!this.ctx)return;const{bounds:t,type:o,properties:n}=e;switch(o){case"text":this.ctx.fillStyle=n.color||"#000000",this.ctx.font=`${n.fontSize||16}px ${n.fontFamily||"Arial"}`,this.ctx.fillText(n.text||"Text Component",t.x+10,t.y+t.height/2+6);break;case"button":this.ctx.fillStyle=n.backgroundColor||"#3b82f6",this.ctx.fillRect(t.x,t.y,t.width,t.height),this.ctx.fillStyle=n.color||"#ffffff",this.ctx.font=`${n.fontSize||14}px ${n.fontFamily||"Arial"}`,this.ctx.textAlign="center",this.ctx.fillText(n.text||"Button",t.x+t.width/2,t.y+t.height/2+4),this.ctx.textAlign="start";break;case"image":this.ctx.fillStyle="#f3f4f6",this.ctx.fillRect(t.x,t.y,t.width,t.height),this.ctx.strokeStyle="#d1d5db",this.ctx.strokeRect(t.x,t.y,t.width,t.height),this.ctx.fillStyle="#9ca3af",this.ctx.font="20px Arial",this.ctx.textAlign="center",this.ctx.fillText("🖼️",t.x+t.width/2,t.y+t.height/2+8),this.ctx.textAlign="start";break}}renderSelectionIndicator(e){if(!this.ctx)return;const{bounds:t}=e;this.ctx.strokeStyle="#3b82f6",this.ctx.lineWidth=2,this.ctx.setLineDash([5,5]),this.ctx.strokeRect(t.x-2,t.y-2,t.width+4,t.height+4),this.ctx.setLineDash([]);const o=8;[{x:t.x-o/2,y:t.y-o/2},{x:t.x+t.width-o/2,y:t.y-o/2},{x:t.x-o/2,y:t.y+t.height-o/2},{x:t.x+t.width-o/2,y:t.y+t.height-o/2}].forEach(i=>{this.ctx.fillStyle="#3b82f6",this.ctx.fillRect(i.x,i.y,o,o),this.ctx.strokeStyle="#ffffff",this.ctx.lineWidth=1,this.ctx.strokeRect(i.x,i.y,o,o)})}getTouchPoint(e){const t=this.canvasContainer.getBoundingClientRect();return{x:(e.clientX-t.left-this.canvasState.pan.x)/this.canvasState.zoom,y:(e.clientY-t.top-this.canvasState.pan.y)/this.canvasState.zoom}}handleTap(e){const t=this.findComponentAtPoint(e);t?this.selectComponent(t.id):this.clearSelection(),"vibrate"in navigator&&navigator.vibrate(10)}handleLongPress(e){this.dispatchEvent(new CustomEvent("context-menu",{detail:{point:e,components:this.findComponentAtPoint(e)}})),"vibrate"in navigator&&navigator.vibrate([20,10,20])}handlePan(e){const t=e.touches[0];if(this.getTouchPoint(t),!this.isDragging){this.isDragging=!0;return}}handlePinchStart(e){}handlePinch(e){}findComponentAtPoint(e){for(let t=this.components.length-1;t>=0;t--){const o=this.components[t],{bounds:n}=o;if(e.x>=n.x&&e.x<=n.x+n.width&&e.y>=n.y&&e.y<=n.y+n.height)return o}return null}selectComponent(e){this.canvasState.selectedComponents=[e],this.dispatchEvent(new CustomEvent("selection-change",{detail:{selectedComponents:this.canvasState.selectedComponents}}))}clearSelection(){this.canvasState.selectedComponents=[],this.dispatchEvent(new CustomEvent("selection-change",{detail:{selectedComponents:this.canvasState.selectedComponents}}))}selectAllComponents(){this.canvasState.selectedComponents=this.components.map(e=>e.id),this.dispatchEvent(new CustomEvent("selection-change",{detail:{selectedComponents:this.canvasState.selectedComponents}}))}deleteSelectedComponents(){}copySelectedComponents(){}pasteComponents(){}undo(){}redo(){}render(){return s`
      <div 
        class="canvas-container canvas-background"
        @touchstart=${this.handleTouchStart}
        @touchmove=${this.handleTouchMove}
        @touchend=${this.handleTouchEnd}
        @wheel=${this.handleWheel}
        tabindex="0"
        role="img"
        aria-label="Design Canvas - Use arrow keys to navigate, Space to select">
        
        <canvas 
          class="canvas-layer"
          aria-hidden="true">
        </canvas>
        
        <div class="canvas-overlay">
          <!-- Selection indicators and other overlays will be rendered here -->
        </div>
        
        <div class="canvas-info">
          Zoom: ${Math.round(this.canvasState.zoom*100)}% | 
          Components: ${this.components.length} | 
          Selected: ${this.canvasState.selectedComponents.length}
        </div>
      </div>
    `}};c.styles=R;d([g()],c.prototype,"theme",2);d([l()],c.prototype,"canvasState",2);d([l()],c.prototype,"components",2);d([l()],c.prototype,"isDragging",2);d([l()],c.prototype,"isResizing",2);d([l()],c.prototype,"lastTouch",2);d([S(".canvas-container")],c.prototype,"canvasContainer",2);d([S("canvas")],c.prototype,"canvas",2);c=d([x("editor-canvas")],c);var O=Object.defineProperty,F=Object.getOwnPropertyDescriptor,k=(e,t,o,n)=>{for(var i=n>1?void 0:n?F(t,o):t,a=e.length-1,r;a>=0;a--)(r=e[a])&&(i=(n?r(t,o,i):r(i))||i);return n&&i&&O(t,o,i),i};const _=f`
:host {
  display: block;
  height: 100%;
  overflow: hidden;
  background: white;
  touch-action: manipulation;
}

.palette-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.palette-header {
  padding: 16px;
  border-bottom: 1px solid var(--editor-border, #e2e8f0);
  background: #f8fafc;
}

.palette-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--editor-text, #1e293b);
  margin: 0 0 8px 0;
}

.search-box {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--editor-border, #e2e8f0);
  border-radius: 6px;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s ease;
}

.search-box:focus {
  outline: none;
  border-color: var(--editor-primary, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.palette-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.category-section {
  margin-bottom: 16px;
}

.category-header {
  padding: 12px 16px 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--editor-secondary, #64748b);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #f8fafc;
  border-top: 1px solid var(--editor-border, #e2e8f0);
  border-bottom: 1px solid var(--editor-border, #e2e8f0);
  position: sticky;
  top: 0;
  z-index: 1;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
  padding: 16px;
}

.component-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  border: 1px solid var(--editor-border, #e2e8f0);
  border-radius: 8px;
  background: white;
  cursor: grab;
  touch-action: none;
  transition: all 0.2s ease;
  user-select: none;
  min-height: 80px;
  position: relative;
}

.component-card:hover {
  border-color: var(--editor-primary, #3b82f6);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
  transform: translateY(-1px);
}

.component-card:active {
  cursor: grabbing;
  transform: scale(0.95);
}

.component-card:focus {
  outline: 2px solid var(--editor-primary, #3b82f6);
  outline-offset: 2px;
}

.component-icon {
  font-size: 24px;
  margin-bottom: 8px;
  opacity: 0.8;
}

.component-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--editor-text, #1e293b);
  text-align: center;
  line-height: 1.3;
  word-break: break-word;
}

.component-description {
  font-size: 10px;
  color: var(--editor-secondary, #64748b);
  text-align: center;
  margin-top: 4px;
  line-height: 1.2;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.component-card:hover .component-description {
  opacity: 1;
}

.drag-ghost {
  position: fixed;
  pointer-events: none;
  z-index: 1000;
  opacity: 0.8;
  transform: rotate(3deg);
  background: white;
  border: 2px solid var(--editor-primary, #3b82f6);
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

/* Touch-specific styles */
@media (pointer: coarse) {
  .component-card {
    min-height: 100px;
    padding: 20px 12px;
  }
  
  .component-icon {
    font-size: 28px;
  }
  
  .component-name {
    font-size: 13px;
  }
  
  .component-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .component-card {
    border-width: 2px;
    border-color: black;
  }
  
  .component-card:hover {
    background: black;
    color: white;
  }
}

/* Dark theme */
:host([theme="dark"]) {
  background: #1e293b;
}

:host([theme="dark"]) .palette-header {
  background: #334155;
  border-color: #475569;
}

:host([theme="dark"]) .category-header {
  background: #334155;
  border-color: #475569;
  color: #cbd5e1;
}

:host([theme="dark"]) .component-card {
  background: #334155;
  border-color: #475569;
  color: #f1f5f9;
}

:host([theme="dark"]) .search-box {
  background: #334155;
  border-color: #475569;
  color: #f1f5f9;
}

/* Scrollbar styling */
.palette-content::-webkit-scrollbar {
  width: 8px;
}

.palette-content::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.palette-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.palette-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
`;let b=class extends v{constructor(){super(...arguments),this.theme="light",this.searchQuery="",this.isDragging=!1,this.componentDefinitions=[{type:"text",name:"Text",icon:"📝",category:"Basic",description:"Simple text element",defaultProperties:{text:"Hello World",fontSize:16,fontFamily:"Arial",color:"#000000",backgroundColor:"transparent"},propertySchema:[{key:"text",type:"string",label:"Text Content",default:"Hello World"},{key:"fontSize",type:"number",label:"Font Size",default:16,min:8,max:72},{key:"fontFamily",type:"select",label:"Font Family",default:"Arial",options:["Arial","Helvetica","Georgia","Times New Roman"]},{key:"color",type:"color",label:"Text Color",default:"#000000"}]},{type:"button",name:"Button",icon:"🔘",category:"Basic",description:"Interactive button element",defaultProperties:{text:"Click Me",backgroundColor:"#3b82f6",color:"#ffffff",fontSize:14,borderRadius:6},propertySchema:[{key:"text",type:"string",label:"Button Text",default:"Click Me"},{key:"backgroundColor",type:"color",label:"Background Color",default:"#3b82f6"},{key:"color",type:"color",label:"Text Color",default:"#ffffff"},{key:"fontSize",type:"number",label:"Font Size",default:14,min:8,max:24}]},{type:"image",name:"Image",icon:"🖼️",category:"Media",description:"Image placeholder",defaultProperties:{src:"",alt:"Image description",objectFit:"cover"},propertySchema:[{key:"src",type:"string",label:"Image URL",default:""},{key:"alt",type:"string",label:"Alt Text",default:"Image description"},{key:"objectFit",type:"select",label:"Object Fit",default:"cover",options:["cover","contain","fill","scale-down"]}]},{type:"container",name:"Container",icon:"📦",category:"Layout",description:"Generic container element",defaultProperties:{backgroundColor:"#f8fafc",borderColor:"#e2e8f0",borderWidth:1,borderRadius:8,padding:16},propertySchema:[{key:"backgroundColor",type:"color",label:"Background Color",default:"#f8fafc"},{key:"borderColor",type:"color",label:"Border Color",default:"#e2e8f0"},{key:"borderWidth",type:"number",label:"Border Width",default:1,min:0,max:10},{key:"borderRadius",type:"number",label:"Border Radius",default:8,min:0,max:50}]},{type:"input",name:"Input",icon:"📝",category:"Forms",description:"Text input field",defaultProperties:{placeholder:"Enter text...",type:"text",borderColor:"#e2e8f0",borderWidth:1,borderRadius:6,padding:8},propertySchema:[{key:"placeholder",type:"string",label:"Placeholder",default:"Enter text..."},{key:"type",type:"select",label:"Input Type",default:"text",options:["text","email","password","number","tel"]}]}],this.handleDragStart=(e,t)=>{this.isDragging=!0;const o={type:"component",componentType:t.type,definition:t};e instanceof DragEvent&&(e.dataTransfer.setData("application/json",JSON.stringify(o)),e.dataTransfer.effectAllowed="copy"),this.createDragGhost(t,e),this.dispatchEvent(new CustomEvent("component-drag-start",{detail:o,bubbles:!0}))},this.handleTouchStart=(e,t)=>{e.preventDefault(),e.touches[0]&&(document.addEventListener("touchmove",this.handleTouchMove),document.addEventListener("touchend",this.handleTouchEnd),this.handleDragStart(e,t))},this.handleTouchMove=e=>{if(!this.isDragging)return;e.preventDefault();const t=e.touches[0];if(!t)return;this.updateDragGhostPosition(t.clientX,t.clientY),document.elementFromPoint(t.clientX,t.clientY)?.closest("editor-canvas")&&this.dispatchEvent(new CustomEvent("component-drag-over",{detail:{x:t.clientX,y:t.clientY},bubbles:!0}))},this.handleTouchEnd=e=>{if(e.preventDefault(),document.removeEventListener("touchmove",this.handleTouchMove),document.removeEventListener("touchend",this.handleTouchEnd),!this.isDragging)return;const t=e.changedTouches[0];if(!t)return;document.elementFromPoint(t.clientX,t.clientY)?.closest("editor-canvas")&&this.dispatchEvent(new CustomEvent("component-drop",{detail:{x:t.clientX,y:t.clientY},bubbles:!0})),this.cleanup()},this.handleKeyDown=(e,t)=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this.dispatchEvent(new CustomEvent("component-keyboard-add",{detail:{component:t},bubbles:!0})),this.announceToScreenReader(`Added ${t.name} component to canvas`))}}get filteredComponents(){if(!this.searchQuery.trim())return this.componentDefinitions;const e=this.searchQuery.toLowerCase().trim();return this.componentDefinitions.filter(t=>t.name.toLowerCase().includes(e)||t.category.toLowerCase().includes(e)||t.description.toLowerCase().includes(e))}get categorizedComponents(){const e=new Map;return this.filteredComponents.forEach(t=>{const o=t.category;e.has(o)||e.set(o,[]),e.get(o).push(t)}),Array.from(e.entries()).sort(([t],[o])=>t.localeCompare(o))}handleSearch(e){const t=e.target;this.searchQuery=t.value}createDragGhost(e,t){const o=document.createElement("div");o.className="drag-ghost",o.innerHTML=`
      <div style="font-size: 20px; margin-bottom: 4px;">${e.icon}</div>
      <div style="font-size: 11px; font-weight: 500;">${e.name}</div>
    `,document.body.appendChild(o);const n=t instanceof DragEvent?t.clientX:t.touches[0].clientX,i=t instanceof DragEvent?t.clientY:t.touches[0].clientY;this.updateDragGhostPosition(n,i)}updateDragGhostPosition(e,t){const o=document.querySelector(".drag-ghost");o&&(o.style.left=`${e-30}px`,o.style.top=`${t-30}px`)}cleanup(){this.isDragging=!1;const e=document.querySelector(".drag-ghost");e&&e.remove()}announceToScreenReader(e){const t=document.createElement("div");t.setAttribute("aria-live","polite"),t.setAttribute("aria-atomic","true"),t.style.position="absolute",t.style.left="-10000px",t.style.width="1px",t.style.height="1px",t.style.overflow="hidden",t.textContent=e,document.body.appendChild(t),setTimeout(()=>{document.body.removeChild(t)},1e3)}render(){return s`
      <div class="palette-container">
        <div class="palette-header">
          <h2 class="palette-title">Components</h2>
          <input
            type="text"
            class="search-box"
            placeholder="Search components..."
            .value=${this.searchQuery}
            @input=${this.handleSearch}
            aria-label="Search components">
        </div>
        
        <div class="palette-content" role="region" aria-label="Component Library">
          ${this.categorizedComponents.map(([e,t])=>s`
            <div class="category-section">
              <div class="category-header" role="heading" aria-level="3">
                ${e}
              </div>
              <div class="component-grid" role="group" aria-label="${e} components">
                ${t.map(o=>s`
                  <div
                    class="component-card"
                    draggable="true"
                    tabindex="0"
                    role="button"
                    aria-label="Add ${o.name} component. ${o.description}. Press Enter or Space to add to canvas."
                    @dragstart=${n=>this.handleDragStart(n,o)}
                    @touchstart=${n=>this.handleTouchStart(n,o)}
                    @keydown=${n=>this.handleKeyDown(n,o)}>
                    
                    <div class="component-icon" aria-hidden="true">
                      ${o.icon}
                    </div>
                    <div class="component-name">
                      ${o.name}
                    </div>
                    <div class="component-description">
                      ${o.description}
                    </div>
                  </div>
                `)}
              </div>
            </div>
          `)}
          
          ${this.filteredComponents.length===0?s`
            <div style="padding: 32px; text-align: center; color: var(--editor-secondary, #64748b);">
              <div style="font-size: 24px; margin-bottom: 8px;">🔍</div>
              <div>No components found</div>
              <div style="font-size: 12px; margin-top: 4px;">Try a different search term</div>
            </div>
          `:""}
        </div>
      </div>
    `}};b.styles=_;k([g()],b.prototype,"theme",2);k([l()],b.prototype,"searchQuery",2);k([l()],b.prototype,"isDragging",2);b=k([x("component-palette")],b);var A=Object.defineProperty,B=Object.getOwnPropertyDescriptor,w=(e,t,o,n)=>{for(var i=n>1?void 0:n?B(t,o):t,a=e.length-1,r;a>=0;a--)(r=e[a])&&(i=(n?r(t,o,i):r(i))||i);return n&&i&&A(t,o,i),i};const I=f`
:host {
  display: block;
  height: 100%;
  overflow: hidden;
  background: white;
  touch-action: manipulation;
}

.panel-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid var(--editor-border, #e2e8f0);
  background: #f8fafc;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--editor-text, #1e293b);
  margin: 0;
}

.panel-subtitle {
  font-size: 12px;
  color: var(--editor-secondary, #64748b);
  margin: 4px 0 0 0;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.property-section {
  padding: 16px;
  border-bottom: 1px solid var(--editor-border, #e2e8f0);
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--editor-text, #1e293b);
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.property-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.property-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.property-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--editor-text, #1e293b);
  display: flex;
  align-items: center;
  gap: 4px;
}

.property-description {
  font-size: 11px;
  color: var(--editor-secondary, #64748b);
  line-height: 1.4;
}

.property-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--editor-border, #e2e8f0);
  border-radius: 6px;
  font-size: 13px;
  background: white;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.property-input:focus {
  outline: none;
  border-color: var(--editor-primary, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.property-input:disabled {
  background: #f8fafc;
  color: var(--editor-secondary, #64748b);
  cursor: not-allowed;
}

.color-input {
  height: 36px;
  padding: 4px;
  border-radius: 6px;
  cursor: pointer;
}

.color-input::-webkit-color-swatch {
  border: none;
  border-radius: 2px;
}

.range-input {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--editor-primary, #3b82f6);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.range-input::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--editor-primary, #3b82f6);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.checkbox-input {
  width: 16px;
  height: 16px;
  accent-color: var(--editor-primary, #3b82f6);
}

.select-input {
  cursor: pointer;
}

.range-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-value {
  font-size: 12px;
  color: var(--editor-secondary, #64748b);
  min-width: 40px;
  text-align: right;
  font-family: monospace;
}

.empty-state {
  padding: 32px 16px;
  text-align: center;
  color: var(--editor-secondary, #64748b);
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 12px;
  opacity: 0.6;
}

.empty-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.empty-description {
  font-size: 12px;
  line-height: 1.4;
}

.component-info {
  background: #f1f5f9;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.component-type {
  font-size: 11px;
  font-weight: 600;
  color: var(--editor-primary, #3b82f6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.component-id {
  font-size: 11px;
  color: var(--editor-secondary, #64748b);
  font-family: monospace;
}

.action-buttons {
  padding: 16px;
  border-top: 1px solid var(--editor-border, #e2e8f0);
  display: flex;
  gap: 8px;
}

.action-button {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--editor-border, #e2e8f0);
  border-radius: 6px;
  background: white;
  color: var(--editor-text, #1e293b);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
}

.action-button:hover {
  background: #f8fafc;
  border-color: var(--editor-primary, #3b82f6);
}

.action-button:focus {
  outline: 2px solid var(--editor-primary, #3b82f6);
  outline-offset: 2px;
}

.action-button.danger {
  color: #dc2626;
  border-color: #fca5a5;
}

.action-button.danger:hover {
  background: #fef2f2;
  border-color: #dc2626;
}

/* Touch-specific styles */
@media (pointer: coarse) {
  .property-input {
    min-height: 44px;
    padding: 12px;
    font-size: 16px; /* Prevent zoom on iOS */
  }
  
  .color-input {
    height: 44px;
  }
  
  .range-input::-webkit-slider-thumb {
    width: 24px;
    height: 24px;
  }
  
  .checkbox-input {
    width: 20px;
    height: 20px;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .property-input {
    border-width: 2px;
    border-color: black;
  }
  
  .property-input:focus {
    border-color: black;
    box-shadow: 0 0 0 3px black;
  }
}

/* Dark theme */
:host([theme="dark"]) {
  background: #1e293b;
}

:host([theme="dark"]) .panel-header {
  background: #334155;
  border-color: #475569;
}

:host([theme="dark"]) .property-section {
  border-color: #475569;
}

:host([theme="dark"]) .property-input {
  background: #334155;
  border-color: #475569;
  color: #f1f5f9;
}

:host([theme="dark"]) .component-info {
  background: #334155;
}

:host([theme="dark"]) .action-button {
  background: #334155;
  border-color: #475569;
  color: #f1f5f9;
}

/* Scrollbar styling */
.panel-content::-webkit-scrollbar {
  width: 8px;
}

.panel-content::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.panel-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.panel-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
`;let u=class extends v{constructor(){super(...arguments),this.theme="light",this.selectedComponents=[],this.editingComponent=null,this.handleSelectionChange=e=>{const{selectedComponents:t}=e.detail;t.length===1?this.editingComponent=t[0]:this.editingComponent=null},this.handlePropertyChange=(e,t)=>{this.editingComponent&&(this.editingComponent.properties[e]=t,this.dispatchEvent(new CustomEvent("property-change",{detail:{componentId:this.editingComponent.id,property:e,value:t},bubbles:!0})),this.requestUpdate())},this.handleDuplicate=()=>{this.editingComponent&&this.dispatchEvent(new CustomEvent("component-duplicate",{detail:{componentId:this.editingComponent.id},bubbles:!0}))},this.handleDelete=()=>{this.editingComponent&&confirm(`Are you sure you want to delete the ${this.editingComponent.type} component?`)&&this.dispatchEvent(new CustomEvent("component-delete",{detail:{componentId:this.editingComponent.id},bubbles:!0}))},this.handleBringToFront=()=>{this.editingComponent&&this.dispatchEvent(new CustomEvent("component-bring-to-front",{detail:{componentId:this.editingComponent.id},bubbles:!0}))}}connectedCallback(){super.connectedCallback(),this.addEventListener("selection-change",this.handleSelectionChange)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("selection-change",this.handleSelectionChange)}renderPropertyField(e,t){const o=t??e.default,n=`property-${e.key}`;switch(e.type){case"string":return s`
          <div class="property-field">
            <label class="property-label" for="${n}">
              ${e.label}
              ${e.description?s`
                <span class="property-description" title="${e.description}">ℹ️</span>
              `:""}
            </label>
            ${e.description?s`
              <div class="property-description">${e.description}</div>
            `:""}
            <input
              id="${n}"
              type="text"
              class="property-input"
              .value=${o}
              @input=${i=>{const a=i.target;this.handlePropertyChange(e.key,a.value)}}
              aria-describedby="${e.description?`${n}-desc`:""}">
          </div>
        `;case"number":return s`
          <div class="property-field">
            <label class="property-label" for="${n}">
              ${e.label}
            </label>
            ${e.description?s`
              <div class="property-description">${e.description}</div>
            `:""}
            <input
              id="${n}"
              type="number"
              class="property-input"
              .value=${o}
              min=${e.min??""}
              max=${e.max??""}
              step=${e.step??"1"}
              @input=${i=>{const a=i.target;this.handlePropertyChange(e.key,parseFloat(a.value)||0)}}>
          </div>
        `;case"range":return s`
          <div class="property-field">
            <label class="property-label" for="${n}">
              ${e.label}
            </label>
            ${e.description?s`
              <div class="property-description">${e.description}</div>
            `:""}
            <div class="range-wrapper">
              <input
                id="${n}"
                type="range"
                class="property-input range-input"
                .value=${o}
                min=${e.min??0}
                max=${e.max??100}
                step=${e.step??1}
                @input=${i=>{const a=i.target;this.handlePropertyChange(e.key,parseFloat(a.value))}}
                aria-label="${e.label}: ${o}">
              <span class="range-value">${o}</span>
            </div>
          </div>
        `;case"boolean":return s`
          <div class="property-field">
            <label class="property-label">
              <input
                id="${n}"
                type="checkbox"
                class="checkbox-input"
                .checked=${o}
                @change=${i=>{const a=i.target;this.handlePropertyChange(e.key,a.checked)}}>
              ${e.label}
            </label>
            ${e.description?s`
              <div class="property-description">${e.description}</div>
            `:""}
          </div>
        `;case"color":return s`
          <div class="property-field">
            <label class="property-label" for="${n}">
              ${e.label}
            </label>
            ${e.description?s`
              <div class="property-description">${e.description}</div>
            `:""}
            <input
              id="${n}"
              type="color"
              class="property-input color-input"
              .value=${o}
              @input=${i=>{const a=i.target;this.handlePropertyChange(e.key,a.value)}}>
          </div>
        `;case"select":return s`
          <div class="property-field">
            <label class="property-label" for="${n}">
              ${e.label}
            </label>
            ${e.description?s`
              <div class="property-description">${e.description}</div>
            `:""}
            <select
              id="${n}"
              class="property-input select-input"
              @change=${i=>{const a=i.target;this.handlePropertyChange(e.key,a.value)}}>
              ${e.options?.map(i=>s`
                <option value="${i}" ?selected=${o===i}>
                  ${i}
                </option>
              `)}
            </select>
          </div>
        `;default:return s`
          <div class="property-field">
            <div class="property-label">Unsupported property type: ${e.type}</div>
          </div>
        `}}getPropertySchema(e){switch(e){case"text":return[{key:"text",type:"string",label:"Text Content",default:"Hello World"},{key:"fontSize",type:"range",label:"Font Size",default:16,min:8,max:72},{key:"color",type:"color",label:"Text Color",default:"#000000"},{key:"fontFamily",type:"select",label:"Font Family",default:"Arial",options:["Arial","Helvetica","Georgia","Times New Roman"]}];case"button":return[{key:"text",type:"string",label:"Button Text",default:"Click Me"},{key:"backgroundColor",type:"color",label:"Background Color",default:"#3b82f6"},{key:"color",type:"color",label:"Text Color",default:"#ffffff"},{key:"fontSize",type:"range",label:"Font Size",default:14,min:8,max:24}];default:return[]}}render(){if(!this.editingComponent)return s`
        <div class="panel-container">
          <div class="panel-header">
            <h2 class="panel-title">Properties</h2>
            <p class="panel-subtitle">Select a component to edit its properties</p>
          </div>
          
          <div class="empty-state">
            <div class="empty-icon">⚙️</div>
            <div class="empty-title">No Component Selected</div>
            <div class="empty-description">
              Click on a component in the canvas to view and edit its properties.
            </div>
          </div>

          <!-- Sample controls for testing purposes -->
          <div class="property-section">
            <h3 class="section-title">
              <span>📋</span>
              General Settings
            </h3>
            <div class="property-group">
              <div class="property-field">
                <label class="property-label">Canvas Background</label>
                <input
                  type="color"
                  class="property-input color-input"
                  value="#ffffff"
                  disabled>
              </div>
              <div class="property-field">
                <label class="property-label">Grid Size</label>
                <input
                  type="range"
                  class="property-input range-input"
                  min="10"
                  max="50"
                  value="20"
                  disabled>
              </div>
              <div class="property-field">
                <label class="property-label">Snap to Grid</label>
                <input
                  type="checkbox"
                  class="property-input checkbox-input"
                  checked
                  disabled>
              </div>
            </div>
          </div>
        </div>
      `;const e=this.getPropertySchema(this.editingComponent.type);return s`
      <div class="panel-container" role="region" aria-label="Component Properties">
        <div class="panel-header">
          <h2 class="panel-title">Properties</h2>
          <p class="panel-subtitle">Edit component settings</p>
        </div>
        
        <div class="panel-content">
          <div class="property-section">
            <div class="component-info">
              <div class="component-type">${this.editingComponent.type}</div>
              <div class="component-id">ID: ${this.editingComponent.id}</div>
            </div>
          </div>

          <div class="property-section">
            <h3 class="section-title">
              <span>📐</span>
              Dimensions & Position
            </h3>
            <div class="property-group">
              <div class="property-field">
                <label class="property-label">X Position</label>
                <input
                  type="number"
                  class="property-input"
                  .value=${this.editingComponent.bounds.x}
                  @input=${t=>{const o=t.target,n={...this.editingComponent.bounds,x:parseFloat(o.value)||0};this.handlePropertyChange("bounds",n)}}>
              </div>
              <div class="property-field">
                <label class="property-label">Y Position</label>
                <input
                  type="number"
                  class="property-input"
                  .value=${this.editingComponent.bounds.y}
                  @input=${t=>{const o=t.target,n={...this.editingComponent.bounds,y:parseFloat(o.value)||0};this.handlePropertyChange("bounds",n)}}>
              </div>
              <div class="property-field">
                <label class="property-label">Width</label>
                <input
                  type="number"
                  class="property-input"
                  .value=${this.editingComponent.bounds.width}
                  min="1"
                  @input=${t=>{const o=t.target,n={...this.editingComponent.bounds,width:Math.max(1,parseFloat(o.value)||1)};this.handlePropertyChange("bounds",n)}}>
              </div>
              <div class="property-field">
                <label class="property-label">Height</label>
                <input
                  type="number"
                  class="property-input"
                  .value=${this.editingComponent.bounds.height}
                  min="1"
                  @input=${t=>{const o=t.target,n={...this.editingComponent.bounds,height:Math.max(1,parseFloat(o.value)||1)};this.handlePropertyChange("bounds",n)}}>
              </div>
            </div>
          </div>

          ${e.length>0?s`
            <div class="property-section">
              <h3 class="section-title">
                <span>🎨</span>
                Appearance
              </h3>
              <div class="property-group">
                ${e.map(t=>this.renderPropertyField(t,this.editingComponent.properties[t.key]))}
              </div>
            </div>
          `:""}
        </div>
        
        <div class="action-buttons">
          <button
            class="action-button"
            @click=${this.handleDuplicate}
            title="Duplicate this component"
            aria-label="Duplicate component">
            📋 Duplicate
          </button>
          <button
            class="action-button"
            @click=${this.handleBringToFront}
            title="Bring this component to front"
            aria-label="Bring to front">
            ⬆️ To Front
          </button>
          <button
            class="action-button danger"
            @click=${this.handleDelete}
            title="Delete this component"
            aria-label="Delete component">
            🗑️ Delete
          </button>
        </div>
      </div>
    `}};u.styles=I;w([g()],u.prototype,"theme",2);w([g()],u.prototype,"selectedComponents",2);w([l()],u.prototype,"editingComponent",2);u=w([x("control-panel")],u);var j=Object.defineProperty,K=Object.getOwnPropertyDescriptor,y=(e,t,o,n)=>{for(var i=n>1?void 0:n?K(t,o):t,a=e.length-1,r;a>=0;a--)(r=e[a])&&(i=(n?r(t,o,i):r(i))||i);return n&&i&&j(t,o,i),i};const U=f`
:host {
  display: block;
  width: 100%;
  height: 100%;
  background: white;
  border-bottom: 1px solid var(--editor-border, #e2e8f0);
  touch-action: manipulation;
}

.toolbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 16px;
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  color: var(--editor-text, #1e293b);
}

.logo {
  font-size: 20px;
}

.logo-text {
  font-size: 16px;
  color: var(--editor-text, #1e293b);
}

.toolbar-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid var(--editor-border, #e2e8f0);
  border-radius: 6px;
  background: white;
  color: var(--editor-text, #1e293b);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  touch-action: manipulation;
  transition: all 0.2s ease;
  min-height: 36px;
  text-decoration: none;
}

.toolbar-button:hover {
  background: #f8fafc;
  border-color: var(--editor-primary, #3b82f6);
  color: var(--editor-primary, #3b82f6);
}

.toolbar-button:focus {
  outline: 2px solid var(--editor-primary, #3b82f6);
  outline-offset: 2px;
}

.toolbar-button:active {
  transform: scale(0.98);
}

.toolbar-button.active {
  background: var(--editor-primary, #3b82f6);
  color: white;
  border-color: var(--editor-primary, #3b82f6);
}

.toolbar-button.primary {
  background: var(--editor-primary, #3b82f6);
  color: white;
  border-color: var(--editor-primary, #3b82f6);
}

.toolbar-button.primary:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background: var(--editor-border, #e2e8f0);
  margin: 0 4px;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid var(--editor-border, #e2e8f0);
}

.zoom-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--editor-text, #1e293b);
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.zoom-button:hover {
  background: white;
}

.zoom-button:focus {
  outline: 2px solid var(--editor-primary, #3b82f6);
  outline-offset: 1px;
}

.zoom-level {
  font-size: 12px;
  font-weight: 500;
  color: var(--editor-text, #1e293b);
  min-width: 40px;
  text-align: center;
  font-family: monospace;
}

.theme-toggle {
  position: relative;
  width: 48px;
  height: 24px;
  background: var(--editor-border, #e2e8f0);
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s ease;
  border: none;
  outline: none;
}

.theme-toggle.dark {
  background: var(--editor-primary, #3b82f6);
}

.theme-toggle:focus {
  box-shadow: 0 0 0 2px var(--editor-primary, #3b82f6);
}

.theme-toggle::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.theme-toggle.dark::before {
  transform: translateX(24px);
}

.theme-toggle::after {
  content: '☀️';
  position: absolute;
  top: 50%;
  left: 6px;
  transform: translateY(-50%);
  font-size: 12px;
  transition: opacity 0.3s ease;
}

.theme-toggle.dark::after {
  content: '🌙';
  left: 30px;
}

/* Mobile layout */
@media (max-width: 768px) {
  .toolbar-container {
    padding: 0 12px;
    gap: 8px;
  }

  .toolbar-button {
    padding: 6px 8px;
    font-size: 12px;
    min-height: 32px;
  }

  .logo-text {
    display: none;
  }

  .zoom-controls {
    display: none;
  }

  /* Show undo/redo buttons on mobile, hide other center items */
  .toolbar-section.center .zoom-controls {
    display: none;
  }

  .toolbar-section.center .toolbar-divider {
    display: none;
  }

  /* Ensure undo/redo buttons are visible */
  .toolbar-section.center button[title*="Undo"],
  .toolbar-section.center button[title*="Redo"] {
    display: flex;
  }
}

/* Touch-specific styles */
@media (pointer: coarse) {
  .toolbar-button {
    min-height: 44px;
    padding: 10px 14px;
  }

  .zoom-button {
    width: 36px;
    height: 36px;
  }

  .theme-toggle {
    width: 56px;
    height: 32px;
    border-radius: 16px;
  }

  .theme-toggle::before {
    width: 28px;
    height: 28px;
    top: 2px;
    left: 2px;
  }

  .theme-toggle.dark::before {
    transform: translateX(24px);
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .toolbar-button {
    border-width: 2px;
    border-color: black;
  }

  .zoom-controls {
    border-width: 2px;
    border-color: black;
  }

  .theme-toggle {
    border: 2px solid black;
  }
}

/* Dark theme */
:host([theme="dark"]) {
  background: #1e293b;
  border-color: #475569;
}

:host([theme="dark"]) .toolbar-button {
  background: #334155;
  border-color: #475569;
  color: #f1f5f9;
}

:host([theme="dark"]) .toolbar-button:hover {
  background: #475569;
  border-color: #3b82f6;
  color: #3b82f6;
}

:host([theme="dark"]) .zoom-controls {
  background: #334155;
  border-color: #475569;
}

:host([theme="dark"]) .zoom-button:hover {
  background: #475569;
}
`;let h=class extends v{constructor(){super(...arguments),this.theme="light",this.zoomLevel=100,this.canUndo=!1,this.canRedo=!1,this.handleUndo=()=>{this.dispatchEvent(new CustomEvent("editor-undo",{bubbles:!0}))},this.handleRedo=()=>{this.dispatchEvent(new CustomEvent("editor-redo",{bubbles:!0}))},this.handleNew=()=>{confirm("Create a new document? This will clear the current canvas.")&&this.dispatchEvent(new CustomEvent("editor-new",{bubbles:!0}))},this.handleSave=()=>{this.dispatchEvent(new CustomEvent("editor-save",{bubbles:!0}))},this.handleLoad=()=>{const e=document.createElement("input");e.type="file",e.accept=".json",e.onchange=t=>{const o=t.target.files?.[0];o&&this.dispatchEvent(new CustomEvent("editor-load",{detail:{file:o},bubbles:!0}))},e.click()},this.handleExport=()=>{this.dispatchEvent(new CustomEvent("editor-export",{bubbles:!0}))},this.handleZoomIn=()=>{this.zoomLevel=Math.min(500,this.zoomLevel+25),this.dispatchEvent(new CustomEvent("editor-zoom",{detail:{zoom:this.zoomLevel/100},bubbles:!0}))},this.handleZoomOut=()=>{this.zoomLevel=Math.max(25,this.zoomLevel-25),this.dispatchEvent(new CustomEvent("editor-zoom",{detail:{zoom:this.zoomLevel/100},bubbles:!0}))},this.handleZoomReset=()=>{this.zoomLevel=100,this.dispatchEvent(new CustomEvent("editor-zoom",{detail:{zoom:1},bubbles:!0}))},this.handleThemeToggle=()=>{const e=this.theme==="light"?"dark":"light";this.dispatchEvent(new CustomEvent("theme-change",{detail:{theme:e},bubbles:!0}))},this.handleKeyboardShortcut=e=>{if(e.ctrlKey||e.metaKey)switch(e.key){case"n":e.preventDefault(),this.handleNew();break;case"s":e.preventDefault(),this.handleSave();break;case"o":e.preventDefault(),this.handleLoad();break;case"e":e.preventDefault(),this.handleExport();break;case"z":e.preventDefault(),e.shiftKey?this.handleRedo():this.handleUndo();break;case"=":case"+":e.preventDefault(),this.handleZoomIn();break;case"-":e.preventDefault(),this.handleZoomOut();break;case"0":e.preventDefault(),this.handleZoomReset();break}}}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this.handleKeyboardShortcut),setTimeout(()=>{this.canUndo=!0,this.canRedo=!0},100)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this.handleKeyboardShortcut)}render(){return s`
      <div class="toolbar-container" role="toolbar" aria-label="Editor Toolbar">
        <div class="toolbar-section">
          <div class="logo-section">
            <span class="logo" role="img" aria-label="Editor Logo">🎨</span>
            <span class="logo-text">Open Editor</span>
          </div>
          
          <div class="toolbar-divider"></div>
          
          <button
            class="toolbar-button"
            @click=${this.handleNew}
            title="New Document (Ctrl+N)"
            aria-label="Create new document">
            <span role="img" aria-hidden="true">📄</span>
            New
          </button>
          
          <button
            class="toolbar-button"
            @click=${this.handleSave}
            title="Save Document (Ctrl+S)"
            aria-label="Save document">
            <span role="img" aria-hidden="true">💾</span>
            Save
          </button>
          
          <button
            class="toolbar-button"
            @click=${this.handleLoad}
            title="Load Document (Ctrl+O)"
            aria-label="Load document">
            <span role="img" aria-hidden="true">📂</span>
            Load
          </button>
          
          <button
            class="toolbar-button"
            @click=${this.handleExport}
            title="Export (Ctrl+E)"
            aria-label="Export document">
            <span role="img" aria-hidden="true">📤</span>
            Export
          </button>
        </div>

        <div class="toolbar-section center">
          <button
            class="toolbar-button"
            @click=${this.handleUndo}
            ?disabled=${!this.canUndo}
            title="Undo (Ctrl+Z)"
            aria-label="Undo last action">
            <span role="img" aria-hidden="true">↶</span>
            Undo
          </button>
          
          <button
            class="toolbar-button"
            @click=${this.handleRedo}
            ?disabled=${!this.canRedo}
            title="Redo (Ctrl+Shift+Z)"
            aria-label="Redo last action">
            <span role="img" aria-hidden="true">↷</span>
            Redo
          </button>
          
          <div class="toolbar-divider"></div>
          
          <div class="zoom-controls" role="group" aria-label="Zoom Controls">
            <button
              class="zoom-button"
              @click=${this.handleZoomOut}
              title="Zoom Out (Ctrl+-)"
              aria-label="Zoom out">
              <span role="img" aria-hidden="true">🔍-</span>
            </button>
            
            <button
              class="zoom-level"
              @click=${this.handleZoomReset}
              title="Reset Zoom (Ctrl+0)"
              aria-label="Reset zoom to 100%">
              ${this.zoomLevel}%
            </button>
            
            <button
              class="zoom-button"
              @click=${this.handleZoomIn}
              title="Zoom In (Ctrl++)"
              aria-label="Zoom in">
              <span role="img" aria-hidden="true">🔍+</span>
            </button>
          </div>
        </div>

        <div class="toolbar-section">
          <button
            class="theme-toggle ${this.theme==="dark"?"dark":""}"
            @click=${this.handleThemeToggle}
            title="Toggle Theme"
            aria-label="Toggle between light and dark theme"
            role="switch"
            aria-checked=${this.theme==="dark"}>
          </button>
          
          <div class="toolbar-divider"></div>
          
          <button
            class="toolbar-button"
            @click=${()=>window.open("https://github.com/your-repo/open-editor-framework","_blank")}
            title="View on GitHub"
            aria-label="View project on GitHub">
            <span role="img" aria-hidden="true">⭐</span>
            GitHub
          </button>
        </div>
      </div>
    `}};h.styles=U;y([g()],h.prototype,"theme",2);y([l()],h.prototype,"zoomLevel",2);y([l()],h.prototype,"canUndo",2);y([l()],h.prototype,"canRedo",2);h=y([x("editor-toolbar")],h);var W=Object.defineProperty,Z=Object.getOwnPropertyDescriptor,C=(e,t,o,n)=>{for(var i=n>1?void 0:n?Z(t,o):t,a=e.length-1,r;a>=0;a--)(r=e[a])&&(i=(n?r(t,o,i):r(i))||i);return n&&i&&W(t,o,i),i};let m=class extends v{constructor(){super(...arguments),this.theme="light",this.isMobile=!1,this.activeMobileTab="canvas",this.handleResize=()=>{this.checkMobileLayout()},this.handleThemeChange=e=>{this.theme=e.matches?"dark":"light"},this.handleTouchStart=e=>{const t=e.currentTarget;t.style.transform="scale(0.95)",setTimeout(()=>{t.style.transform=""},100)}}connectedCallback(){super.connectedCallback(),this.checkMobileLayout(),window.addEventListener("resize",this.handleResize);const e=window.matchMedia("(prefers-color-scheme: dark)");e.addEventListener("change",this.handleThemeChange),this.handleThemeChange(e)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("resize",this.handleResize),window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change",this.handleThemeChange)}checkMobileLayout(){this.isMobile=window.innerWidth<=768}handleMobileTabClick(e){this.activeMobileTab=e,"vibrate"in navigator&&navigator.vibrate(10)}render(){return s`
      <div class="editor-container" role="application" aria-label="Web Component Editor">
        <div class="toolbar-area">
          <editor-toolbar 
            .theme=${this.theme}
            @theme-change=${e=>this.theme=e.detail.theme}>
          </editor-toolbar>
        </div>

        <div class="palette-area ${this.isMobile&&this.activeMobileTab==="palette"?"mobile-active":""}">
          <component-palette 
            .theme=${this.theme}
            aria-label="Component Library">
          </component-palette>
        </div>

        <div class="canvas-area ${!this.isMobile||this.activeMobileTab==="canvas"?"mobile-active":""}">
          <editor-canvas 
            .theme=${this.theme}
            aria-label="Design Canvas">
          </editor-canvas>
        </div>

        <div class="controls-area ${this.isMobile&&this.activeMobileTab==="controls"?"mobile-active":""}">
          <control-panel 
            .theme=${this.theme}
            aria-label="Properties Panel">
          </control-panel>
        </div>

        ${this.isMobile?s`
          <div class="mobile-tabs" role="tablist" aria-label="Editor Sections">
            <button 
              class="mobile-tab ${this.activeMobileTab==="palette"?"active":""}"
              role="tab"
              aria-selected=${this.activeMobileTab==="palette"}
              aria-controls="palette-panel"
              @click=${()=>this.handleMobileTabClick("palette")}
              @touchstart=${this.handleTouchStart}>
              <span aria-hidden="true">🎨</span>
              Components
            </button>
            <button 
              class="mobile-tab ${this.activeMobileTab==="canvas"?"active":""}"
              role="tab"
              aria-selected=${this.activeMobileTab==="canvas"}
              aria-controls="canvas-panel"
              @click=${()=>this.handleMobileTabClick("canvas")}
              @touchstart=${this.handleTouchStart}>
              <span aria-hidden="true">🎯</span>
              Canvas
            </button>
            <button 
              class="mobile-tab ${this.activeMobileTab==="controls"?"active":""}"
              role="tab"
              aria-selected=${this.activeMobileTab==="controls"}
              aria-controls="controls-panel"
              @click=${()=>this.handleMobileTabClick("controls")}
              @touchstart=${this.handleTouchStart}>
              <span aria-hidden="true">⚙️</span>
              Properties
            </button>
          </div>
        `:""}
      </div>
    `}};m.styles=f`
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      touch-action: manipulation;
      background-color: #f8fafc;
      color: #1e293b;
      --editor-bg: #f8fafc;
      --editor-border: #e2e8f0;
      --editor-text: #1e293b;
      --editor-primary: #3b82f6;
      --editor-secondary: #64748b;
    }

    .editor-container {
      display: grid;
      grid-template-areas: 
        'toolbar toolbar toolbar'
        'palette canvas controls';
      grid-template-columns: 280px 1fr 320px;
      grid-template-rows: 60px 1fr;
      height: 100vh;
      background: var(--editor-bg);
      gap: 1px;
    }

    .toolbar-area {
      grid-area: toolbar;
      border-bottom: 1px solid var(--editor-border);
      background: white;
    }

    .palette-area {
      grid-area: palette;
      background: white;
      border-right: 1px solid var(--editor-border);
      overflow: hidden;
    }

    .canvas-area {
      grid-area: canvas;
      background: var(--editor-bg);
      position: relative;
      overflow: hidden;
    }

    .controls-area {
      grid-area: controls;
      background: white;
      border-left: 1px solid var(--editor-border);
      overflow: hidden;
    }

    /* Mobile layout */
    @media (max-width: 768px) {
      .editor-container {
        grid-template-areas: 
          'toolbar'
          'mobile-content'
          'mobile-tabs';
        grid-template-columns: 1fr;
        grid-template-rows: 60px 1fr 60px;
      }

      .canvas-area {
        grid-area: mobile-content;
      }

      .palette-area,
      .controls-area {
        grid-area: mobile-content;
        display: none;
      }

      .palette-area.mobile-active,
      .controls-area.mobile-active {
        display: block;
      }

      .canvas-area.mobile-active {
        display: block;
      }

      .canvas-area:not(.mobile-active) {
        display: none;
      }

      .mobile-tabs {
        grid-area: mobile-tabs;
        background: white;
        border-top: 1px solid var(--editor-border);
        display: flex;
        justify-content: space-around;
        align-items: center;
      }

    .mobile-tab {
      flex: 1;
      height: 100%;
      border: none;
      background: transparent;
      color: var(--editor-secondary);
      font-size: 14px;
      cursor: pointer;
      touch-action: manipulation;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }

      .mobile-tab:hover,
      .mobile-tab.active {
        color: var(--editor-primary);
        background: #f1f5f9;
      }

      .mobile-tab:focus {
        outline: 2px solid var(--editor-primary);
        outline-offset: -2px;
      }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      :host {
        --editor-border: #000000;
        --editor-text: #000000;
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      * {
        transition: none !important;
        animation: none !important;
      }
    }
  `;C([l()],m.prototype,"theme",2);C([l()],m.prototype,"isMobile",2);C([l()],m.prototype,"activeMobileTab",2);m=C([x("editor-app")],m);"serviceWorker"in navigator&&window.addEventListener("load",async()=>{try{const e=await navigator.serviceWorker.register("/sw.js");console.log("SW registered: ",e)}catch(e){console.log("SW registration failed: ",e)}});
