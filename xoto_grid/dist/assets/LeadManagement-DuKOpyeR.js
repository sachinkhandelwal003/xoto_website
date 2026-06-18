import{u as N,r as c,aO as T,j as e,R as $,C as m,N as D,c as W,I as _,f as B,b as w,a as M,h as E,T as O,B as U,i as V,y as H}from"./index-GdvsrsK9.js";import{R as y}from"./MessageOutlined-Brxa7f3s.js";import{R as j}from"./CompassOutlined-BQAuY4ZU.js";import{R as G}from"./CheckCircleOutlined-BoeGb-W6.js";import{F as K}from"./Table-D-YNr1TH.js";import{s as P}from"./index-BIUPx7jD.js";import{T as k}from"./index-DkuD61z0.js";import"./addEventListener-eQ-cGQQN.js";import"./index-DO3wnFSZ.js";import"./useBubbleLock-By33fe17.js";import"./index-DJhuZ684.js";import"./FileOutlined-6W7ivwdD.js";import"./FolderOpenOutlined-jVTnLLYB.js";import"./context-bJgVWRg1.js";import"./useClosable-2fFoNukg.js";const{Title:fe,Text:x}=O,{Option:i}=w,S=["#5c039b","#7c3aed","#8b5cf6","#a78bfa","#c084fc","#d8b4fe","#6d28d9","#5b21b6","#4c1d95","#7e22ce"],Y={0:"superadmin",1:"admin",2:"customer",5:"vendor-b2c",6:"vendor-b2b",7:"freelancer",11:"accountant",12:"supervisor",15:"agency",16:"agent",17:"developer",18:"vault-admin",22:"vaultagent",26:"vault-advisor",23:"vault-ops",25:"gridreferralpartner",21:"vaultpartner",24:"GridAdvisor"},q=(n="")=>n.split(" ").map(o=>o[0]||"").join("").toUpperCase().slice(0,2),J=(n="")=>{const o=n.split("").reduce((d,s)=>d+s.charCodeAt(0),0);return S[o%S.length]},Q=({name:n="",size:o=38})=>e.jsx(H,{size:o,style:{background:J(n),color:"#ffffff",fontWeight:700},children:q(n)}),f=({icon:n,label:o,value:d,color:s})=>e.jsxs("div",{style:{background:"#fff",border:"1.5px solid var(--border)",borderRadius:12,padding:"16px 20px",display:"flex",alignItems:"center",gap:16,boxShadow:"var(--sh-card)"},children:[e.jsx("div",{style:{width:44,height:44,borderRadius:12,background:`${s}12`,color:s,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0},children:n}),e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:22,fontWeight:800,color:"var(--tx)",lineHeight:1.2},children:d??0}),e.jsx("div",{style:{fontSize:12,color:"var(--tx-muted)"},children:o})]})]}),be=()=>{var v;const n=N(),[o,d]=c.useState([]),[s,h]=c.useState(!1),[b,C]=c.useState(""),[g,R]=c.useState("all"),{user:u}=T(t=>t.auth),I=Y[(v=u==null?void 0:u.role)==null?void 0:v.code]??"dashboard",L=async()=>{var t;try{h(!0);const a=await M.get("/agent/lead/get-all-leads"),r=Array.isArray(a==null?void 0:a.data)?a.data:((t=a==null?void 0:a.data)==null?void 0:t.data)||[];d(r)}catch{P.error("Failed to fetch leads.")}finally{h(!1)}};c.useEffect(()=>{L()},[]);const A=t=>{var l;const a=((l=t==null?void 0:t.trim())==null?void 0:l.toLowerCase())||"";let r={background:"rgba(107, 114, 128, 0.08)",color:"#6B7280"};a==="lead"?r={background:"rgba(92, 3, 155, 0.08)",color:"#5c039b"}:a==="visit"?r={background:"rgba(124, 58, 237, 0.08)",color:"#7c3aed"}:a==="deal"?r={background:"rgba(219, 39, 119, 0.08)",color:"#db2777"}:a==="booking"?r={background:"rgba(2, 132, 199, 0.08)",color:"#0284c7"}:a==="closed"?r={background:"rgba(16, 185, 129, 0.08)",color:"#059669"}:a==="lost"&&(r={background:"rgba(239, 68, 68, 0.08)",color:"#dc2626"});const p={lead:"New Lead",visit:"Site Visit",deal:"In Deal",booking:"Booked",closed:"Closed",lost:"Lost"};return e.jsx(k,{style:{borderRadius:20,border:"none",fontWeight:700,fontSize:11,padding:"5px 12px",margin:0,...r},children:p[a]||a.toUpperCase()||"UNKNOWN"})},z=o.map(t=>{var a,r,p,l;return{...t,key:t._id,leadName:`${((a=t==null?void 0:t.name)==null?void 0:a.first_name)||""} ${((r=t==null?void 0:t.name)==null?void 0:r.last_name)||""}`.trim()||"—",email:(t==null?void 0:t.email)||"—",phone:(t==null?void 0:t.phone_number)||"—",agentName:`${((p=t==null?void 0:t.agent)==null?void 0:p.first_name)||""} ${((l=t==null?void 0:t.agent)==null?void 0:l.last_name)||""}`.trim()||"—",createdAtFormatted:new Date(t.createdAt).toLocaleDateString()}}).filter(t=>{const a=t.leadName.toLowerCase().includes(b.toLowerCase())||t.email.toLowerCase().includes(b.toLowerCase()),r=g==="all"||t.status===g;return a&&r}),F=[{title:"Lead Details",key:"leadDetails",render:(t,a)=>e.jsxs(E,{children:[e.jsx(Q,{name:a.leadName,size:38}),e.jsxs("div",{children:[e.jsx(x,{strong:!0,style:{fontFamily:"Sora, sans-serif",color:"var(--tx)",fontSize:13},children:a.leadName}),e.jsx("br",{}),e.jsx(x,{type:"secondary",style:{fontSize:12},children:a.email})]})]})},{title:"Agent",dataIndex:"agentName",key:"agentName",render:t=>e.jsx(k,{style:{borderRadius:20,border:"none",fontWeight:700,fontSize:11,padding:"3px 10px",margin:0,background:"rgba(92, 3, 155, 0.08)",color:"#5c039b"},children:t})},{title:"Property Type",key:"propertyType",render:t=>e.jsxs(x,{strong:!0,style:{color:"var(--tx)"},children:[e.jsx(j,{style:{color:"var(--sb-accent)",marginRight:6}})," ",t.property_type||"-"]})},{title:"Status",dataIndex:"status",key:"status",render:t=>A(t)},{title:"Date",dataIndex:"createdAtFormatted",key:"date"},{title:"Action",key:"action",render:(t,a)=>e.jsx(U,{type:"default",size:"small",icon:e.jsx(V,{}),style:{borderRadius:20,borderColor:"var(--border)",color:"var(--sb-accent)",background:"var(--surface)",padding:"4px 16px",height:"auto",fontWeight:600,fontSize:12},onClick:()=>n(`/dashboard/${I}/lead-management/${a._id}`),children:"View Lead"})}];return e.jsxs("div",{style:{padding:"28px 24px",background:"var(--bg)",minHeight:"100vh",fontFamily:"'Inter', sans-serif"},children:[e.jsx("style",{children:`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        :root {
          --sb-dark:    #14051f;
          --sb-mid:     #2a1247;
          --sb-accent:  #5c039b;
          --bg:         #faf5ff;
          --surface:    #FFFFFF;
          --surface2:   #f5ebff;
          --surface3:   #e9d5ff;
          --border:     #e9d5ff;
          --border2:    #d8b4fe;
          --tx:         #140D2A;
          --tx-sub:     #4B3D6E;
          --tx-muted:   #8a70a8;
          --pur-soft:   #f3e8ff;
          --pur-mid:    #c084fc;
          --sh-card:    0 2px 8px rgba(92,3,155,0.07);
          --rad-sm:     8px;
        }

        .ant-table {
          background: transparent !important;
          font-family: 'Inter', sans-serif !important;
        }
        .ant-table-thead > tr > th {
          background: var(--surface2) !important;
          color: var(--tx-sub) !important;
          font-weight: 600 !important;
          font-size: 12px !important;
          border-bottom: 1.5px solid var(--border) !important;
        }
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid var(--border) !important;
          font-size: 13px !important;
        }
        .ant-table-tbody > tr:hover > td {
          background: var(--pur-soft) !important;
        }

        .ant-btn-default:hover {
          border-color: var(--pur-mid) !important;
          background: var(--pur-soft) !important;
          color: var(--sb-accent) !important;
        }

        .ant-input-affix-wrapper {
          border-color: var(--border) !important;
          border-radius: 20px !important;
        }
        .ant-input-affix-wrapper:focus, .ant-input-affix-wrapper-focused {
          border-color: var(--sb-accent) !important;
          box-shadow: 0 0 0 2px rgba(92, 3, 155, 0.1) !important;
        }
        .ant-input {
          font-family: 'Inter', sans-serif !important;
        }

        .ant-select-selector {
          border-color: var(--border) !important;
          border-radius: 20px !important;
        }
        .ant-select-focused .ant-select-selector, .ant-select-selector:focus {
          border-color: var(--sb-accent) !important;
          box-shadow: 0 0 0 2px rgba(92, 3, 155, 0.1) !important;
        }

        .ant-pagination-item {
          border-color: var(--border) !important;
          background: var(--surface) !important;
          border-radius: var(--rad-sm) !important;
        }
        .ant-pagination-item a {
          color: var(--tx-sub) !important;
        }
        .ant-pagination-item-active {
          background: var(--sb-accent) !important;
          border-color: var(--sb-accent) !important;
        }
        .ant-pagination-item-active a {
          color: #ffffff !important;
        }
        .ant-pagination-prev .ant-pagination-item-link,
        .ant-pagination-next .ant-pagination-item-link {
          border-color: var(--border) !important;
          background: var(--surface) !important;
          border-radius: var(--rad-sm) !important;
          color: var(--tx-sub) !important;
        }
        .ant-pagination-item:hover,
        .ant-pagination-prev:hover .ant-pagination-item-link,
        .ant-pagination-next:hover .ant-pagination-item-link {
          border-color: var(--pur-mid) !important;
          background: var(--pur-soft) !important;
        }
        .ant-pagination-item:hover a {
          color: var(--sb-accent) !important;
        }
        .ant-pagination-disabled .ant-pagination-item-link {
          border-color: var(--border) !important;
          color: var(--tx-muted) !important;
          opacity: 0.5;
          background: var(--surface) !important;
        }
      `}),e.jsxs("div",{style:{maxWidth:1300,margin:"0 auto",animation:"fadeUp .3s ease"},children:[e.jsxs("div",{style:{marginBottom:24},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:4},children:[e.jsx("div",{style:{width:38,height:38,borderRadius:12,background:"linear-gradient(135deg,#5c039b,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 16px rgba(92,3,155,.3)"},children:e.jsx(y,{style:{color:"#fff",fontSize:18}})}),e.jsx("h1",{style:{fontSize:24,fontWeight:800,color:"var(--tx)",margin:0,fontFamily:"'Sora', sans-serif"},children:"Lead Monitoring"})]}),e.jsx("p",{style:{fontSize:13,color:"var(--tx-sub)",margin:0,marginLeft:48,fontWeight:500},children:"Monitor all leads generated by agents, track their statuses, and view complete details."})]}),e.jsxs($,{gutter:[16,16],style:{marginBottom:24},children:[e.jsx(m,{xs:24,sm:6,children:e.jsx(f,{icon:e.jsx(y,{}),label:"Total Leads",value:o.length,color:"var(--sb-accent)"})}),e.jsx(m,{xs:24,sm:6,children:e.jsx(f,{icon:e.jsx(j,{}),label:"Site Visits",value:o.filter(t=>t.status==="visit").length,color:"#7c3aed"})}),e.jsx(m,{xs:24,sm:6,children:e.jsx(f,{icon:e.jsx(D,{}),label:"Active Deals",value:o.filter(t=>t.status==="deal").length,color:"#db2777"})}),e.jsx(m,{xs:24,sm:6,children:e.jsx(f,{icon:e.jsx(G,{}),label:"Successfully Closed",value:o.filter(t=>t.status==="closed").length,color:"#059669"})})]}),e.jsxs(W,{bordered:!1,style:{borderRadius:14,overflow:"hidden",border:"1.5px solid var(--border)",boxShadow:"var(--sh-card)"},bodyStyle:{padding:0},children:[e.jsx("div",{style:{display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",borderBottom:"1px solid var(--border)",gap:12,background:"#fff"},children:e.jsxs("div",{style:{display:"flex",gap:10,flexWrap:"wrap"},children:[e.jsx(_,{placeholder:"Search by Lead Name or Email...",prefix:e.jsx(B,{style:{color:"var(--tx-muted)"}}),value:b,onChange:t=>C(t.target.value),allowClear:!0,style:{width:280,borderRadius:20}}),e.jsxs(w,{value:g,onChange:t=>R(t),style:{width:180},placeholder:"All Statuses",children:[e.jsx(i,{value:"all",children:"All Statuses"}),e.jsx(i,{value:"lead",children:"New Leads"}),e.jsx(i,{value:"visit",children:"Site Visits"}),e.jsx(i,{value:"deal",children:"In Deal"}),e.jsx(i,{value:"booking",children:"Booked"}),e.jsx(i,{value:"closed",children:"Closed"}),e.jsx(i,{value:"lost",children:"Lost"})]})]})}),e.jsx(K,{columns:F,dataSource:z,loading:s,pagination:{pageSize:10},scroll:{x:900}})]})]})]})};export{be as default};
