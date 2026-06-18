import{u as ze,r as o,j as e,I as K,f as V,y as Ce,T as Be,R as G,C as j,l as Re,J as Te,p as $e,i as Oe,q as Le,S as Me,a as J,b as He}from"./index-GdvsrsK9.js";import{C as We}from"./index-DO3wnFSZ.js";import{T as Q}from"./index-BkfQcwdF.js";import{R as _e}from"./EnvironmentOutlined-EgVsLKhl.js";import{R as Ue}from"./TeamOutlined-m69BO5eF.js";import{R as qe}from"./ExpandOutlined-CccXDeTG.js";import{R as Ye}from"./FireOutlined-DfpdlVXO.js";import{s as Ke}from"./index-BIUPx7jD.js";import{S as Ve}from"./index-d0VrkxzI.js";import{S as Ge}from"./index-BQN_J5uy.js";import"./useBubbleLock-By33fe17.js";import"./context-bJgVWRg1.js";const{Title:Je,Text:u}=Be,{Option:fr}=He,Qe=`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Sora:wght@400;600;700&display=swap');

  :root {
    /* Sidebar palette extracted from screenshot */
    --sb-dark:    #1E0A3C;
    --sb-mid:     #2D1560;
    --sb-accent:  #7B2FBE;
    --sb-green:   #22C55E;
    --sb-green2:  #16A34A;

    /* Page surface */
    --bg:         #F5F4F8;
    --surface:    #FFFFFF;
    --surface2:   #F0EEF5;
    --surface3:   #E8E4F2;
    --border:     #E2DDF0;
    --border2:    #C9C0E2;

    /* Text */
    --tx:         #140D2A;
    --tx-sub:     #4B3D6E;
    --tx-muted:   #8E82AA;

    /* Purple tints */
    --pur-soft:   #EDE5F9;
    --pur-mid:    #C4A8F0;

    /* Shadows */
    --sh-sm:  0 1px 3px rgba(123,47,190,0.07), 0 1px 2px rgba(0,0,0,0.04);
    --sh-md:  0 4px 16px rgba(123,47,190,0.11), 0 2px 4px rgba(0,0,0,0.04);
    --sh-lg:  0 14px 40px rgba(123,47,190,0.15), 0 4px 8px rgba(0,0,0,0.06);
    --sh-card:0 2px 8px rgba(123,47,190,0.07);

    --rad:    12px;
    --rad-sm: 8px;
    --rad-xs: 6px;
  }

  *, *::before, *::after { box-sizing: border-box; }

  .xp-root {
    padding: 32px 36px 64px;
    background: var(--bg);
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    color: var(--tx);
  }

  /* ── HEADER ── */
  .xp-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1.5px solid var(--border);
  }
  .xp-eyebrow {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    color: var(--sb-accent);
    margin: 0 0 6px;
  }
  .xp-title {
    font-family: 'Sora', sans-serif !important;
    font-size: 26px !important;
    font-weight: 700 !important;
    color: var(--tx) !important;
    margin: 0 !important;
    line-height: 1.15 !important;
    letter-spacing: -0.4px;
  }
  .xp-count-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 100px;
    padding: 6px 16px 6px 10px;
    box-shadow: var(--sh-sm);
  }
  .xp-count-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--sb-green);
    box-shadow: 0 0 0 3px rgba(34,197,94,0.18);
  }
  .xp-count-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--tx-sub);
    font-family: 'Inter', sans-serif;
  }

  /* ── FILTER BAR ── */
  .xp-filterbar {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 10px;
  }
  .xp-search .ant-input-affix-wrapper {
    background: var(--surface) !important;
    border: 1.5px solid var(--border) !important;
    border-radius: var(--rad-sm) !important;
    height: 38px !important;
    box-shadow: var(--sh-sm) !important;
    transition: all 0.2s !important;
  }
  .xp-search .ant-input-affix-wrapper:hover,
  .xp-search .ant-input-affix-wrapper-focused {
    border-color: var(--sb-accent) !important;
    box-shadow: 0 0 0 3px rgba(123,47,190,0.10) !important;
  }
  .xp-search .ant-input { background: transparent !important; color: var(--tx) !important; font-family:'Inter',sans-serif !important; font-size:13px !important; }
  .xp-search .ant-input::placeholder { color: var(--tx-muted) !important; }
  .xp-search .ant-input-prefix { color: var(--tx-muted) !important; margin-right:6px; }

  .xp-fbtn {
    height: 38px;
    padding: 0 14px;
    border-radius: var(--rad-sm);
    border: 1.5px solid var(--border);
    background: var(--surface);
    color: var(--tx-sub);
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    transition: all 0.18s;
    white-space: nowrap;
    box-shadow: var(--sh-sm);
  }
  .xp-fbtn:hover { border-color: var(--sb-accent); color: var(--sb-accent); }
  .xp-fbtn.on {
    background: var(--sb-dark) !important;
    border-color: var(--sb-dark) !important;
    color: #fff !important;
  }
  .xp-fbtn.on .anticon { color: rgba(255,255,255,0.5) !important; }
  .xp-chip {
    background: rgba(255,255,255,0.18);
    color: #fff;
    padding: 1px 7px;
    border-radius: 100px;
    font-size: 10.5px;
    font-weight: 700;
  }
  .xp-dot-on {
    width: 5px; height: 5px;
    background: var(--sb-green);
    border-radius: 50%;
    display: inline-block;
  }

  /* Active tags row */
  .xp-tag-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 14px;
  }
  .xp-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: var(--pur-soft);
    border: 1px solid var(--pur-mid);
    color: var(--sb-accent);
    font-size: 11.5px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 100px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: background 0.15s;
  }
  .xp-tag:hover { background: #DDD0F5; }
  .xp-clear-all {
    font-size: 11.5px;
    color: var(--tx-muted);
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    padding: 3px 8px;
    transition: color 0.15s;
  }
  .xp-clear-all:hover { color: var(--tx-sub); }

  /* Results bar */
  .xp-results-bar {
    display: flex;
    align-items: center;
    margin-bottom: 18px;
  }
  .xp-results-text {
    font-size: 12.5px;
    color: var(--tx-muted);
    font-family: 'Inter', sans-serif;
    margin: 0;
  }
  .xp-results-text strong { color: var(--tx-sub); font-weight: 600; }

  /* ── CARD ── */
  .xp-card {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--rad);
    overflow: hidden;
    cursor: pointer;
    transition: box-shadow 0.24s, transform 0.24s, border-color 0.2s;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: var(--sh-card);
    position: relative;
  }
  .xp-card:hover {
    box-shadow: var(--sh-lg);
    transform: translateY(-5px);
    border-color: var(--pur-mid);
  }


  /* Image */
  .xp-img-wrap {
    position: relative;
    height: 195px;
    overflow: hidden;
    background: var(--surface3);
    flex-shrink: 0;
  }
  .xp-img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
    display: block;
  }
  .xp-card:hover .xp-img { transform: scale(1.05); }
  .xp-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(20,13,42,0.50) 0%, transparent 55%);
    pointer-events: none;
  }

  /* Badges */
  .xp-badge-status {
    position: absolute; top: 11px; left: 11px;
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(6px);
    color: var(--sb-dark);
    padding: 3px 10px;
    border-radius: var(--rad-xs);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    font-family: 'Inter', sans-serif;
    border: 1px solid rgba(0,0,0,0.07);
  }
  .xp-badge-date {
    position: absolute; top: 11px; right: 11px;
    background: rgba(30,10,60,0.75);
    backdrop-filter: blur(6px);
    color: rgba(255,255,255,0.88);
    padding: 3px 9px;
    border-radius: var(--rad-xs);
    font-size: 10.5px;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    border: 1px solid rgba(255,255,255,0.12);
  }
  .xp-dev-logo {
    position: absolute; bottom: -15px; left: 13px;
    width: 38px; height: 38px;
    border-radius: var(--rad-sm);
    background: var(--surface);
    border: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
    box-shadow: var(--sh-md);
    z-index: 2;
  }

  /* Body */
  .xp-body {
    padding: 22px 16px 15px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .xp-prop-name {
    font-family: 'Sora', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: var(--tx);
    margin: 0 0 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
  }
  .xp-location {
    display: flex; align-items: center; gap: 4px;
    font-size: 11.5px; color: var(--tx-muted);
    margin-bottom: 13px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .xp-location .anticon { font-size: 10px; color: var(--sb-accent); }

  /* Spec pills */
  .xp-specs { display: flex; gap: 6px; margin-bottom: 13px; flex-wrap: wrap; }
  .xp-spec {
    display: flex; align-items: center; gap: 5px;
    background: var(--pur-soft);
    border: 1px solid #DDD0F5;
    border-radius: 5px;
    padding: 3px 9px;
    font-size: 11.5px;
    color: var(--sb-accent);
    font-weight: 600;
    font-family: 'Inter', sans-serif;
  }
  .xp-spec .anticon { font-size: 10px; color: var(--sb-mid); }

  /* Divider */
  .xp-div { height: 1px; background: var(--border); margin: 11px 0; }

  /* Price */
  .xp-price-row {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-bottom: 13px;
  }
  .xp-lbl {
    font-size: 9.5px;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: var(--tx-muted);
    font-weight: 600;
    display: block;
    margin-bottom: 3px;
    font-family: 'Inter', sans-serif;
  }
  /* ✅ Professional clean price — Inter bold, tabular, no decorative font */
  .xp-price {
    font-family: 'Inter', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: var(--tx);
    line-height: 1;
    letter-spacing: -0.3px;
    font-variant-numeric: tabular-nums;
  }
  .xp-currency {
    font-size: 10px;
    color: var(--tx-muted);
    font-weight: 600;
    letter-spacing: 0.8px;
    margin-right: 4px;
  }
  .xp-plan-yes {
    font-size: 12px; font-weight: 600;
    color: var(--sb-green2);
    display: flex; align-items: center; justify-content: flex-end; gap: 4px;
    font-family: 'Inter', sans-serif;
  }
  .xp-plan-no {
    font-size: 12px; font-weight: 500;
    color: var(--tx-muted);
    text-align: right;
    font-family: 'Inter', sans-serif;
  }

  /* Actions */
  .xp-actions { display: flex; gap: 7px; margin-top: auto; }
  .xp-btn-view {
    flex: 1; height: 36px;
    border-radius: var(--rad-sm);
    border: 1.5px solid var(--border);
    background: transparent;
    color: var(--tx-sub);
    font-size: 12.5px; font-weight: 600;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: all 0.18s;
    font-family: 'Inter', sans-serif;
  }
  .xp-btn-view:hover {
    background: var(--surface2);
    border-color: var(--sb-accent);
    color: var(--sb-accent);
  }
  .xp-btn-edit {
    flex: 1; height: 36px;
    border-radius: var(--rad-sm);
    border: none;
    background: #5d0f9b;
    color: #fff;
    font-size: 12.5px; font-weight: 600;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: all 0.18s;
    font-family: 'Inter', sans-serif;
    box-shadow: 0 2px 8px rgba(30,10,60,0.22);
  }
  .xp-btn-edit:hover {
    background: var(--sb-mid);
    box-shadow: 0 4px 16px rgba(30,10,60,0.32);
    transform: translateY(-1px);
  }

  /* Popover */
  .xp-pop .ant-popover-inner {
    background: #fff !important;
    border: 1.5px solid var(--border) !important;
    border-radius: 12px !important;
    box-shadow: var(--sh-lg) !important;
    padding: 0 !important;
  }
  .xp-pop .ant-popover-arrow::before,
  .xp-pop .ant-popover-arrow::after { background: #fff !important; }
  .pop-ttl {
    font-size: 10px; font-weight: 700;
    letter-spacing: 1.4px; text-transform: uppercase;
    color: var(--sb-accent);
    font-family: 'Inter', sans-serif;
    margin: 0;
  }

  /* Load more */
  .xp-load-more {
    height: 42px; padding: 0 36px;
    border-radius: var(--rad-sm);
    border: 1.5px solid var(--border2);
    background: var(--surface);
    color: var(--tx-sub);
    font-size: 13px; font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
    box-shadow: var(--sh-sm);
  }
  .xp-load-more:hover {
    background: var(--sb-dark);
    color: #fff;
    border-color: var(--sb-dark);
    box-shadow: var(--sh-md);
  }

  /* Animations */
  @keyframes xp-up {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .xp-card-wrap { animation: xp-up 0.38s ease both; height: 100%; }
  .xp-empty { text-align: center; padding: 72px 0; color: var(--tx-muted); font-family: 'Inter', sans-serif; }
  .xp-empty-ico { font-size: 36px; margin-bottom: 12px; opacity: 0.35; }
`;function mr(){const A=ze(),[I,X]=o.useState([]),[P,Z]=o.useState([]),[D,z]=o.useState(!1),[w,ee]=o.useState([]),[re,te]=o.useState(1),[ae,oe]=o.useState(!0),[v,se]=o.useState(""),[Xe,ne]=o.useState(!1),[C,ie]=o.useState(""),[d,B]=o.useState([]),[le,R]=o.useState(!1),[n,F]=o.useState(null),[l,T]=o.useState(null),[pe,ce]=o.useState(!1),[x,k]=o.useState(100),[m,S]=o.useState(!1),[Ze,er]=o.useState(!1),[g,de]=o.useState(null),[h,xe]=o.useState(null),[fe,me]=o.useState(!1),[p,$]=o.useState([]),ge=["Apartments","Villa","Townhouse","Duplex","Penthouse"],he=[5e5,1e6,15e5,3e6,5e6],O=async(r=1,a=!1)=>{var t;try{z(!0);const s=await J.get(`/agency/listings?page=${r}&limit=20`),i=Array.isArray((t=s==null?void 0:s.data)==null?void 0:t.data)?s.data.data:[];i.length||oe(!1),X(c=>a?[...c,...i]:i)}catch(s){console.error(s),Ke.error("Failed to load properties")}finally{z(!1)}},be=async()=>{var r;try{const a=await J.get("/property/get-all-developers");ee(Array.isArray(a==null?void 0:a.data)?a.data:((r=a==null?void 0:a.data)==null?void 0:r.data)||[])}catch{}};o.useEffect(()=>{O(1,!1),be()},[]),o.useEffect(()=>{const r=v.toLowerCase(),a=I.filter(t=>{var M,H,W,_,U,q;const s=!r||((M=t.propertyName)==null?void 0:M.toLowerCase().includes(r))||((H=t.city)==null?void 0:H.toLowerCase().includes(r))||((W=t.area)==null?void 0:W.toLowerCase().includes(r)),i=d.length===0||d.includes((_=t.developer)==null?void 0:_._id)||d.some(f=>{const Y=w.find(De=>De._id===f);return Y&&Y.name===t.developerName}),c=Number(t.price||t.price_min||0),b=!n||c>=n,y=!l||c<=l,Ne=((U=t.unitType)==null?void 0:U.toLowerCase())||"",Ae=p.length===0||p.some(f=>Ne.includes(f.toLowerCase().replace("s",""))),Ie=Number(t.paymentPlan_initialPercentage||100)<=x,Pe=!m||Number(t.paymentPlan_laterPercentage||0)>0;let N=!0;if(g||h){const f=(q=t.completionDate)!=null&&q.year?parseInt(t.completionDate.year):t.availableFrom?new Date(t.availableFrom).getFullYear():0;f&&(g&&f<parseInt(g)&&(N=!1),h&&f>parseInt(h)&&(N=!1))}return s&&i&&b&&y&&Ae&&Ie&&Pe&&N});Z(a)},[v,d,n,l,p,x,m,g,h,I,w]);const ue=()=>{const r=re+1;te(r),O(r,!0)},ve=r=>{if(!r)return"";const a=new Date(r);return isNaN(a.getTime())?r:a.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})},ye=r=>{var a,t,s,i;return((t=(a=r.photos)==null?void 0:a.architecture)==null?void 0:t.length)>0?r.photos.architecture[0]:((i=(s=r.photos)==null?void 0:s.interior)==null?void 0:i.length)>0?r.photos.interior[0]:r.mainLogo?r.mainLogo:"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80"},je={background:"#fff",border:"1.5px solid #E2DDF0",borderRadius:12,padding:0,boxShadow:"0 14px 40px rgba(123,47,190,0.15)"},E={background:"#F5F4F8",border:"1px solid #E2DDF0",borderRadius:7,color:"#140D2A",fontFamily:"Inter, sans-serif",fontSize:13};K,V,w.filter(r=>r.name.toLowerCase().includes(C.toLowerCase())).map(r=>e.jsxs("div",{style:{padding:"9px 0",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid #F5F4F8"},children:[e.jsx(We,{checked:d.includes(r._id||r.id),onChange:a=>{const t=r._id||r.id;B(a.target.checked?[...d,t]:d.filter(s=>s!==t))}}),e.jsx(Ce,{shape:"square",src:r.logo,size:"small",style:{background:"#EDE5F9",color:"#7B2FBE",borderRadius:5,fontSize:12,fontWeight:700},children:!r.logo&&r.name.charAt(0)}),e.jsx(u,{style:{color:"#140D2A",fontSize:13,fontFamily:"Inter, sans-serif"},children:r.name})]},r._id||r.id));const we=e.jsxs("div",{style:{width:340,padding:18},children:[e.jsx("p",{className:"pop-ttl",style:{marginBottom:14},children:"Price Range (AED)"}),e.jsxs(G,{gutter:12,style:{marginBottom:14},children:[e.jsxs(j,{span:12,children:[e.jsx(u,{style:{fontSize:11,color:"#8E82AA",display:"block",marginBottom:5,fontWeight:600,fontFamily:"Inter, sans-serif"},children:"Min"}),e.jsx(Q,{style:{width:"100%",...E},placeholder:"From",value:n,onChange:F})]}),e.jsxs(j,{span:12,children:[e.jsx(u,{style:{fontSize:11,color:"#8E82AA",display:"block",marginBottom:5,fontWeight:600,fontFamily:"Inter, sans-serif"},children:"Max"}),e.jsx(Q,{style:{width:"100%",...E},placeholder:"To",value:l,onChange:T})]})]}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14},children:he.map(r=>e.jsx("button",{onClick:()=>F(r),style:{padding:"4px 11px",background:n===r?"#1E0A3C":"#F0EEF5",border:`1px solid ${n===r?"#1E0A3C":"#E2DDF0"}`,borderRadius:6,color:n===r?"#fff":"#4B3D6E",fontSize:11.5,cursor:"pointer",fontWeight:600,fontFamily:"Inter, sans-serif"},children:r>=1e6?`${r/1e6}M`:`${r/1e3}K`},r))}),e.jsx("button",{onClick:()=>R(!1),style:{width:"100%",height:37,borderRadius:8,border:"none",background:"#1E0A3C",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"Inter, sans-serif"},children:"Apply Filter"})]}),Fe=e.jsxs("div",{style:{width:300,padding:18},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14},children:[e.jsx("p",{className:"pop-ttl",style:{margin:0},children:"Payment Plan"}),e.jsx("button",{onClick:()=>{k(100),S(!1)},style:{background:"none",border:"none",color:"#8E82AA",cursor:"pointer",fontSize:12,fontFamily:"Inter, sans-serif",fontWeight:500},children:"Reset"})]}),e.jsxs(u,{style:{fontSize:12,color:"#4B3D6E",display:"block",marginBottom:8,fontFamily:"Inter, sans-serif"},children:["Pre-handover up to ",e.jsxs("strong",{children:[x,"%"]})]}),e.jsx(Ve,{min:0,max:100,value:x,onChange:k,trackStyle:{background:"#7B2FBE"},handleStyle:{borderColor:"#7B2FBE",background:"#7B2FBE"},railStyle:{background:"#E8E4F2"}}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10,marginTop:14},children:[e.jsx(Ge,{checked:m,onChange:S,style:{background:m?"#7B2FBE":"#E2DDF0"}}),e.jsx(u,{style:{color:"#4B3D6E",fontSize:13,fontFamily:"Inter, sans-serif"},children:"Post handover plans only"})]})]}),ke=e.jsxs("div",{style:{width:320,padding:16},children:[e.jsx("p",{className:"pop-ttl",style:{marginBottom:12},children:"Unit Type"}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:7},children:ge.map(r=>{const a=p.includes(r);return e.jsx("button",{onClick:()=>$(a?p.filter(t=>t!==r):[...p,r]),style:{padding:"6px 15px",background:a?"#1E0A3C":"#F0EEF5",border:`1px solid ${a?"#1E0A3C":"#E2DDF0"}`,borderRadius:7,color:a?"#fff":"#4B3D6E",fontWeight:600,fontSize:13,cursor:"pointer",transition:"all 0.18s",fontFamily:"Inter, sans-serif"},children:r},r)})})]}),Se=[{label:"Price",on:!!(n||l),dot:!0,pop:we,open:le,setOpen:R},{label:"Payment Plan",on:x<100||m,dot:!0,pop:Fe,open:pe,setOpen:ce},{label:"Unit Type",on:p.length>0,count:p.length,pop:ke,open:fe,setOpen:me}],L=[...n||l?[`Price: ${n?`${n>=1e6?n/1e6+"M":n/1e3+"K"}`:"Any"} – ${l?`${l>=1e6?l/1e6+"M":l/1e3+"K"}`:"Any"}`]:[],...x<100?[`Pre-HO ≤${x}%`]:[],...m?["Post-HO only"]:[],...g||h?[`Handover: ${g||"?"} – ${h||"?"}`]:[],...p],Ee=()=>{F(null),T(null),k(100),S(!1),de(null),xe(null)};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:Qe}),e.jsxs("div",{className:"xp-root",children:[e.jsx("div",{className:"xp-header",children:e.jsx("div",{children:e.jsx(Je,{className:"xp-title",children:"Agent Properties"})})}),e.jsxs("div",{className:"xp-filterbar",children:[e.jsx("div",{className:"xp-search",children:e.jsx(K,{prefix:e.jsx(V,{}),placeholder:"Search by name, area, city…",value:v,onChange:r=>se(r.target.value),allowClear:!0,style:{width:260}})}),Se.map(({label:r,on:a,count:t,dot:s,pop:i,open:c,setOpen:b})=>e.jsx(Re,{content:i,trigger:"click",open:c,onOpenChange:b,placement:"bottomLeft",overlayInnerStyle:je,overlayStyle:{zIndex:9999},overlayClassName:"xp-pop",children:e.jsxs("button",{className:`xp-fbtn${a?" on":""}`,children:[r,t>0&&e.jsx("span",{className:"xp-chip",children:t}),s&&a&&e.jsx("span",{className:"xp-dot-on"}),e.jsx(Te,{style:{fontSize:8}})]})},r))]}),L.length>0&&e.jsxs("div",{className:"xp-tag-row",children:[L.map(r=>e.jsxs("span",{className:"xp-tag",children:[r," ",e.jsx($e,{style:{fontSize:9}})]},r)),e.jsx("button",{className:"xp-clear-all",onClick:Ee,children:"Clear all"})]}),e.jsx("div",{className:"xp-results-bar",children:e.jsx("p",{className:"xp-results-text",children:v&&e.jsxs(e.Fragment,{children:[' for "',e.jsx("strong",{children:v}),'"']})})}),e.jsxs(G,{gutter:[20,24],children:[P.length===0&&!D&&e.jsx(j,{span:24,children:e.jsxs("div",{className:"xp-empty",children:[e.jsx("div",{className:"xp-empty-ico",children:"🏠"}),e.jsx("p",{style:{margin:0,fontSize:14},children:"No properties match your current filters."})]})}),P.map((r,a)=>{var t,s,i,c,b;return e.jsx(j,{xs:24,sm:12,md:8,lg:6,children:e.jsx("div",{className:"xp-card-wrap",style:{animationDelay:`${Math.min(a*.05,.42)}s`},children:e.jsxs("div",{className:"xp-card",children:[e.jsxs("div",{className:"xp-img-wrap",children:[e.jsx("img",{className:"xp-img",src:ye(r),alt:r.propertyName,onError:y=>{y.target.src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80"}}),e.jsx("div",{className:"xp-img-overlay"}),e.jsx("div",{className:"xp-badge-status",children:r.projectStatus||r.propertySubType||"Secondary"}),(r.availableFrom||((t=r.completionDate)==null?void 0:t.year))&&e.jsx("div",{className:"xp-badge-date",children:r.availableFrom?ve(r.availableFrom):(s=r.completionDate)==null?void 0:s.year}),(((i=r.developer)==null?void 0:i.logo)||r.developerName)&&e.jsx("div",{className:"xp-dev-logo",children:(c=r.developer)!=null&&c.logo?e.jsx("img",{src:r.developer.logo,alt:"dev",style:{width:"100%",height:"100%",objectFit:"cover",borderRadius:6}}):e.jsx("span",{style:{color:"#7B2FBE",fontSize:14,fontWeight:700,fontFamily:"Sora, sans-serif"},children:(r.developerName||"D").charAt(0)})})]}),e.jsxs("div",{className:"xp-body",children:[e.jsx("p",{className:"xp-prop-name",children:r.propertyName}),e.jsxs("div",{className:"xp-location",children:[e.jsx(_e,{}),e.jsxs("span",{children:[r.area||r.city,r.developerName?` · ${r.developerName}`:""]})]}),e.jsxs("div",{className:"xp-specs",children:[r.bedrooms>0&&e.jsxs("div",{className:"xp-spec",children:[e.jsx(Ue,{}),r.bedrooms," Bed",r.bedrooms>1?"s":""]}),r.builtUpArea>0&&e.jsxs("div",{className:"xp-spec",children:[e.jsx(qe,{}),Number(r.builtUpArea).toLocaleString()," ",r.builtUpAreaUnit||"sqft"]})]}),e.jsx("div",{className:"xp-div"}),e.jsxs("div",{className:"xp-price-row",children:[e.jsxs("div",{children:[e.jsx("span",{className:"xp-lbl",children:"Asking Price"}),e.jsxs("div",{className:"xp-price",children:[e.jsx("span",{className:"xp-currency",children:"AED"}),Number(r.price||0).toLocaleString()]})]}),e.jsxs("div",{style:{textAlign:"right"},children:[e.jsx("span",{className:"xp-lbl",style:{textAlign:"right",display:"block"},children:"Plan"}),((b=r.paymentPlan)==null?void 0:b.length)>0?e.jsxs("div",{className:"xp-plan-yes",children:[e.jsx(Ye,{style:{fontSize:10}})," Available"]}):e.jsx("div",{className:"xp-plan-no",children:"On Request"})]})]}),e.jsxs("div",{className:"xp-actions",onClick:y=>y.stopPropagation(),children:[e.jsxs("button",{className:"xp-btn-view",onClick:()=>A(`/dashboard/agent/secondary/${r._id}`),children:[e.jsx(Oe,{})," View"]}),e.jsxs("button",{className:"xp-btn-edit",onClick:()=>A(`/dashboard/agent/create-secondary-plans/${r._id}`),children:[e.jsx(Le,{})," Edit"]})]})]})]})})},r._id)})]}),e.jsx("div",{style:{textAlign:"center",marginTop:48},children:D?e.jsx(Me,{size:"large"}):ae?e.jsx("button",{className:"xp-load-more",onClick:ue,children:"Load More Properties"}):e.jsx(u,{style:{color:"#8E82AA",fontSize:13,fontFamily:"Inter, sans-serif"},children:"— All properties loaded —"})})]})]})}export{mr as default};
