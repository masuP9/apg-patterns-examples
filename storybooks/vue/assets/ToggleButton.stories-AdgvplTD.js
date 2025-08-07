import{d as v,r as B,c as g,a as y,b as i,e as h,t as _,n as C,m as k,o as P}from"./iframe-BSoZvMZB.js";import"./preload-helper-C1FmrZbK.js";const D=["aria-pressed"],w={class:"apg-toggle-button-content"},l=v({inheritAttrs:!1,__name:"ToggleButton",props:{initialPressed:{type:Boolean,default:!1},onToggle:{type:Function,default:void 0}},emits:["toggle"],setup(o,{emit:c}){const s=o,m=c,t=B(s.initialPressed),r=()=>{var n;const e=!t.value;t.value=e,(n=s.onToggle)==null||n.call(s,e),m("toggle",e)},f=e=>{(e.key===" "||e.key==="Enter")&&(e.preventDefault(),r())},T=g(()=>`apg-toggle-button ${t.value?"apg-toggle-button--pressed":"apg-toggle-button--not-pressed"}`.trim()),b=g(()=>`apg-toggle-indicator ${t.value?"apg-toggle-indicator--pressed":"apg-toggle-indicator--not-pressed"}`);return(e,n)=>(P(),y("button",k({type:"button",class:T.value,"aria-pressed":t.value},e.$attrs,{onClick:r,onKeyup:f}),[i("span",w,[h(e.$slots,"default")]),i("span",{class:C(b.value),"aria-hidden":"true"},_(t.value?"●":"○"),3)],16,D))}});l.__docgenInfo={exportName:"default",displayName:"ToggleButton",description:"",tags:{},props:[{name:"initialPressed",description:"Initial pressed state",required:!1,type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"onToggle",description:"Callback fired when toggle state changes",required:!1,type:{name:"TSFunctionType"},defaultValue:{func:!1,value:"undefined"}}],events:[{name:"toggle",type:{names:["boolean"]}}],slots:[{name:"default"}],sourceFiles:["/home/runner/work/apg-patterns-examples/apg-patterns-examples/demos/vue/src/components/Button/ToggleButton.vue"]};const S={title:"APG/ToggleButton",component:l,tags:["autodocs"],argTypes:{initialPressed:{control:"boolean",description:"Initial pressed state of the toggle button"},onToggle:{action:"toggle",description:"Event emitted when the button is toggled"}}},a={args:{initialPressed:!1},render:o=>({components:{ToggleButton:l},setup(){return{args:o}},template:'<ToggleButton v-bind="args">🌙 Dark Mode</ToggleButton>'})};var u,d,p;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    initialPressed: false
  },
  render: args => ({
    components: {
      ToggleButton
    },
    setup() {
      return {
        args
      };
    },
    template: '<ToggleButton v-bind="args">🌙 Dark Mode</ToggleButton>'
  })
}`,...(p=(d=a.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};const $=["Default"];export{a as Default,$ as __namedExportsOrder,S as default};
