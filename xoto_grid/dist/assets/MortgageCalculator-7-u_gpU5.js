import{r as c,dP as R,j as e,a as Oe}from"./index-GdvsrsK9.js";let He={data:""},Ue=t=>{if(typeof window=="object"){let r=(t?t.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return r.nonce=window.__nonce__,r.parentNode||(t||document.head).appendChild(r),r.firstChild}return t||He},Xe=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,Ve=/\/\*[^]*?\*\/|  +/g,xe=/\n+/g,B=(t,r)=>{let n="",s="",d="";for(let l in t){let i=t[l];l[0]=="@"?l[1]=="i"?n=l+" "+i+";":s+=l[1]=="f"?B(i,l):l+"{"+B(i,l[1]=="k"?"":r)+"}":typeof i=="object"?s+=B(i,r?r.replace(/([^,])+/g,a=>l.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,g=>/&/.test(g)?g.replace(/&/g,a):a?a+" "+g:g)):l):i!=null&&(l=l[1]=="-"?l:l.replace(/[A-Z]/g,"-$&").toLowerCase(),d+=B.p?B.p(l,i):l+":"+i+";")}return n+(r&&d?r+"{"+d+"}":d)+s},z={},ve=t=>{if(typeof t=="object"){let r="";for(let n in t)r+=n+ve(t[n]);return r}return t},Ye=(t,r,n,s,d)=>{let l=ve(t),i=z[l]||(z[l]=(g=>{let u=0,h=11;for(;u<g.length;)h=101*h+g.charCodeAt(u++)>>>0;return"go"+h})(l));if(!z[i]){let g=l!==t?t:(u=>{let h,o,m=[{}];for(;h=Xe.exec(u.replace(Ve,""));)h[4]?m.shift():h[3]?(o=h[3].replace(xe," ").trim(),m.unshift(m[0][o]=m[0][o]||{})):m[0][h[1]]=h[2].replace(xe," ").trim();return m[0]})(t);z[i]=B(d?{["@keyframes "+i]:g}:g,n?"":"."+i)}let a=n&&z.g;return n&&(z.g=z[i]),((g,u,h,o)=>{o?u.data=u.data.replace(o,g):u.data.indexOf(g)===-1&&(u.data=h?g+u.data:u.data+g)})(z[i],r,s,a),i},qe=(t,r,n)=>t.reduce((s,d,l)=>{let i=r[l];if(i&&i.call){let a=i(n),g=a&&a.props&&a.props.className||/^go/.test(a)&&a;i=g?"."+g:a&&typeof a=="object"?a.props?"":B(a,""):a===!1?"":a}return s+d+(i??"")},"");function K(t){let r=this||{},n=t.call?t(r.p):t;return Ye(n.unshift?n.raw?qe(n,[].slice.call(arguments,1),r.p):n.reduce((s,d)=>Object.assign(s,d&&d.call?d(r.p):d),{}):n,Ue(r.target),r.g,r.o,r.k)}let je,se,le;K.bind({g:1});let A=K.bind({k:1});function _e(t,r,n,s){B.p=r,je=t,se=n,le=s}function M(t,r){let n=this||{};return function(){let s=arguments;function d(l,i){let a=Object.assign({},l),g=a.className||d.className;n.p=Object.assign({theme:se&&se()},a),n.o=/go\d/.test(g),a.className=K.apply(n,s)+(g?" "+g:"");let u=t;return t[0]&&(u=a.as||t,delete a.as),le&&u[0]&&le(a),je(u,a)}return r?r(d):d}}var Ge=t=>typeof t=="function",G=(t,r)=>Ge(t)?t(r):t,Ke=(()=>{let t=0;return()=>(++t).toString()})(),Ce=(()=>{let t;return()=>{if(t===void 0&&typeof window<"u"){let r=matchMedia("(prefers-reduced-motion: reduce)");t=!r||r.matches}return t}})(),Qe=20,ce="default",Fe=(t,r)=>{let{toastLimit:n}=t.settings;switch(r.type){case 0:return{...t,toasts:[r.toast,...t.toasts].slice(0,n)};case 1:return{...t,toasts:t.toasts.map(i=>i.id===r.toast.id?{...i,...r.toast}:i)};case 2:let{toast:s}=r;return Fe(t,{type:t.toasts.find(i=>i.id===s.id)?1:0,toast:s});case 3:let{toastId:d}=r;return{...t,toasts:t.toasts.map(i=>i.id===d||d===void 0?{...i,dismissed:!0,visible:!1}:i)};case 4:return r.toastId===void 0?{...t,toasts:[]}:{...t,toasts:t.toasts.filter(i=>i.id!==r.toastId)};case 5:return{...t,pausedAt:r.time};case 6:let l=r.time-(t.pausedAt||0);return{...t,pausedAt:void 0,toasts:t.toasts.map(i=>({...i,pauseDuration:i.pauseDuration+l}))}}},_=[],we={toasts:[],pausedAt:void 0,settings:{toastLimit:Qe}},E={},Se=(t,r=ce)=>{E[r]=Fe(E[r]||we,t),_.forEach(([n,s])=>{n===r&&s(E[r])})},Ee=t=>Object.keys(E).forEach(r=>Se(t,r)),Ze=t=>Object.keys(E).find(r=>E[r].toasts.some(n=>n.id===t)),Q=(t=ce)=>r=>{Se(r,t)},Je={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},et=(t={},r=ce)=>{let[n,s]=c.useState(E[r]||we),d=c.useRef(E[r]);c.useEffect(()=>(d.current!==E[r]&&s(E[r]),_.push([r,s]),()=>{let i=_.findIndex(([a])=>a===r);i>-1&&_.splice(i,1)}),[r]);let l=n.toasts.map(i=>{var a,g,u;return{...t,...t[i.type],...i,removeDelay:i.removeDelay||((a=t[i.type])==null?void 0:a.removeDelay)||(t==null?void 0:t.removeDelay),duration:i.duration||((g=t[i.type])==null?void 0:g.duration)||(t==null?void 0:t.duration)||Je[i.type],style:{...t.style,...(u=t[i.type])==null?void 0:u.style,...i.style}}});return{...n,toasts:l}},tt=(t,r="blank",n)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:r,ariaProps:{role:"status","aria-live":"polite"},message:t,pauseDuration:0,...n,id:(n==null?void 0:n.id)||Ke()}),U=t=>(r,n)=>{let s=tt(r,t,n);return Q(s.toasterId||Ze(s.id))({type:2,toast:s}),s.id},v=(t,r)=>U("blank")(t,r);v.error=U("error");v.success=U("success");v.loading=U("loading");v.custom=U("custom");v.dismiss=(t,r)=>{let n={type:3,toastId:t};r?Q(r)(n):Ee(n)};v.dismissAll=t=>v.dismiss(void 0,t);v.remove=(t,r)=>{let n={type:4,toastId:t};r?Q(r)(n):Ee(n)};v.removeAll=t=>v.remove(void 0,t);v.promise=(t,r,n)=>{let s=v.loading(r.loading,{...n,...n==null?void 0:n.loading});return typeof t=="function"&&(t=t()),t.then(d=>{let l=r.success?G(r.success,d):void 0;return l?v.success(l,{id:s,...n,...n==null?void 0:n.success}):v.dismiss(s),d}).catch(d=>{let l=r.error?G(r.error,d):void 0;l?v.error(l,{id:s,...n,...n==null?void 0:n.error}):v.dismiss(s)}),t};var rt=1e3,nt=(t,r="default")=>{let{toasts:n,pausedAt:s}=et(t,r),d=c.useRef(new Map).current,l=c.useCallback((o,m=rt)=>{if(d.has(o))return;let x=setTimeout(()=>{d.delete(o),i({type:4,toastId:o})},m);d.set(o,x)},[]);c.useEffect(()=>{if(s)return;let o=Date.now(),m=n.map(x=>{if(x.duration===1/0)return;let j=(x.duration||0)+x.pauseDuration-(o-x.createdAt);if(j<0){x.visible&&v.dismiss(x.id);return}return setTimeout(()=>v.dismiss(x.id,r),j)});return()=>{m.forEach(x=>x&&clearTimeout(x))}},[n,s,r]);let i=c.useCallback(Q(r),[r]),a=c.useCallback(()=>{i({type:5,time:Date.now()})},[i]),g=c.useCallback((o,m)=>{i({type:1,toast:{id:o,height:m}})},[i]),u=c.useCallback(()=>{s&&i({type:6,time:Date.now()})},[s,i]),h=c.useCallback((o,m)=>{let{reverseOrder:x=!1,gutter:j=8,defaultPosition:F}=m||{},w=n.filter(f=>(f.position||F)===(o.position||F)&&f.height),N=w.findIndex(f=>f.id===o.id),b=w.filter((f,O)=>O<N&&f.visible).length;return w.filter(f=>f.visible).slice(...x?[b+1]:[0,b]).reduce((f,O)=>f+(O.height||0)+j,0)},[n]);return c.useEffect(()=>{n.forEach(o=>{if(o.dismissed)l(o.id,o.removeDelay);else{let m=d.get(o.id);m&&(clearTimeout(m),d.delete(o.id))}})},[n,l]),{toasts:n,handlers:{updateHeight:g,startPause:a,endPause:u,calculateOffset:h}}},it=A`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,ot=A`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,at=A`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,st=M("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${it} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${ot} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${t=>t.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${at} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,lt=A`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,dt=M("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${t=>t.secondary||"#e0e0e0"};
  border-right-color: ${t=>t.primary||"#616161"};
  animation: ${lt} 1s linear infinite;
`,ct=A`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,pt=A`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,ut=M("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ct} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${pt} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${t=>t.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,gt=M("div")`
  position: absolute;
`,mt=M("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,ht=A`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ft=M("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${ht} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,xt=({toast:t})=>{let{icon:r,type:n,iconTheme:s}=t;return r!==void 0?typeof r=="string"?c.createElement(ft,null,r):r:n==="blank"?null:c.createElement(mt,null,c.createElement(dt,{...s}),n!=="loading"&&c.createElement(gt,null,n==="error"?c.createElement(st,{...s}):c.createElement(ut,{...s})))},yt=t=>`
0% {transform: translate3d(0,${t*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,bt=t=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${t*-150}%,-1px) scale(.6); opacity:0;}
`,vt="0%{opacity:0;} 100%{opacity:1;}",jt="0%{opacity:1;} 100%{opacity:0;}",Ct=M("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,Ft=M("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,wt=(t,r)=>{let n=t.includes("top")?1:-1,[s,d]=Ce()?[vt,jt]:[yt(n),bt(n)];return{animation:r?`${A(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${A(d)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},St=c.memo(({toast:t,position:r,style:n,children:s})=>{let d=t.height?wt(t.position||r||"top-center",t.visible):{opacity:0},l=c.createElement(xt,{toast:t}),i=c.createElement(Ft,{...t.ariaProps},G(t.message,t));return c.createElement(Ct,{className:t.className,style:{...d,...n,...t.style}},typeof s=="function"?s({icon:l,message:i}):c.createElement(c.Fragment,null,l,i))});_e(c.createElement);var Et=({id:t,className:r,style:n,onHeightUpdate:s,children:d})=>{let l=c.useCallback(i=>{if(i){let a=()=>{let g=i.getBoundingClientRect().height;s(t,g)};a(),new MutationObserver(a).observe(i,{subtree:!0,childList:!0,characterData:!0})}},[t,s]);return c.createElement("div",{ref:l,className:r,style:n},d)},kt=(t,r)=>{let n=t.includes("top"),s=n?{top:0}:{bottom:0},d=t.includes("center")?{justifyContent:"center"}:t.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:Ce()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${r*(n?1:-1)}px)`,...s,...d}},At=K`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,Y=16,zt=({reverseOrder:t,position:r="top-center",toastOptions:n,gutter:s,children:d,toasterId:l,containerStyle:i,containerClassName:a})=>{let{toasts:g,handlers:u}=nt(n,l);return c.createElement("div",{"data-rht-toaster":l||"",style:{position:"fixed",zIndex:9999,top:Y,left:Y,right:Y,bottom:Y,pointerEvents:"none",...i},className:a,onMouseEnter:u.startPause,onMouseLeave:u.endPause},g.map(h=>{let o=h.position||r,m=u.calculateOffset(h,{reverseOrder:t,gutter:s,defaultPosition:r}),x=kt(o,m);return c.createElement(Et,{id:h.id,key:h.id,onHeightUpdate:u.updateHeight,className:h.visible?At:"",style:x},h.type==="custom"?G(h.message,h):d?d(h):c.createElement(St,{toast:h,position:o}))}))},P=v;const Bt="/assets/waveint2-5rC7TQNO.png";function Dt(t){return R({attr:{viewBox:"0 0 352 512"},child:[{tag:"path",attr:{d:"M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"},child:[]}]})(t)}function Mt(t){return R({attr:{viewBox:"0 0 640 512"},child:[{tag:"path",attr:{d:"M621.16 54.46C582.37 38.19 543.55 32 504.75 32c-123.17-.01-246.33 62.34-369.5 62.34-30.89 0-61.76-3.92-92.65-13.72-3.47-1.1-6.95-1.62-10.35-1.62C15.04 79 0 92.32 0 110.81v317.26c0 12.63 7.23 24.6 18.84 29.46C57.63 473.81 96.45 480 135.25 480c123.17 0 246.34-62.35 369.51-62.35 30.89 0 61.76 3.92 92.65 13.72 3.47 1.1 6.95 1.62 10.35 1.62 17.21 0 32.25-13.32 32.25-31.81V83.93c-.01-12.64-7.24-24.6-18.85-29.47zM48 132.22c20.12 5.04 41.12 7.57 62.72 8.93C104.84 170.54 79 192.69 48 192.69v-60.47zm0 285v-47.78c34.37 0 62.18 27.27 63.71 61.4-22.53-1.81-43.59-6.31-63.71-13.62zM320 352c-44.19 0-80-42.99-80-96 0-53.02 35.82-96 80-96s80 42.98 80 96c0 53.03-35.83 96-80 96zm272 27.78c-17.52-4.39-35.71-6.85-54.32-8.44 5.87-26.08 27.5-45.88 54.32-49.28v57.72zm0-236.11c-30.89-3.91-54.86-29.7-55.81-61.55 19.54 2.17 38.09 6.23 55.81 12.66v48.89z"},child:[]}]})(t)}function Tt(t){return R({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"},child:[]}]})(t)}function de(t){return R({attr:{viewBox:"0 0 320 512"},child:[{tag:"path",attr:{d:"M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"},child:[]}]})(t)}function Wt(t){return R({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"},child:[]}]})(t)}function Pt(t){return R({attr:{viewBox:"0 0 448 512"},child:[{tag:"path",attr:{d:"M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm320-196c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM192 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM64 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z"},child:[]}]})(t)}function It(t){return R({attr:{viewBox:"0 0 448 512"},child:[{tag:"path",attr:{d:"M400 0H48C22.4 0 0 22.4 0 48v416c0 25.6 22.4 48 48 48h352c25.6 0 48-22.4 48-48V48c0-25.6-22.4-48-48-48zM128 435.2c0 6.4-6.4 12.8-12.8 12.8H76.8c-6.4 0-12.8-6.4-12.8-12.8v-38.4c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4zm0-128c0 6.4-6.4 12.8-12.8 12.8H76.8c-6.4 0-12.8-6.4-12.8-12.8v-38.4c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4zm128 128c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4zm0-128c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8v-38.4c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v38.4zm128 128c0 6.4-6.4 12.8-12.8 12.8h-38.4c-6.4 0-12.8-6.4-12.8-12.8V268.8c0-6.4 6.4-12.8 12.8-12.8h38.4c6.4 0 12.8 6.4 12.8 12.8v166.4zm0-256c0 6.4-6.4 12.8-12.8 12.8H76.8c-6.4 0-12.8-6.4-12.8-12.8V76.8C64 70.4 70.4 64 76.8 64h294.4c6.4 0 12.8 6.4 12.8 12.8v102.4z"},child:[]}]})(t)}const ye=[{id:"3yr",label:"3yr Fixed",rate:3.99},{id:"5yr",label:"5yr Fixed",rate:4.19},{id:"var",label:"Variable",rate:7}],Rt=["Abu Dhabi","Dubai","Sharjah","Ajman","Ras Al Khaimah","Fujairah","Umm Al Quwain","Al Ain"],D=[{code:"AE",dialCode:"+971",maxLength:9,name:"UAE"},{code:"IN",dialCode:"+91",maxLength:10,name:"India"},{code:"SA",dialCode:"+966",maxLength:9,name:"Saudi Arabia"},{code:"US",dialCode:"+1",maxLength:10,name:"USA"},{code:"GB",dialCode:"+44",maxLength:10,name:"UK"},{code:"PK",dialCode:"+92",maxLength:10,name:"Pakistan"},{code:"QA",dialCode:"+974",maxLength:8,name:"Qatar"}],be=1e4,Nt=.5,Lt=t=>t<=15?3.17:t<=17?3.41:t<=20?3.68:3.98,S=t=>new Intl.NumberFormat("en-AE",{style:"currency",currency:"AED",minimumFractionDigits:0,maximumFractionDigits:0}).format(t),$t=(t,r,n)=>{if(!t||!r||!n)return 0;const s=r/100/12,d=n*12;return Math.round(t*s*Math.pow(1+s,d)/(Math.pow(1+s,d)-1))},Ot=(t,r,n)=>{if(t<=0)return 0;const s=r/100/12,d=n*12;return Math.round(t*(Math.pow(1+s,d)-1)/(s*Math.pow(1+s,d))/.85*.92)},Ht=`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..800;1,9..40,300..800&display=swap');

  .pmc * { box-sizing: border-box; }
  .pmc {
    font-family: 'DM Sans', sans-serif;
    --p: #5C039B;
    --p2: #7C3AED;
    --pl: #EDE9FE;
    --pl2: #F5F0FF;
    --pd: #4a027d;
    --border: #E9EEF5;
    --text: #1E293B;
    --muted: #64748B;
    --surface: #F8FAFC;
  }

  /* slider */
  .pmc input[type=range] {
    -webkit-appearance:none; appearance:none;
    height:5px; border-radius:999px; background:#E2E8F0;
    outline:none; cursor:pointer; width:100%;
  }
  .pmc input[type=range]::-webkit-slider-thumb {
    -webkit-appearance:none; appearance:none;
    width:18px; height:18px; border-radius:50%;
    background:#7C3AED; border:2.5px solid #fff;
    box-shadow:0 2px 6px rgba(124,58,237,.35); cursor:pointer;
  }
  .pmc input[type=range]::-moz-range-thumb {
    width:18px; height:18px; border-radius:50%;
    background:#7C3AED; border:2.5px solid #fff;
    box-shadow:0 2px 6px rgba(124,58,237,.35); cursor:pointer;
  }
  .pmc input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }

  /* field */
  .pmc-field {
    width:100%; padding:10px 13px;
    background:#F8FAFC; border:1.5px solid #E9EEF5;
    border-radius:11px; font-size:13px; font-weight:600;
    color:#1E293B; outline:none; font-family:inherit;
    transition:border-color .2s, box-shadow .2s;
  }
  .pmc-field:focus { border-color:#7C3AED; box-shadow:0 0 0 3px rgba(124,58,237,.1); background:#fff; }
  .pmc-sel {
    appearance:none; cursor:pointer;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath fill='%2394A3B8' d='M5 7L0 0h10z'/%3E%3C/svg%3E");
    background-repeat:no-repeat; background-position:right 12px center;
  }

  /* label */
  .pmc-lbl {
    display:block; font-size:10px; font-weight:700;
    text-transform:uppercase; letter-spacing:.07em;
    color:#64748B; margin-bottom:6px;
  }

  /* tabs */
  .pmc-tab {
    flex:1; display:flex; align-items:center; justify-content:center; gap:6px;
    padding:9px 8px; border:none; cursor:pointer; font-family:inherit;
    font-weight:600; font-size:12px; border-radius:10px; transition:all .2s;
    background:transparent; color:#94A3B8;
  }
  .pmc-tab.active { background:#fff; color:#5C039B; box-shadow:0 1px 6px rgba(92,3,155,.1); }
  .pmc-tab:hover:not(.active) { color:#475569; }

  /* product btn */
  .pmc-prod {
    border-radius:12px; border:1.5px solid #E9EEF5;
    background:#F8FAFC; text-align:center; cursor:pointer;
    padding:12px 6px; font-family:inherit; transition:all .15s;
  }
  .pmc-prod:hover { border-color:#C4B5FD; }
  .pmc-prod.on { border-color:#7C3AED; background:#F5F0FF; }

  /* result card */
  .pmc-result {
    background:linear-gradient(145deg,#3b0764 0%,#5C039B 45%,#4a027d 100%);
    border-radius:20px; padding:22px;
    box-shadow:0 16px 48px rgba(92,3,155,.3);
    display:flex; flex-direction:column; justify-content:space-between;
    position:relative; overflow:hidden;
  }
  .pmc-result::before {
    content:''; position:absolute; top:-50px; right:-50px;
    width:160px; height:160px; border-radius:50%;
    background:radial-gradient(circle,rgba(255,255,255,.07) 0%,transparent 70%);
    pointer-events:none;
  }
  .pmc-result::after {
    content:''; position:absolute; bottom:-40px; left:-40px;
    width:130px; height:130px; border-radius:50%;
    background:radial-gradient(circle,rgba(255,255,255,.04) 0%,transparent 70%);
    pointer-events:none;
  }

  /* CTA */
  .pmc-cta {
    width:100%; background:#fff; color:#5C039B;
    border:none; padding:13px 16px; border-radius:11px;
    font-weight:700; font-size:13px; cursor:pointer; font-family:inherit;
    display:flex; align-items:center; justify-content:center; gap:7px;
    transition:all .2s; box-shadow:0 2px 12px rgba(255,255,255,.15); margin-top:20px;
  }
  .pmc-cta:hover { background:#F5F0FF; transform:translateY(-1px); }

  /* modal */
  .pmc-backdrop {
    position:fixed; inset:0; z-index:9999;
    display:flex; align-items:center; justify-content:center; padding:14px;
    background:rgba(15,5,30,.5); backdrop-filter:blur(5px);
  }
  .pmc-modal {
    background:#fff; width:100%; max-width:460px;
    border-radius:24px; overflow:hidden;
    box-shadow:0 24px 64px rgba(15,5,30,.22);
    font-family:'DM Sans',sans-serif;
    animation:pmcFU .22s ease both;
  }
  .pmc-modal-hd {
    padding:20px 24px 16px; border-bottom:1px solid #F1F5F9;
    display:flex; justify-content:space-between; align-items:flex-start;
    background:#FAFCFF;
  }
  .pmc-modal-bd { padding:20px 24px; max-height:80vh; overflow-y:auto; }

  @keyframes pmcFU {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* responsive */
  @media (max-width: 1023px) {
    .pmc-grid { grid-template-columns: 1fr 1fr !important; }
    .pmc-col-heading { grid-column: 1 / -1; }
  }
  @media (max-width: 639px) {
    .pmc-grid { grid-template-columns: 1fr !important; }
    .pmc-col-heading { grid-column: unset; }
    .pmc-result { border-radius:16px; padding:18px; }
  }
`,L=({isOpen:t,onClose:r,title:n,subtitle:s,children:d})=>(c.useEffect(()=>(document.body.style.overflow=t?"hidden":"",()=>{document.body.style.overflow=""}),[t]),t?e.jsx("div",{className:"pmc-backdrop",onClick:r,children:e.jsxs("div",{className:"pmc-modal",onClick:l=>l.stopPropagation(),children:[e.jsxs("div",{className:"pmc-modal-hd",children:[e.jsxs("div",{children:[e.jsx("h2",{style:{margin:0,fontSize:17,fontWeight:700,color:"#1E293B",letterSpacing:"-.01em"},children:n}),s&&e.jsx("p",{style:{margin:"3px 0 0",fontSize:12,color:"#64748B",fontWeight:500},children:s})]}),e.jsx("button",{onClick:r,style:{background:"none",border:"none",cursor:"pointer",color:"#94A3B8",padding:4,borderRadius:7,display:"flex",lineHeight:1},onMouseOver:l=>{l.currentTarget.style.color="#5C039B",l.currentTarget.style.background="#EDE9FE"},onMouseOut:l=>{l.currentTarget.style.color="#94A3B8",l.currentTarget.style.background="none"},children:e.jsx(Dt,{size:16})})]}),e.jsx("div",{className:"pmc-modal-bd",children:d})]})}):null),I={width:"100%",padding:"10px 13px",background:"#F8FAFC",border:"1.5px solid #E9EEF5",borderRadius:10,fontSize:13,fontWeight:600,color:"#1E293B",outline:"none",fontFamily:"inherit",boxSizing:"border-box"},q={...I,appearance:"none",cursor:"pointer",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath fill='%2394A3B8' d='M5 7L0 0h10z'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 12px center"},C={display:"block",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:"#64748B",marginBottom:5},$=(t=!0)=>({background:t?"linear-gradient(135deg,#5C039B,#7C3AED)":"#E2E8F0",color:t?"#fff":"#94A3B8",border:"none",width:"100%",padding:"13px 16px",borderRadius:11,fontWeight:700,fontSize:13,cursor:t?"pointer":"not-allowed",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:7,boxShadow:t?"0 6px 20px rgba(92,3,155,.25)":"none",transition:"all .2s"}),ke={display:"flex",border:"1.5px solid #E9EEF5",borderRadius:10,background:"#F8FAFC",overflow:"hidden"},Ae={display:"flex",alignItems:"center",padding:"0 10px",background:"#F1F5F9",borderRight:"1.5px solid #E9EEF5",gap:5},Ut=({isOpen:t,onClose:r,data:n})=>{const s=n.affordability*.15,d=n.affordability*.055;return e.jsx(L,{isOpen:t,onClose:r,title:"Affordability Breakdown",subtitle:"Your costs at a glance",children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:12},children:[[["Downpayment (15%)",S(s)],["Transaction Costs (5.5%)",S(d)]].map(([l,i])=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"11px 14px",background:"#F8FAFC",borderRadius:10,border:"1px solid #E9EEF5"},children:[e.jsx("span",{style:{fontSize:13,color:"#64748B",fontWeight:500},children:l}),e.jsx("span",{style:{fontSize:13,fontWeight:700,color:"#1E293B"},children:i})]},l)),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"12px 14px",background:"linear-gradient(135deg,#EDE9FE,#DDD6FE)",borderRadius:10},children:[e.jsx("span",{style:{fontSize:13,fontWeight:700,color:"#4C1D95"},children:"Total Upfront"}),e.jsx("span",{style:{fontSize:14,fontWeight:800,color:"#4C1D95"},children:S(s+d)})]}),e.jsxs("div",{style:{background:"linear-gradient(145deg,#3b0764,#5C039B)",borderRadius:13,padding:"16px 18px",textAlign:"center"},children:[e.jsx("p",{style:{fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"#C4B5FD",margin:"0 0 5px"},children:"Max Home Price"}),e.jsx("p",{style:{fontSize:26,fontWeight:800,color:"#fff",margin:0,letterSpacing:"-.02em"},children:S(n.affordability*.85)})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 14px",background:"#F0FDF4",borderRadius:10,border:"1px solid #D1FAE5"},children:[e.jsx("span",{style:{fontSize:12,fontWeight:600,color:"#065F46"},children:"Monthly EMI"}),e.jsx("span",{style:{fontSize:16,fontWeight:800,color:"#059669"},children:S(n.monthly)})]}),e.jsxs("div",{style:{display:"flex",gap:8,alignItems:"flex-start",padding:"10px 13px",background:"#EFF6FF",borderRadius:9,border:"1px solid #BFDBFE"},children:[e.jsx(Tt,{size:12,style:{color:"#3B82F6",marginTop:2,flexShrink:0}}),e.jsx("p",{style:{margin:0,fontSize:11,color:"#1D4ED8",fontWeight:500,lineHeight:1.6},children:"Includes a buffer for rate increases. Most UAE loans go up to 25 years based on age."})]}),e.jsx("button",{onClick:r,style:$(),children:"Got it"})]})})},Xt=({isOpen:t,onClose:r,calculatorData:n})=>{const[s,d]=c.useState("form"),[l,i]=c.useState(!1),[a,g]=c.useState({firstName:"",lastName:"",phone:"",selectedCountry:D[0],email:"",foundProperty:"no",location:"",gender:"Male",dateOfBirth:"",nationality:D[0].name,maritalStatus:"Single"}),u=o=>g(m=>({...m,...o})),h=async o=>{var x,j;if(o.preventDefault(),a.phone.length!==a.selectedCountry.maxLength){P.error(`Please enter a valid ${a.selectedCountry.maxLength}-digit number for ${a.selectedCountry.name}.`);return}if(!a.dateOfBirth){P.error("Please enter your date of birth");return}i(!0);const m=P.loading("Submitting your application...");try{const F={customerInfo:{fullName:`${a.firstName} ${a.lastName}`,email:a.email,mobileNumber:a.phone,gender:a.gender,dateOfBirth:a.dateOfBirth,nationality:a.nationality,maritalStatus:a.maritalStatus,occupation:n.employment||"Not specified",monthlySalary:n.monthlyIncome,numberOfDependents:0},propertyDetails:{propertyType:a.foundProperty==="yes"?"Ready":"Off-plan",propertySubtype:"Apartment",propertyValue:n.propertyValue||0,downPaymentAmount:n.downpayment||0,loanAmountRequired:n.loanAmount||0,propertyAddress:{area:a.location||"",city:a.location||"Dubai"},isOffPlan:a.foundProperty==="no"},loanRequirements:{preferredTenureYears:n.loanDuration||25,preferredInterestRateType:n.rate===3.99||n.rate===4.19?"Fixed":"Variable",feeFinancingPreference:!0,lifeInsurancePreference:!0,propertyInsurancePreference:!0},notesToXoto:`Lead from mortgage calculator. Residency:${n.residency}. Employment:${n.employment||"Not specified"}. Income:${n.monthlyIncome} AED. Debt:${n.monthlyDebt} AED. Property:${n.propertyValue} AED. Downpayment:${n.downpayment} AED.`},w=await Oe.post("/vault/lead/website",F);w.success||w.status===200||w.status===201?(P.success(w.message||"Submitted!",{id:m}),d("success")):P.error(w.message||"Something went wrong.",{id:m})}catch(F){P.error(((j=(x=F.response)==null?void 0:x.data)==null?void 0:j.message)||"Network error.",{id:m})}finally{i(!1)}};return s==="success"?e.jsx(L,{isOpen:t,onClose:r,title:"Application Received!",children:e.jsxs("div",{style:{textAlign:"center",padding:"16px 0 6px"},children:[e.jsx("div",{style:{width:60,height:60,background:"#D1FAE5",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"},children:e.jsx(Wt,{size:26,style:{color:"#059669"}})}),e.jsxs("h3",{style:{fontWeight:700,fontSize:16,color:"#1E293B",margin:"0 0 8px"},children:["Thank You, ",a.firstName,"!"]}),e.jsx("p",{style:{color:"#64748B",fontSize:13,lineHeight:1.7,margin:"0 0 22px",fontWeight:500},children:"Your application is received. A mortgage advisor will contact you within 24 hours."}),e.jsx("button",{onClick:r,style:$(),children:"Back to Calculator"})]})}):e.jsx(L,{isOpen:t,onClose:r,title:"Get Pre-Approved",subtitle:"Start your UAE property journey today",children:e.jsxs("form",{onSubmit:h,style:{display:"flex",flexDirection:"column",gap:12},children:[e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10},children:[e.jsxs("div",{children:[e.jsx("label",{style:C,children:"First Name *"}),e.jsx("input",{required:!0,type:"text",value:a.firstName,onChange:o=>u({firstName:o.target.value}),placeholder:"John",style:I})]}),e.jsxs("div",{children:[e.jsx("label",{style:C,children:"Last Name *"}),e.jsx("input",{required:!0,type:"text",value:a.lastName,onChange:o=>u({lastName:o.target.value}),placeholder:"Smith",style:I})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10},children:[e.jsxs("div",{children:[e.jsx("label",{style:C,children:"Gender *"}),e.jsxs("select",{value:a.gender,onChange:o=>u({gender:o.target.value}),style:q,children:[e.jsx("option",{children:"Male"}),e.jsx("option",{children:"Female"}),e.jsx("option",{children:"Other"})]})]}),e.jsxs("div",{children:[e.jsx("label",{style:C,children:"Date of Birth *"}),e.jsx("input",{required:!0,type:"date",value:a.dateOfBirth,onChange:o=>u({dateOfBirth:o.target.value}),style:I})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10},children:[e.jsxs("div",{children:[e.jsx("label",{style:C,children:"Nationality *"}),e.jsx("select",{value:a.nationality,onChange:o=>u({nationality:o.target.value}),style:q,children:D.map(o=>e.jsx("option",{value:o.name,children:o.name},o.code))})]}),e.jsxs("div",{children:[e.jsx("label",{style:C,children:"Marital Status *"}),e.jsxs("select",{value:a.maritalStatus,onChange:o=>u({maritalStatus:o.target.value}),style:q,children:[e.jsx("option",{children:"Single"}),e.jsx("option",{children:"Married"}),e.jsx("option",{children:"Divorced"}),e.jsx("option",{children:"Widowed"})]})]})]}),e.jsxs("div",{children:[e.jsx("label",{style:C,children:"Phone *"}),e.jsxs("div",{style:ke,children:[e.jsxs("div",{style:Ae,children:[e.jsx("img",{src:`https://flagcdn.com/w20/${a.selectedCountry.code.toLowerCase()}.png`,alt:"",style:{width:18,borderRadius:2}}),e.jsx("select",{value:a.selectedCountry.code,onChange:o=>u({selectedCountry:D.find(m=>m.code===o.target.value),phone:""}),style:{background:"transparent",border:"none",outline:"none",fontWeight:700,fontSize:12,cursor:"pointer",color:"#4C1D95",width:48,fontFamily:"inherit"},children:D.map(o=>e.jsx("option",{value:o.code,children:o.dialCode},o.code))})]}),e.jsx("input",{required:!0,type:"tel",value:a.phone,onChange:o=>{const m=o.target.value.replace(/\D/g,"");m.length<=a.selectedCountry.maxLength&&u({phone:m})},placeholder:"XX XXX XXXX",style:{flex:1,padding:"10px 13px",background:"transparent",border:"none",outline:"none",fontWeight:600,fontSize:13,fontFamily:"inherit",color:"#1E293B"}})]})]}),e.jsxs("div",{children:[e.jsx("label",{style:C,children:"Email *"}),e.jsx("input",{required:!0,type:"email",value:a.email,onChange:o=>u({email:o.target.value}),placeholder:"you@example.com",style:I})]}),e.jsxs("div",{children:[e.jsx("label",{style:{...C,marginBottom:8},children:"Found a property? *"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8},children:["yes","no"].map(o=>e.jsxs("label",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:7,padding:"10px",border:`1.5px solid ${a.foundProperty===o?"#7C3AED":"#E9EEF5"}`,background:a.foundProperty===o?"#F5F0FF":"#F8FAFC",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:12,color:a.foundProperty===o?"#5C039B":"#64748B"},children:[e.jsx("input",{type:"radio",name:"fp",checked:a.foundProperty===o,onChange:()=>u({foundProperty:o}),style:{display:"none"}}),o==="yes"?"✓ Yes":"✗ Not yet"]},o))})]}),a.foundProperty==="yes"&&e.jsxs("div",{children:[e.jsx("label",{style:C,children:"Preferred Location *"}),e.jsxs("select",{required:!0,value:a.location,onChange:o=>u({location:o.target.value}),style:q,children:[e.jsx("option",{value:"",children:"Select emirate"}),Rt.map(o=>e.jsx("option",{value:o,children:o},o))]})]}),e.jsxs("div",{style:{background:"linear-gradient(145deg,#3b0764,#5C039B)",borderRadius:12,padding:"14px 16px"},children:[e.jsx("p",{style:{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:"#C4B5FD",margin:"0 0 10px"},children:"Your Snapshot"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"7px 14px"},children:[["Income",S(n.monthlyIncome)],["Property",S(n.propertyValue)],["Downpayment",S(n.downpayment)],["Monthly EMI",S(n.monthlyEMI)]].map(([o,m])=>e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:9,color:"#C4B5FD",fontWeight:600,textTransform:"uppercase",letterSpacing:".08em"},children:o}),e.jsx("div",{style:{fontSize:13,fontWeight:700,color:"#fff",marginTop:2},children:m})]},o))})]}),e.jsxs("label",{style:{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",background:"#F8FAFC",borderRadius:10,border:"1px solid #E9EEF5",cursor:"pointer"},children:[e.jsx("input",{required:!0,type:"checkbox",style:{marginTop:2,accentColor:"#7C3AED",width:14,height:14,flexShrink:0}}),e.jsx("span",{style:{fontSize:11,color:"#64748B",lineHeight:1.6,fontWeight:500},children:"I agree to receive newsletters and marketing communications. I accept the Terms of Service and Privacy Policy."})]}),e.jsx("button",{type:"submit",disabled:l,style:$(!l),children:l?"Submitting…":e.jsxs(e.Fragment,{children:["Submit Application ",e.jsx(de,{size:11})]})})]})})},Vt=({isOpen:t,onClose:r})=>{const[n,s]=c.useState("schedule"),[d,l]=c.useState(null),[i,a]=c.useState(null),[g,u]=c.useState(""),[h,o]=c.useState(""),[m,x]=c.useState(""),[j,F]=c.useState(D[0]),w=["MON","TUE","WED","THU","FRI"],N=["9:00 AM","10:00 AM","11:00 AM","2:00 PM","3:00 PM","4:00 PM"];return n==="success"?e.jsx(L,{isOpen:t,onClose:r,title:"Meeting Confirmed!",children:e.jsxs("div",{style:{textAlign:"center",padding:"16px 0 6px"},children:[e.jsx("div",{style:{width:60,height:60,background:"#EDE9FE",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"},children:e.jsx(Pt,{size:24,style:{color:"#7C3AED"}})}),e.jsx("p",{style:{color:"#64748B",fontSize:13,lineHeight:1.7,margin:"0 0 22px",fontWeight:500},children:"Your consultation is booked. We've sent a calendar invite to your email."}),e.jsx("button",{onClick:r,style:$(),children:"Done"})]})}):n==="details"?e.jsx(L,{isOpen:t,onClose:()=>s("schedule"),title:"Your Details",subtitle:"Step 2 of 2",children:e.jsxs("form",{onSubmit:b=>{if(b.preventDefault(),m.length!==j.maxLength){P.error(`Please enter a valid ${j.maxLength}-digit number`);return}s("success")},style:{display:"flex",flexDirection:"column",gap:12},children:[e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10},children:[e.jsxs("div",{children:[e.jsx("label",{style:C,children:"First Name"}),e.jsx("input",{required:!0,type:"text",value:g,onChange:b=>u(b.target.value),style:I})]}),e.jsxs("div",{children:[e.jsx("label",{style:C,children:"Last Name"}),e.jsx("input",{required:!0,type:"text",value:h,onChange:b=>o(b.target.value),style:I})]})]}),e.jsxs("div",{children:[e.jsx("label",{style:C,children:"Phone"}),e.jsxs("div",{style:ke,children:[e.jsxs("div",{style:Ae,children:[e.jsx("img",{src:`https://flagcdn.com/w20/${j.code.toLowerCase()}.png`,alt:"",style:{width:18,borderRadius:2}}),e.jsx("select",{value:j.code,onChange:b=>{F(D.find(f=>f.code===b.target.value)),x("")},style:{background:"transparent",border:"none",outline:"none",fontWeight:700,fontSize:12,cursor:"pointer",color:"#4C1D95",width:48,fontFamily:"inherit"},children:D.map(b=>e.jsx("option",{value:b.code,children:b.dialCode},b.code))})]}),e.jsx("input",{required:!0,type:"tel",value:m,onChange:b=>{const f=b.target.value.replace(/\D/g,"");f.length<=j.maxLength&&x(f)},placeholder:"XX XXX XXXX",style:{flex:1,padding:"10px 13px",background:"transparent",border:"none",outline:"none",fontWeight:600,fontSize:13,fontFamily:"inherit",color:"#1E293B"}})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:4},children:[e.jsx("button",{type:"button",onClick:()=>s("schedule"),style:{padding:"12px",borderRadius:10,border:"1.5px solid #E9EEF5",background:"#F8FAFC",fontWeight:600,fontSize:13,cursor:"pointer",color:"#64748B",fontFamily:"inherit"},children:"← Back"}),e.jsx("button",{type:"submit",style:$(),children:"Confirm →"})]})]})}):e.jsx(L,{isOpen:t,onClose:r,title:"Book a Consultation",subtitle:"Step 1 of 2 — Choose a time slot",children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:20},children:[e.jsxs("div",{children:[e.jsx("p",{style:{...C,marginBottom:10},children:"Select Day"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:7},children:w.map((b,f)=>e.jsx("button",{onClick:()=>l(f),style:{padding:"11px 4px",textAlign:"center",border:`2px solid ${d===f?"#7C3AED":"#E9EEF5"}`,background:d===f?"#F5F0FF":"#F8FAFC",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:11,color:d===f?"#5C039B":"#94A3B8",transition:"all .15s"},children:b},f))})]}),e.jsxs("div",{children:[e.jsx("p",{style:{...C,marginBottom:10},children:"Select Time"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8},children:N.map((b,f)=>e.jsx("button",{onClick:()=>a(f),style:{padding:"10px 6px",textAlign:"center",border:`2px solid ${i===f?"#7C3AED":"#E9EEF5"}`,background:i===f?"#7C3AED":"#F8FAFC",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontWeight:600,fontSize:12,color:i===f?"#fff":"#64748B",transition:"all .15s"},children:b},f))})]}),e.jsx("button",{onClick:()=>s("details"),disabled:d===null||i===null,style:$(d!==null&&i!==null),children:"Continue →"})]})})};function qt({initialTab:t="affordability",singleCalculator:r=!1,backgroundVariant:n="default",heading:s,subtitle:d}){const[l,i]=c.useState(t),[a,g]=c.useState("UAE Resident"),[u,h]=c.useState(""),[o,m]=c.useState(25e3),[x,j]=c.useState(""),[F,w]=c.useState(25),[N,b]=c.useState(15e5),[f,O]=c.useState(3e5),[T,ze]=c.useState(ye[0]),[X,Be]=c.useState(25),[Z,pe]=c.useState({summary:!1,preapproval:!1,contact:!1});c.useEffect(()=>{i(t)},[t]);const y=n!=="default",De=y?n==="eligibility"?"linear-gradient(160deg,#FAFAFA 0%,#F5F0FF 60%,#FAFAFF 100%)":"linear-gradient(160deg,#FAFAFA 0%,#F0FDF4 60%,#FAFAFF 100%)":void 0,Me=s||(l==="mortgage"?`Plan Your
Mortgage Payments`:`Discover Your
True Buying Power`),Te=d||"Smart property financing for the UAE market.",ue=p=>pe(W=>({...W,[p]:!0})),J=p=>pe(W=>({...W,[p]:!1})),ee=Number(o)||0,ge=Number(x)||0,V=Number(N)||0,te=Number(f)||0,re=ee*Nt-ge,ne=ee>=be&&re>0,We=Lt(F),ie=ne?Ot(re,We,F):0,oe=ne?Math.round(re):0,ae=Math.max(0,V-te),me=$t(ae,T.rate,X),Pe=V>0?(te/V*100).toFixed(0):0,Ie={monthlyIncome:ee,monthlyDebt:ge,loanTenure:F,propertyValue:V,downpayment:te,loanAmount:ae,rate:T.rate,loanDuration:X,affordability:ie,monthly:oe,monthlyEMI:me,employment:u,residency:a},Re=y?"13px 15px":"10px 13px",Ne=y?14:13,Le=y?11:10,he=y?20:14,$e=y?"28px 30px":"22px 24px",H={width:"100%",padding:Re,background:"#F8FAFC",border:"1.5px solid #E9EEF5",borderRadius:11,fontSize:Ne,fontWeight:600,color:"#1E293B",outline:"none",fontFamily:"inherit"},fe={...H,appearance:"none",cursor:"pointer",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath fill='%2394A3B8' d='M5 7L0 0h10z'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 12px center"},k={display:"block",fontSize:Le,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:"#64748B",marginBottom:6};return e.jsxs("div",{className:"pmc",style:{position:"relative",overflow:"hidden",padding:y?"36px 20px 56px":"28px 16px 44px",background:De,minHeight:y?"100vh":void 0},children:[e.jsx("style",{children:Ht}),e.jsx(zt,{position:"top-center",reverseOrder:!1,toastOptions:{style:{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13}}}),!y&&e.jsx("img",{src:Bt,alt:"","aria-hidden":"true",style:{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%) translateY(30%)",width:"100vw",minWidth:"100%",pointerEvents:"none",zIndex:0}}),y&&e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{position:"absolute",top:-80,right:-80,width:320,height:320,background:"radial-gradient(circle,rgba(92,3,155,.07) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none"}}),e.jsx("div",{style:{position:"absolute",bottom:-60,left:-60,width:260,height:260,background:"radial-gradient(circle,rgba(92,3,155,.05) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none"}})]}),e.jsx("div",{style:{maxWidth:y?1280:1180,margin:"0 auto",position:"relative",zIndex:1},children:e.jsxs("div",{className:"pmc-grid",style:{display:"grid",gridTemplateColumns:"5fr 4fr 3fr",gap:y?28:20,alignItems:"stretch"},children:[e.jsxs("div",{className:"pmc-col-heading",style:{display:"flex",flexDirection:"column",justifyContent:"center"},children:[y&&e.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:7,padding:"5px 12px",background:"#fff",border:"1px solid #DDD6FE",borderRadius:999,marginBottom:20,width:"fit-content",boxShadow:"0 1px 6px rgba(92,3,155,.08)"},children:[e.jsx("span",{style:{width:5,height:5,background:"#7C3AED",borderRadius:"50%",display:"inline-block"}}),e.jsx("span",{style:{fontSize:10,fontWeight:700,color:"#5C039B",letterSpacing:".07em",textTransform:"uppercase"},children:"Xoto Mortgage Tools"})]}),e.jsx("h1",{style:{fontFamily:"'DM Sans',sans-serif",fontSize:y?"clamp(28px,3.5vw,52px)":"clamp(24px,3vw,42px)",fontWeight:800,color:"#1E293B",lineHeight:1.1,letterSpacing:"-.025em",margin:0,whiteSpace:"pre-line"},children:Me}),e.jsx("p",{style:{fontSize:y?14:13,color:"#64748B",marginTop:14,fontWeight:500,lineHeight:1.7,maxWidth:400},children:Te}),y&&e.jsx("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:24,maxWidth:340},children:[["Market","UAE"],["Currency","AED"],["Max LTV","85%"],["Min Salary","AED 10K"]].map(([p,W])=>e.jsxs("div",{style:{padding:"14px 16px",background:"rgba(255,255,255,.85)",border:"1px solid rgba(92,3,155,.1)",borderRadius:12},children:[e.jsx("div",{style:{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:"#94A3B8"},children:p}),e.jsx("div",{style:{fontSize:17,fontWeight:800,color:"#1E293B",marginTop:3},children:W})]},p))})]}),e.jsxs("div",{style:{background:"#fff",border:"1px solid #E9EEF5",borderRadius:20,padding:$e,boxShadow:"0 4px 20px rgba(26,10,46,.06)"},children:[!r&&e.jsx("div",{style:{display:"flex",background:"#F3F0FB",borderRadius:13,padding:4,marginBottom:y?22:18},children:[{id:"affordability",icon:e.jsx(It,{size:11}),label:"Buying Power"},{id:"mortgage",icon:e.jsx(Mt,{size:11}),label:"EMI Planner"}].map(p=>e.jsxs("button",{onClick:()=>i(p.id),className:`pmc-tab${l===p.id?" active":""}`,children:[p.icon," ",p.label]},p.id))}),l==="affordability"&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:he},children:[e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10},children:[e.jsxs("div",{children:[e.jsx("label",{style:k,children:"Residency"}),e.jsxs("select",{value:a,onChange:p=>g(p.target.value),style:fe,children:[e.jsx("option",{children:"UAE Resident"}),e.jsx("option",{children:"UAE National"}),e.jsx("option",{children:"Non-Resident"})]})]}),e.jsxs("div",{children:[e.jsx("label",{style:k,children:"Employment"}),e.jsxs("select",{value:u,onChange:p=>h(p.target.value),style:fe,children:[e.jsx("option",{value:"",children:"Select type"}),e.jsx("option",{value:"salaried",children:"Salaried"}),e.jsx("option",{value:"self_employed",children:"Self-Employed"})]})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10},children:[e.jsxs("div",{children:[e.jsx("label",{style:k,children:"Monthly Income (AED)"}),e.jsx("input",{type:"number",value:o,onChange:p=>m(p.target.value),placeholder:"0",style:H})]}),e.jsxs("div",{children:[e.jsx("label",{style:k,children:"Monthly Debts (AED)"}),e.jsx("input",{type:"number",value:x,onChange:p=>j(p.target.value),placeholder:"Optional",style:H})]})]}),e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10},children:[e.jsx("label",{style:{...k,marginBottom:0},children:"Loan Tenure"}),e.jsxs("span",{style:{fontSize:y?20:17,fontWeight:800,color:"#5C039B",letterSpacing:"-.02em"},children:[F,e.jsx("span",{style:{fontSize:12,fontWeight:600,color:"#94A3B8",marginLeft:3},children:"yrs"})]})]}),e.jsx("input",{type:"range",min:5,max:25,value:F,onChange:p=>w(Number(p.target.value))}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:10,fontWeight:600,color:"#CBD5E1",marginTop:6},children:[e.jsx("span",{children:"5 yrs"}),e.jsx("span",{children:"25 yrs"})]})]})]}),l==="mortgage"&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:he},children:[e.jsxs("div",{children:[e.jsx("label",{style:{...k,marginBottom:10},children:"Rate Type"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8},children:ye.map(p=>e.jsxs("button",{onClick:()=>ze(p),className:`pmc-prod${T.id===p.id?" on":""}`,children:[e.jsxs("div",{style:{fontSize:y?20:17,fontWeight:800,color:T.id===p.id?"#5C039B":"#475569",letterSpacing:"-.02em",lineHeight:1.1},children:[p.rate,"%"]}),e.jsx("div",{style:{fontSize:10,fontWeight:700,color:T.id===p.id?"#7C3AED":"#94A3B8",marginTop:4,textTransform:"uppercase",letterSpacing:".04em"},children:p.label})]},p.id))})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10},children:[e.jsxs("div",{children:[e.jsx("label",{style:k,children:"Property Value (AED)"}),e.jsx("input",{type:"number",value:N,onChange:p=>b(p.target.value),placeholder:"0",style:H})]}),e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6},children:[e.jsx("label",{style:{...k,marginBottom:0},children:"Downpayment"}),e.jsxs("span",{style:{fontSize:10,fontWeight:700,color:"#5C039B",background:"#EDE9FE",padding:"2px 7px",borderRadius:999},children:[Pe,"%"]})]}),e.jsx("input",{type:"number",value:f,onChange:p=>O(p.target.value),placeholder:"0",style:H})]})]}),e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10},children:[e.jsx("label",{style:{...k,marginBottom:0},children:"Loan Duration"}),e.jsxs("span",{style:{fontSize:y?20:17,fontWeight:800,color:"#5C039B",letterSpacing:"-.02em"},children:[X,e.jsx("span",{style:{fontSize:12,fontWeight:600,color:"#94A3B8",marginLeft:3},children:"yrs"})]})]}),e.jsx("input",{type:"range",min:1,max:25,value:X,onChange:p=>Be(Number(p.target.value))}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:10,fontWeight:600,color:"#CBD5E1",marginTop:6},children:[e.jsx("span",{children:"1 yr"}),e.jsx("span",{children:"25 yrs"})]})]})]})]}),e.jsxs("div",{className:"pmc-result",children:[e.jsxs("div",{style:{position:"relative",zIndex:1},children:[e.jsx("p",{style:{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".12em",color:"#C4B5FD",margin:"0 0 18px"},children:l==="affordability"?"Your Buying Power":"Cost Breakdown"}),l==="affordability"?ne?e.jsxs(e.Fragment,{children:[e.jsx("p",{style:{fontSize:11,color:"#C4B5FD",fontWeight:600,margin:"0 0 5px"},children:"Max Property Price"}),e.jsx("h2",{style:{fontSize:y?"clamp(20px,2.5vw,32px)":22,fontWeight:800,color:"#fff",margin:"0 0 3px",letterSpacing:"-.025em",lineHeight:1.1,wordBreak:"break-word"},children:S(ie)}),e.jsx("p",{style:{fontSize:10,color:"rgba(196,181,253,.7)",fontWeight:600,margin:"0 0 20px"},children:"50% DSR stress rate"}),e.jsxs("div",{style:{borderTop:"1px solid rgba(255,255,255,.12)",paddingTop:18,display:"flex",flexDirection:"column",gap:14},children:[e.jsxs("div",{children:[e.jsx("p",{style:{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:"#A78BFA",margin:"0 0 3px"},children:"Monthly EMI"}),e.jsx("p",{style:{fontSize:y?22:18,fontWeight:800,color:"#fff",margin:0,letterSpacing:"-.02em",wordBreak:"break-word"},children:S(oe)})]}),e.jsxs("button",{onClick:()=>ue("summary"),style:{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 13px",background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.15)",borderRadius:9,color:"#C4B5FD",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",width:"fit-content",transition:"all .15s"},onMouseOver:p=>p.currentTarget.style.background="rgba(255,255,255,.18)",onMouseOut:p=>p.currentTarget.style.background="rgba(255,255,255,.1)",children:["Full Breakdown ",e.jsx(de,{size:9})]})]})]}):e.jsxs("div",{style:{background:"rgba(251,113,133,.15)",border:"1px solid rgba(251,113,133,.3)",borderRadius:13,padding:"16px 15px"},children:[e.jsx("p",{style:{fontWeight:700,fontSize:13,color:"#FCA5A5",margin:"0 0 6px"},children:"⚠️ Eligibility Issue"}),e.jsxs("p",{style:{fontSize:12,color:"#FCD7D7",fontWeight:500,margin:0,lineHeight:1.6},children:["Minimum monthly salary of AED ",be.toLocaleString()," required."]})]}):e.jsxs(e.Fragment,{children:[e.jsx("p",{style:{fontSize:11,color:"#C4B5FD",fontWeight:600,margin:"0 0 5px"},children:"Monthly Installment"}),e.jsx("h2",{style:{fontSize:y?"clamp(20px,2.5vw,32px)":22,fontWeight:800,color:"#fff",margin:"0 0 3px",letterSpacing:"-.025em",lineHeight:1.1,wordBreak:"break-word"},children:S(me)}),e.jsxs("p",{style:{fontSize:10,color:"rgba(196,181,253,.7)",fontWeight:600,margin:"0 0 20px"},children:["At ",T.rate,"% p.a."]}),e.jsx("div",{style:{borderTop:"1px solid rgba(255,255,255,.12)",paddingTop:18,display:"flex",flexDirection:"column",gap:14},children:[["Total Loan",S(ae)],["Rate",`${T.rate}%`]].map(([p,W])=>e.jsxs("div",{children:[e.jsx("p",{style:{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:"#A78BFA",margin:"0 0 3px"},children:p}),e.jsx("p",{style:{fontSize:17,fontWeight:800,color:"#fff",margin:0,letterSpacing:"-.02em",wordBreak:"break-word"},children:W})]},p))})]})]}),e.jsxs("button",{onClick:()=>ue("preapproval"),className:"pmc-cta",children:["Get Pre-Approved ",e.jsx(de,{size:11})]})]})]})}),e.jsx(Ut,{isOpen:Z.summary,onClose:()=>J("summary"),data:{affordability:ie,monthly:oe}}),e.jsx(Xt,{isOpen:Z.preapproval,onClose:()=>J("preapproval"),calculatorData:Ie}),e.jsx(Vt,{isOpen:Z.contact,onClose:()=>J("contact")})]})}export{qt as default};
