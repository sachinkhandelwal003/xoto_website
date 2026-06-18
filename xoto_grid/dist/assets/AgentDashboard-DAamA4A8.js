import{r as c,s as V,_ as H,u as J,a as Z,j as e,S as _,R as d,C as r,c as o,T as ee,b as M,y as k,E as te,L as h,N as ae,o as se,B,w as re}from"./index-GdvsrsK9.js";import{s as oe}from"./index-BIUPx7jD.js";import{S}from"./index-CjnYf6NT.js";import{P as A}from"./progress-DA375sSQ.js";import{T as P}from"./index-DkuD61z0.js";import{p as ie,X as b,Y as j,q as le,R as m,C as w,T as g,B as ne,a as I}from"./generateCategoricalChart-4vhrVsI8.js";import{A as de,a as ce}from"./AreaChart-olgOHk8I.js";import{B as xe}from"./BarChart-DoHR6AeY.js";import{P as he,a as pe}from"./PieChart-TSi9fDxe.js";import{L as $}from"./Line-CqwmFFiT.js";import{F as fe}from"./Table-D-YNr1TH.js";import{R as T}from"./TeamOutlined-m69BO5eF.js";import{R as E}from"./FileTextOutlined-YQlfxqpK.js";import{R as me}from"./FireOutlined-DfpdlVXO.js";import{R as ge}from"./DollarOutlined-BerWzpxV.js";import"./context-bJgVWRg1.js";import"./useClosable-2fFoNukg.js";import"./addEventListener-eQ-cGQQN.js";import"./index-DO3wnFSZ.js";import"./useBubbleLock-By33fe17.js";import"./index-DJhuZ684.js";import"./FileOutlined-6W7ivwdD.js";import"./FolderOpenOutlined-jVTnLLYB.js";var be={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M855.7 210.8l-42.4-42.4a8.03 8.03 0 00-11.3 0L168.3 801.9a8.03 8.03 0 000 11.3l42.4 42.4c3.1 3.1 8.2 3.1 11.3 0L855.6 222c3.2-3 3.2-8.1.1-11.2zM304 448c79.4 0 144-64.6 144-144s-64.6-144-144-144-144 64.6-144 144 64.6 144 144 144zm0-216c39.7 0 72 32.3 72 72s-32.3 72-72 72-72-32.3-72-72 32.3-72 72-72zm416 344c-79.4 0-144 64.6-144 144s64.6 144 144 144 144-64.6 144-144-64.6-144-144-144zm0 216c-39.7 0-72-32.3-72-72s32.3-72 72-72 72 32.3 72 72-32.3 72-72 72z"}}]},name:"percentage",theme:"outlined"},je=function(i,l){return c.createElement(V,H({},i,{ref:l,icon:be}))},ye=c.forwardRef(je),ue=ie({chartName:"LineChart",GraphicalChild:$,axisComponents:[{axisType:"xAxis",AxisComp:b},{axisType:"yAxis",AxisComp:j}],formatAxisMap:le});const{Title:p,Text:a}=ee,{Option:N}=M,ve=({active:s,payload:i,label:l})=>s&&i&&i.length?e.jsxs("div",{className:"bg-[#111827] text-white px-5 py-3 rounded-full shadow-[0_10px_40px_rgba(92,3,155,0.4)] flex items-center gap-4 border border-gray-700 transform -translate-y-2",children:[e.jsx("span",{className:"text-gray-400 font-medium tracking-widest uppercase text-xs",children:l}),e.jsx("div",{className:"w-px h-6 bg-gray-600"}),e.jsxs("div",{className:"flex items-baseline gap-1",children:[e.jsx("span",{className:"text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#d8b4fe] to-[#c084fc]",children:i[0].value}),e.jsx("span",{className:"text-gray-400 text-xs ml-1",children:i[0].dataKey==="leads"?"Leads":"Deals"})]})]}):null,Ce=s=>{const{cx:i,cy:l}=s;return e.jsxs("svg",{x:i-15,y:l-15,width:30,height:30,className:"overflow-visible",children:[e.jsx("circle",{cx:"15",cy:"15",r:"12",fill:"#5C039B",className:"animate-ping opacity-40"}),e.jsx("circle",{cx:"15",cy:"15",r:"7",fill:"#fff",stroke:"#5C039B",strokeWidth:"3",className:"shadow-lg"})]})},ke=({status:s})=>{const l={new:{color:"blue"},contacted:{color:"cyan"},in_discussion:{color:"orange"},site_visit_scheduled:{color:"purple"},offer_made:{color:"gold"},qualified:{color:"green"},completed:{color:"success"},not_proceeding:{color:"error"}}[s]||{color:"default"};return e.jsx(P,{color:l.color,children:s==null?void 0:s.toUpperCase()})},Ye=()=>{const[s,i]=c.useState("7d"),[l,z]=c.useState(!0),[D,K]=c.useState(null),L=J(),R=c.useCallback(async()=>{try{z(!0);const t=await Z.get("agent/dashboard",{range:s}),n=t==null?void 0:t.data;n&&K(n)}catch(t){console.error("Failed to fetch agent dashboard",t),oe.error("Failed to load dashboard data")}finally{z(!1)}},[s]);if(c.useEffect(()=>{R()},[R]),!D)return e.jsx(_,{spinning:l});const{agent_name:f,profile_completion:y,stats:x,active_requirement_leads:F,active_listings:Se,presentations_generated:G,commission_earned:O,leads_trend:q=[],deals_closed:u=[],leads_preview:v=[],activity_feed:U=[],conversion_rate:W,lead_status_breakdown:C=[],monthly_leads:X=[],recent_clients:Y=[]}=D,Q=[{title:"Active Requirement Leads",value:F,icon:e.jsx(T,{}),color:"#5C039B",bg:"#f4e8ff"},{title:"Presentations Generated",value:G,icon:e.jsx(E,{}),color:"#059669",bg:"#ecfdf5"},{title:"Commission Earned",value:O,icon:e.jsx(ge,{}),color:"#d97706",bg:"#fffbeb",muted:y<100}];return e.jsx(_,{spinning:l,children:e.jsxs("div",{className:"agent-dashboard min-h-screen bg-[#f6f8fb] px-3 py-4 sm:px-5 lg:px-6",children:[e.jsx("style",{children:`
          .agent-dashboard {
            color: #0f172a;
          }

          .agent-dashboard .ant-card {
            border: 1px solid #e8edf5 !important;
            border-radius: 10px !important;
            box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04) !important;
            height: 100%;
          }

          .agent-dashboard .ant-card-body {
            height: 100%;
            padding: 18px !important;
          }

          .agent-dashboard .ant-row.mb-8,
          .agent-dashboard .ant-row.mb-6 {
            margin-bottom: 18px !important;
          }

          .agent-dashboard .ant-statistic-title {
            color: #64748b;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0;
            margin-bottom: 6px;
          }

          .agent-dashboard .ant-statistic-content {
            line-height: 1.15;
          }

          .agent-dashboard .ant-card-head {
            min-height: 48px;
            border-bottom: 1px solid #edf2f7;
            padding: 0 18px;
          }

          .agent-dashboard .ant-card-head-title {
            padding: 13px 0;
          }

          .agent-dashboard .ant-list-item {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }

          .agent-dashboard .ant-table {
            font-size: 13px;
          }

          .agent-dashboard .ant-table-thead > tr > th {
            background: #f8fafc !important;
            color: #475569;
            font-size: 12px;
            font-weight: 700;
            padding: 10px 12px !important;
          }

          .agent-dashboard .ant-table-tbody > tr > td {
            padding: 11px 12px !important;
          }

          .agent-dashboard .dashboard-chart-card .ant-card-body {
            display: flex;
            flex-direction: column;
          }

          .agent-dashboard .dashboard-chart {
            flex: 1;
            min-height: 260px;
          }

          @media (max-width: 768px) {
            .agent-dashboard .ant-card-body {
              padding: 14px !important;
            }

            .agent-dashboard .ant-row.mb-8,
            .agent-dashboard .ant-row.mb-6 {
              margin-bottom: 14px !important;
            }

            .agent-dashboard .dashboard-mobile-stack {
              align-items: flex-start !important;
              flex-direction: column;
            }
          }
        `}),e.jsxs(d,{gutter:[16,16],className:"mb-6",children:[e.jsx(r,{xs:24,md:16,children:e.jsx(o,{className:"border-0",children:e.jsxs("div",{className:"dashboard-mobile-stack flex items-center justify-between gap-4",children:[e.jsxs("div",{className:"min-w-0",children:[e.jsxs(p,{level:2,className:"m-0",style:{fontWeight:800,color:"#0f172a"},children:["Welcome back, ",f]}),e.jsx(a,{type:"secondary",style:{fontSize:"15px",marginTop:"8px",display:"block"},children:"Track leads, listings, presentations, and conversion performance."})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsxs(M,{value:s,onChange:i,style:{width:150},children:[e.jsx(N,{value:"7d",children:"Last 7 Days"}),e.jsx(N,{value:"30d",children:"Last 30 Days"}),e.jsx(N,{value:"90d",children:"Last 90 Days"})]}),e.jsx(k,{size:48,style:{backgroundColor:"#5C039B",fontSize:"20px",fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"},children:f==null?void 0:f.charAt(0)})]})]})})}),e.jsx(r,{xs:24,md:8,children:e.jsxs(o,{className:"border-0",children:[e.jsx(S,{title:"Profile Completion",value:y,suffix:"%",valueStyle:{color:"#5C039B",fontSize:"26px",fontWeight:800}}),e.jsx(A,{percent:y,strokeColor:{"0%":"#5C039B","100%":"#9D4EDD"},className:"mt-3"}),e.jsx(a,{type:"secondary",style:{fontSize:"12px",display:"block",marginTop:"6px"},children:"Complete your profile to unlock all features"})]})})]}),e.jsx(d,{gutter:[16,16],className:"mb-8",children:Q.map(t=>e.jsx(r,{xs:24,sm:12,lg:6,children:e.jsxs(o,{bordered:!1,className:"transition-all hover:-translate-y-0.5 hover:shadow-md",style:{opacity:t.muted?.72:1,pointerEvents:t.muted?"none":"auto"},children:[e.jsxs("div",{className:"flex h-full items-start justify-between gap-3",children:[e.jsx(S,{title:t.title,value:t.value,valueStyle:{color:t.color,fontSize:"24px",fontWeight:800}}),e.jsx("div",{className:"flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg",style:{backgroundColor:t.bg,color:t.color},children:t.icon})]}),t.muted&&e.jsx(a,{type:"secondary",style:{fontSize:"11px",display:"block",marginTop:"6px"},children:"Complete profile to unlock"})]})},t.title))}),e.jsxs(d,{gutter:[24,24],className:"mb-8",children:[e.jsx(r,{xs:24,lg:16,children:e.jsxs(o,{bordered:!1,className:"dashboard-chart-card",style:{boxShadow:"0 10px 40px rgba(0,0,0,0.03)",background:"#ffffff"},children:[e.jsxs("div",{className:"flex justify-between items-center mb-6",children:[e.jsxs("div",{children:[e.jsx(p,{level:4,style:{margin:0,fontWeight:800,color:"#0f172a"},children:"Leads Velocity"}),e.jsx(a,{type:"secondary",style:{fontSize:"14px"},children:s==="7d"?"7-Day traction overview":s==="30d"?"30-Day traction overview":"90-Day traction overview"})]}),e.jsx(P,{color:"#5C039B",style:{borderRadius:"20px",padding:"6px 16px",fontWeight:600,fontSize:"13px",border:"none"},children:"Live"})]}),e.jsx("div",{className:"dashboard-chart",children:e.jsx(m,{width:"100%",height:"100%",children:e.jsxs(de,{data:q,margin:{top:34,right:14,left:-18,bottom:8},children:[e.jsxs("defs",{children:[e.jsxs("linearGradient",{id:"lineColor",x1:"0",y1:"0",x2:"1",y2:"0",children:[e.jsx("stop",{offset:"0%",stopColor:"#5C039B"}),e.jsx("stop",{offset:"50%",stopColor:"#9D4EDD"}),e.jsx("stop",{offset:"100%",stopColor:"#d8b4fe"})]}),e.jsxs("linearGradient",{id:"areaFade",x1:"0",y1:"0",x2:"0",y2:"1",children:[e.jsx("stop",{offset:"0%",stopColor:"#9D4EDD",stopOpacity:.4}),e.jsx("stop",{offset:"100%",stopColor:"#9D4EDD",stopOpacity:0})]})]}),e.jsx(w,{strokeDasharray:"4 4",vertical:!1,stroke:"#e2e8f0",opacity:.7}),e.jsx(b,{dataKey:"name",tick:{fill:"#64748b",fontSize:13,fontWeight:600},axisLine:!1,tickLine:!1,dy:15,interval:"preserveStartEnd",minTickGap:18}),e.jsx(j,{tick:{fill:"#94a3b8",fontSize:12,fontWeight:500},axisLine:!1,tickLine:!1,dx:-10,allowDecimals:!1,domain:[0,t=>Math.max(1,t+1)]}),e.jsx(g,{content:e.jsx(ve,{}),cursor:{stroke:"#cbd5e1",strokeWidth:1,strokeDasharray:"5 5"}}),e.jsx(ce,{type:"natural",dataKey:"leads",stroke:"url(#lineColor)",strokeWidth:5,fill:"url(#areaFade)",activeDot:e.jsx(Ce,{})})]})})})]})}),e.jsx(r,{xs:24,lg:8,children:e.jsxs(o,{bordered:!1,className:"dashboard-chart-card",style:{boxShadow:"0 10px 40px rgba(0,0,0,0.02)"},children:[e.jsxs("div",{className:"mb-6",children:[e.jsx(p,{level:4,style:{margin:0,fontWeight:800,color:"#0f172a"},children:"Deals Closed"}),e.jsx(a,{type:"secondary",style:{fontSize:"14px"},children:"Monthly conversions"})]}),e.jsx("div",{className:"dashboard-chart",children:e.jsx(m,{width:"100%",height:"100%",children:e.jsxs(xe,{data:u,margin:{top:10,right:10,left:-25,bottom:0},children:[e.jsx(w,{strokeDasharray:"4 4",vertical:!1,stroke:"#e2e8f0",opacity:.7}),e.jsx(b,{dataKey:"month",tick:{fill:"#64748b",fontSize:13,fontWeight:600},axisLine:!1,tickLine:!1,dy:10}),e.jsx(j,{tick:{fill:"#94a3b8",fontSize:12,fontWeight:500},axisLine:!1,tickLine:!1,dx:-10}),e.jsx(g,{cursor:{fill:"#f1f5f9"},contentStyle:{borderRadius:"12px",border:"none",boxShadow:"0 10px 25px rgba(0,0,0,0.1)",fontWeight:600}}),e.jsx(ne,{dataKey:"deals",radius:[8,8,8,8],barSize:28,children:u.map((t,n)=>e.jsx(I,{fill:n===u.length-1?"#5C039B":"#e2e8f0"},`cell-${n}`))})]})})})]})})]}),e.jsxs(d,{gutter:[24,24],className:"mb-8",children:[e.jsx(r,{xs:24,sm:12,lg:6,children:e.jsxs(o,{bordered:!1,className:"rounded-2xl",style:{boxShadow:"0 10px 40px rgba(0,0,0,0.02)"},children:[e.jsx(p,{level:4,style:{margin:"0 0 16px 0",fontWeight:800,color:"#0f172a"},children:"Lead Status"}),e.jsx(m,{width:"100%",height:280,children:e.jsxs(he,{children:[e.jsx(pe,{data:C,cx:"50%",cy:"50%",innerRadius:60,outerRadius:100,paddingAngle:2,dataKey:"value",children:C.map((t,n)=>e.jsx(I,{fill:t.color},`cell-${n}`))}),e.jsx(g,{formatter:t=>`${t} leads`})]})}),e.jsx("div",{className:"mt-4 flex flex-col gap-2",children:C.map((t,n)=>e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{style:{width:"12px",height:"12px",borderRadius:"50%",backgroundColor:t.color}}),e.jsx(a,{style:{fontSize:"12px"},children:t.status})]}),e.jsx(a,{strong:!0,children:t.value})]},n))})]})}),e.jsx(r,{xs:24,sm:12,lg:9,children:e.jsxs(o,{bordered:!1,className:"rounded-2xl",style:{boxShadow:"0 10px 40px rgba(0,0,0,0.02)"},children:[e.jsx(p,{level:4,style:{margin:"0 0 16px 0",fontWeight:800,color:"#0f172a"},children:"Leads Trend (Month-on-Month)"}),e.jsx(m,{width:"100%",height:280,children:e.jsxs(ue,{data:X,margin:{top:32,right:22,left:-18,bottom:8},children:[e.jsx(w,{strokeDasharray:"4 4",vertical:!1,stroke:"#e2e8f0",opacity:.7}),e.jsx(b,{dataKey:"month",tick:{fill:"#64748b",fontSize:12},axisLine:!1,tickLine:!1}),e.jsx(j,{tick:{fill:"#94a3b8",fontSize:12},axisLine:!1,tickLine:!1,allowDecimals:!1,domain:[0,t=>Math.max(1,t+1)]}),e.jsx(g,{contentStyle:{borderRadius:"8px",border:"none",boxShadow:"0 5px 15px rgba(0,0,0,0.1)"}}),e.jsx($,{type:"natural",dataKey:"leads",stroke:"#5C039B",strokeWidth:3,dot:{fill:"#5C039B",r:5},activeDot:{r:7}})]})})]})}),e.jsx(r,{xs:24,sm:12,lg:9,children:e.jsxs(o,{bordered:!1,className:"rounded-2xl",style:{boxShadow:"0 10px 40px rgba(0,0,0,0.02)"},children:[e.jsx(S,{title:"Conversion Rate",value:W,suffix:"%",prefix:e.jsx(ye,{style:{color:"#10b981"}}),valueStyle:{color:"#10b981",fontSize:"32px",fontWeight:800}}),e.jsx(A,{percent:W,strokeColor:{"0%":"#ef4444","50%":"#f59e0b","100%":"#10b981"},size:"large",className:"mt-6"}),e.jsxs("div",{className:"mt-8 space-y-3",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx(a,{type:"secondary",style:{fontSize:"12px"},children:"Total Leads:"}),e.jsx(a,{strong:!0,children:(x==null?void 0:x.total)||0})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx(a,{type:"secondary",style:{fontSize:"12px"},children:"Completed:"}),e.jsx(a,{strong:!0,style:{color:"#10b981"},children:(x==null?void 0:x.completed)||0})]})]})]})})]}),e.jsx(d,{gutter:[24,24],className:"mb-8",children:e.jsx(r,{xs:24,children:e.jsx(o,{bordered:!1,className:"rounded-2xl",style:{boxShadow:"0 10px 40px rgba(0,0,0,0.02)"},title:e.jsx("span",{style:{fontWeight:800,fontSize:"16px",color:"#0f172a"},children:"My Latest Leads"}),children:v&&v.length>0?e.jsx(fe,{dataSource:v,columns:[{title:"Lead Name",dataIndex:"name",key:"name",render:t=>e.jsx(a,{strong:!0,children:t})},{title:"Type",dataIndex:"type",key:"type",render:t=>e.jsx(a,{type:"secondary",children:t})},{title:"Status",dataIndex:"status",key:"status",render:t=>e.jsx(ke,{status:t})},{title:"Date",dataIndex:"date",key:"date",render:t=>e.jsx(a,{type:"secondary",style:{fontSize:"12px"},children:t})}],pagination:!1,rowKey:"id",size:"small"}):e.jsx(te,{description:"No leads yet"})})})}),e.jsxs(d,{gutter:[24,24],className:"mb-8",children:[e.jsx(r,{xs:24,lg:12,children:e.jsx(o,{bordered:!1,className:"rounded-2xl",style:{boxShadow:"0 10px 40px rgba(0,0,0,0.02)"},title:e.jsx("span",{style:{fontWeight:800,fontSize:"16px",color:"#0f172a"},children:"Recent Activity"}),children:e.jsx(h,{itemLayout:"horizontal",dataSource:U,renderItem:t=>e.jsx(h.Item,{className:"border-b pb-4",children:e.jsx(h.Item.Meta,{avatar:e.jsxs(k,{style:{backgroundColor:"#5C039B",display:"flex",alignItems:"center",justifyContent:"center"},children:[t.icon==="team"&&e.jsx(T,{}),t.icon==="file-text"&&e.jsx(E,{}),t.icon==="check"&&e.jsx(se,{})]}),title:e.jsx(a,{strong:!0,children:t.message}),description:e.jsxs(a,{type:"secondary",style:{fontSize:"12px"},children:[e.jsx(ae,{style:{marginRight:"4px"}}),t.time]})})})})})}),e.jsx(r,{xs:24,lg:12,children:e.jsx(o,{bordered:!1,className:"rounded-2xl",style:{boxShadow:"0 10px 40px rgba(0,0,0,0.02)"},title:e.jsx("span",{style:{fontWeight:800,fontSize:"16px",color:"#0f172a"},children:"Quick Actions"}),children:e.jsxs("div",{className:"space-y-3",children:[e.jsx(B,{size:"large",block:!0,type:"primary",icon:e.jsx(re,{}),onClick:()=>L("/dashboard/agent/CreateAgent-Lead"),style:{background:"linear-gradient(135deg, #5C039B 0%, #9D4EDD 100%)",borderColor:"transparent",fontWeight:600,height:"48px",borderRadius:"8px"},children:"Add Requirement Lead"}),e.jsx(B,{size:"large",block:!0,icon:e.jsx(me,{}),onClick:()=>L("/dashboard/agent/agent-projects"),style:{fontWeight:600,height:"48px",borderRadius:"8px",borderColor:"#3b82f6",color:"#3b82f6"},children:"Browse Properties"})]})})})]}),e.jsx(d,{gutter:[24,24],children:e.jsx(r,{xs:24,children:e.jsx(o,{bordered:!1,className:"rounded-2xl",style:{boxShadow:"0 10px 40px rgba(0,0,0,0.02)"},title:e.jsx("span",{style:{fontWeight:800,fontSize:"16px",color:"#0f172a"},children:"Recent Clients"}),children:e.jsx(h,{itemLayout:"horizontal",dataSource:Y,renderItem:t=>e.jsx(h.Item,{className:"hover:bg-slate-50 transition-colors rounded-xl px-4 py-3 border-b-0 mb-2",children:e.jsx(h.Item.Meta,{avatar:e.jsx(k,{size:48,style:{backgroundColor:"#f3e8ff",color:"#5C039B",fontWeight:800,fontSize:"18px"},children:t.name.charAt(0)}),title:e.jsx(a,{strong:!0,style:{fontSize:"16px",color:"#1e293b"},children:t.title}),description:e.jsxs("div",{className:"flex justify-between text-sm mt-1",children:[e.jsx(a,{type:"secondary",style:{fontWeight:500},children:t.name}),e.jsx(a,{type:"secondary",style:{color:"#94a3b8",fontWeight:500},children:t.time})]})})})})})})})]})})};export{Ye as default};
