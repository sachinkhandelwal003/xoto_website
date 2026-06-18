import{r as m,a as w,j as e,S as N,c as C,T as k,b as u,E as j}from"./index-GdvsrsK9.js";import{s as _}from"./index-BIUPx7jD.js";import{P as R}from"./progress-DA375sSQ.js";import{R as T}from"./TeamOutlined-m69BO5eF.js";import{R as S}from"./CheckCircleOutlined-BoeGb-W6.js";import{R as A}from"./RiseOutlined-BR7_kNEx.js";import{R as P}from"./DollarOutlined-BerWzpxV.js";import{R as $,C as E,X as F,Y as I,T as L}from"./generateCategoricalChart-4vhrVsI8.js";import{A as z,a as b}from"./AreaChart-olgOHk8I.js";import{T as M}from"./index-DkuD61z0.js";import{R as B,a as W}from"./ArrowUpOutlined-DVuN4jm1.js";import"./context-bJgVWRg1.js";import"./useClosable-2fFoNukg.js";const{Title:D,Text:a}=k,{Option:g}=u,G=r=>new Intl.NumberFormat("en-AE",{style:"currency",currency:"AED",maximumFractionDigits:0}).format(r||0),y=(r,n="%")=>{const o=Number(r||0)>=0;return e.jsxs(M,{color:o?"green":"red",style:{margin:0},children:[o?e.jsx(B,{}):e.jsx(W,{})," ",Math.abs(r||0),n]})},x=({icon:r,label:n,value:o,change:i,suffix:s="%"})=>e.jsxs("div",{className:"performance-metric",children:[e.jsx("div",{className:"metric-icon",children:r}),e.jsxs("div",{className:"min-w-0",children:[e.jsx(a,{type:"secondary",className:"block text-xs",children:n}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(a,{strong:!0,className:"metric-value",children:o}),i!==void 0&&y(i,s)]})]})]}),re=()=>{const[r,n]=m.useState("30d"),[o,i]=m.useState(!0),[s,v]=m.useState(null),f=m.useCallback(async()=>{try{i(!0);const c=await w.get("agent/leaderboard",{range:r});v((c==null?void 0:c.data)||null)}catch(c){console.error("Failed to fetch agent performance",c),_.error("Failed to load performance")}finally{i(!1)}},[r]);m.useEffect(()=>{f()},[f]);const t=(s==null?void 0:s.current)||{},p=(s==null?void 0:s.previous)||{},d=(s==null?void 0:s.trend)||{},h=(s==null?void 0:s.performance_trend)||[],l=d.direction!=="down";return e.jsx(N,{spinning:o,children:e.jsxs("div",{className:"agent-leaderboard min-h-screen bg-[#f6f8fb] px-3 py-4 sm:px-5 lg:px-6",children:[e.jsx("style",{children:`
          .agent-leaderboard .ant-card {
            border: 1px solid #e8edf5 !important;
            border-radius: 10px !important;
            box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04) !important;
          }

          .agent-leaderboard .ant-card-body {
            padding: 20px !important;
          }

          .agent-leaderboard .performance-metric {
            display: flex;
            align-items: center;
            gap: 12px;
            min-height: 82px;
            border: 1px solid #edf2f7;
            border-radius: 8px;
            background: #f8fafc;
            padding: 12px;
          }

          .agent-leaderboard .metric-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 8px;
            background: #f3e8ff;
            color: #5C039B;
            font-size: 18px;
            flex-shrink: 0;
          }

          .agent-leaderboard .metric-value {
            color: #0f172a;
            font-size: 22px;
            line-height: 1.2;
          }

          .agent-leaderboard .metric-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 12px;
          }

          .agent-leaderboard .summary-band {
            border: 1px solid ${l?"#bbf7d0":"#fecaca"};
            background: ${l?"#f0fdf4":"#fef2f2"};
            border-radius: 10px;
            padding: 14px;
          }

          .agent-leaderboard .chart-box {
            height: 300px;
            margin-top: 18px;
          }

          @media (max-width: 1024px) {
            .agent-leaderboard .metric-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

          @media (max-width: 560px) {
            .agent-leaderboard .metric-grid {
              grid-template-columns: 1fr;
            }
          }
        `}),e.jsxs(C,{children:[e.jsxs("div",{className:"mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",children:[e.jsxs("div",{children:[e.jsx(a,{type:"secondary",style:{fontSize:12,fontWeight:800,textTransform:"uppercase"},children:"Agent Performance"}),e.jsx(D,{level:3,style:{margin:0,fontWeight:900,color:"#0f172a"},children:"My Progress"}),e.jsx(a,{type:"secondary",children:"Your own lead and conversion movement for the selected period."})]}),e.jsxs(u,{value:r,onChange:n,style:{width:170},children:[e.jsx(g,{value:"7d",children:"Last 7 Days"}),e.jsx(g,{value:"30d",children:"Last 30 Days"}),e.jsx(g,{value:"90d",children:"Last 90 Days"})]})]}),s?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"summary-band mb-4",children:[e.jsxs("div",{className:"flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",children:[e.jsxs("div",{children:[e.jsx(a,{strong:!0,style:{color:l?"#166534":"#991b1b"},children:l?"Performance is moving up":"Performance is moving down"}),e.jsxs(a,{type:"secondary",className:"block",children:["Compared with the previous ",s.days_window||30," days."]})]}),y(d.progress_change||0," pts")]}),e.jsx(R,{percent:t.progress_score||0,strokeColor:l?"#16a34a":"#dc2626",trailColor:"#e5e7eb",style:{marginTop:10}})]}),e.jsxs("div",{className:"metric-grid",children:[e.jsx(x,{icon:e.jsx(T,{}),label:"Total Leads Given",value:t.total_leads||0,change:d.leads_change||0}),e.jsx(x,{icon:e.jsx(S,{}),label:"Conversions",value:`${t.conversion_rate||0}%`,change:d.conversion_change||0}),e.jsx(x,{icon:e.jsx(A,{}),label:"Closed Deals",value:t.completed_deals||0,change:d.deals_change||0}),e.jsx(x,{icon:e.jsx(P,{}),label:"Commission",value:G(t.earnings||0)})]}),e.jsx("div",{className:"chart-box",children:h.length>0?e.jsx($,{width:"100%",height:"100%",children:e.jsxs(z,{data:h,children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"leadsFill",x1:"0",y1:"0",x2:"0",y2:"1",children:[e.jsx("stop",{offset:"5%",stopColor:"#5C039B",stopOpacity:.28}),e.jsx("stop",{offset:"95%",stopColor:"#5C039B",stopOpacity:.02})]})}),e.jsx(E,{strokeDasharray:"3 3",stroke:"#e5e7eb"}),e.jsx(F,{dataKey:"label",tick:{fill:"#64748b",fontSize:12}}),e.jsx(I,{allowDecimals:!1,tick:{fill:"#64748b",fontSize:12}}),e.jsx(L,{}),e.jsx(b,{type:"monotone",dataKey:"leads",stroke:"#5C039B",fill:"url(#leadsFill)",strokeWidth:2}),e.jsx(b,{type:"monotone",dataKey:"conversions",stroke:"#16a34a",fill:"#dcfce7",strokeWidth:2})]})}):e.jsx(j,{description:"No performance trend yet"})}),e.jsxs("div",{className:"mt-4 grid gap-3 sm:grid-cols-2",children:[e.jsxs("div",{className:"rounded-lg border border-slate-200 bg-white p-3",children:[e.jsx(a,{type:"secondary",className:"block text-xs",children:"Current period"}),e.jsxs(a,{strong:!0,children:[t.total_leads||0," leads, ",t.completed_deals||0," conversions, ",t.in_progress_leads||0," in progress"]})]}),e.jsxs("div",{className:"rounded-lg border border-slate-200 bg-white p-3",children:[e.jsx(a,{type:"secondary",className:"block text-xs",children:"Previous period"}),e.jsxs(a,{strong:!0,children:[p.total_leads||0," leads, ",p.completed_deals||0," conversions, ",p.in_progress_leads||0," in progress"]})]})]})]}):e.jsx(j,{description:"No performance data yet"})]})]})})};export{re as default};
