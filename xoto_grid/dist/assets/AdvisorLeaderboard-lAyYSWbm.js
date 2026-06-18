import{r as i,j as a,T as u,O as e,S as y,R as k,C as j,y as l,a as S,z as I}from"./index-GdvsrsK9.js";import{R as x}from"./TrophyOutlined-BX5lZcrO.js";import{R as w}from"./FireOutlined-DfpdlVXO.js";import{F as T}from"./Table-D-YNr1TH.js";import{P as z}from"./progress-DA375sSQ.js";import{T as R}from"./index-DkuD61z0.js";import"./addEventListener-eQ-cGQQN.js";import"./index-DO3wnFSZ.js";import"./useBubbleLock-By33fe17.js";import"./index-DJhuZ684.js";import"./FileOutlined-6W7ivwdD.js";import"./FolderOpenOutlined-jVTnLLYB.js";import"./useClosable-2fFoNukg.js";const{Title:b,Text:o}=u,L=`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Sora:wght@400;600;700&display=swap');

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
    --sh-sm:  0 1px 3px rgba(92,3,155,0.07), 0 1px 2px rgba(0,0,0,0.04);
    --sh-md:  0 4px 16px rgba(92,3,155,0.11), 0 2px 4px rgba(0,0,0,0.04);
    --sh-lg:  0 14px 40px rgba(92,3,155,0.15), 0 4px 8px rgba(0,0,0,0.06);
    --sh-card:0 2px 8px rgba(92,3,155,0.07);
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

  .xp-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1.5px solid var(--border);
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
  .xp-subtitle {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: var(--tx-muted);
    margin: 4px 0 0;
  }

  .xp-card {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--rad);
    overflow: hidden;
    box-shadow: var(--sh-card);
    transition: box-shadow 0.24s, transform 0.24s, border-color 0.2s;
  }
  .xp-card:hover {
    box-shadow: var(--sh-lg);
    transform: translateY(-3px);
    border-color: var(--pur-mid);
  }

  .xp-top-card {
    border-radius: var(--rad);
    padding: 20px;
    transition: all 0.24s;
    border: 1.5px solid transparent;
  }
  .xp-top-card:hover {
    transform: translateY(-3px);
  }
  .xp-top-card.rank-1 {
    background: linear-gradient(135deg, #5c039b 0%, #8b5cf6 100%);
    border-color: #5c039b;
    color: #ffffff;
    box-shadow: 0 10px 25px -5px rgba(92, 3, 155, 0.4);
  }
  .xp-top-card.rank-1:hover {
    box-shadow: 0 15px 35px -5px rgba(92, 3, 155, 0.6);
  }
  .xp-top-card.rank-1 .ant-typography, .xp-top-card.rank-1 .xp-card-metric {
    color: #ffffff !important;
  }
  .xp-top-card.rank-2 {
    background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%);
    border-color: #7c3aed;
    color: #ffffff;
    box-shadow: 0 10px 20px -5px rgba(124, 58, 237, 0.3);
  }
  .xp-top-card.rank-2:hover {
    box-shadow: 0 15px 30px -5px rgba(124, 58, 237, 0.5);
  }
  .xp-top-card.rank-2 .ant-typography, .xp-top-card.rank-2 .xp-card-metric {
    color: #ffffff !important;
  }
  .xp-top-card.rank-3 {
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
    border-color: #c084fc;
    color: #5c039b;
    box-shadow: var(--sh-card);
  }
  .xp-top-card.rank-3:hover {
    box-shadow: var(--sh-lg);
  }
  .xp-top-card.rank-3 .ant-typography, .xp-top-card.rank-3 .xp-card-metric {
    color: #5c039b !important;
  }

  .xp-table .ant-table {
    background: transparent;
    font-family: 'Inter', sans-serif;
  }
  .xp-table .ant-table-thead > tr > th {
    background: var(--surface2);
    color: var(--tx-sub);
    font-weight: 600;
    font-size: 12px;
    border-bottom: 1.5px solid var(--border);
  }
  .xp-table .ant-table-tbody > tr > td {
    border-bottom: 1px solid var(--border);
    font-size: 13px;
  }
  .xp-table .ant-table-tbody > tr:hover > td {
    background: var(--pur-soft);
  }

  /* Custom tabs to match the purple theme */
  .xp-tabs .ant-tabs-nav::before {
    border-bottom: 1.5px solid var(--border) !important;
  }
  .xp-tabs .ant-tabs-tab {
    color: var(--tx-muted) !important;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
  }
  .xp-tabs .ant-tabs-tab:hover {
    color: var(--sb-accent) !important;
  }
  .xp-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: var(--sb-accent) !important;
    font-weight: 600 !important;
  }
  .xp-tabs .ant-tabs-ink-bar {
    background: var(--sb-accent) !important;
    height: 3px !important;
    border-radius: 3px 3px 0 0;
  }

  /* Spin loader purple style */
  .ant-spin {
    color: var(--sb-accent) !important;
  }
  .ant-spin-dot-item {
    background-color: var(--sb-accent) !important;
  }

  /* Table pagination styles - strictly purple theme */
  .xp-table .ant-pagination {
    margin: 16px 24px !important;
  }
  .xp-table .ant-pagination-item {
    border-color: var(--border) !important;
    background: var(--surface) !important;
    border-radius: var(--rad-sm) !important;
    transition: all 0.2s;
  }
  .xp-table .ant-pagination-item a {
    color: var(--tx-sub) !important;
    font-family: 'Inter', sans-serif !important;
  }
  .xp-table .ant-pagination-item-active {
    background: var(--sb-accent) !important;
    border-color: var(--sb-accent) !important;
  }
  .xp-table .ant-pagination-item-active a {
    color: #ffffff !important;
  }
  .xp-table .ant-pagination-prev .ant-pagination-item-link,
  .xp-table .ant-pagination-next .ant-pagination-item-link {
    border-color: var(--border) !important;
    background: var(--surface) !important;
    border-radius: var(--rad-sm) !important;
    color: var(--tx-sub) !important;
    transition: all 0.2s;
  }
  .xp-table .ant-pagination-item:hover,
  .xp-table .ant-pagination-prev:hover .ant-pagination-item-link,
  .xp-table .ant-pagination-next:hover .ant-pagination-item-link {
    border-color: var(--pur-mid) !important;
    background: var(--pur-soft) !important;
  }
  .xp-table .ant-pagination-item:hover a {
    color: var(--sb-accent) !important;
  }
  .xp-table .ant-pagination-disabled .ant-pagination-item-link {
    border-color: var(--border) !important;
    color: var(--tx-muted) !important;
    opacity: 0.5;
    background: var(--surface) !important;
  }

  @keyframes xp-up {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .xp-animate { animation: xp-up 0.38s ease both; }
`,K=()=>{const[m,p]=i.useState(!1),[d,f]=i.useState([]),[s,g]=i.useState("weekly");i.useEffect(()=>{(async()=>{var r;p(!0);try{const n=await S.get(`/gridadvisor/leaderboard?period=${s}`),c=(r=n==null?void 0:n.data)==null?void 0:r.leaderboard;f(Array.isArray(c)?c:[])}catch(n){console.error("Failed to load advisor leaderboard:",n)}finally{p(!1)}})()},[s]);const h=d.slice(0,3),v=[{title:"Rank",dataIndex:"rank",width:80,render:t=>a.jsxs(o,{strong:!0,style:{color:"var(--sb-accent)"},children:["#",t]})},{title:"Advisor",dataIndex:"name",render:(t,r)=>a.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10,minWidth:220},children:[a.jsx(l,{src:r.profilePhotoUrl,style:{background:r.rank===1||r.rank===2?"#ffffff":"var(--sb-accent)",color:r.rank===1||r.rank===2?"var(--sb-accent)":"#ffffff"},icon:r.rank===1?a.jsx(x,{}):a.jsx(I,{})}),a.jsxs("div",{children:[a.jsx(o,{strong:!0,style:{fontFamily:"Sora, sans-serif",color:"var(--tx)"},children:r.name}),a.jsx("div",{style:{fontSize:12,color:"var(--tx-muted)"},children:r.email||"-"}),a.jsxs("div",{style:{fontSize:11,color:"var(--pur-mid)"},children:["Employee ID: ",r.employeeId||"-"]})]})]})},{title:"Department",dataIndex:"department",width:150},{title:"Total Leads",dataIndex:"totalLeads",sorter:(t,r)=>t.totalLeads-r.totalLeads},{title:"Active Leads",dataIndex:"activeLeads",sorter:(t,r)=>t.activeLeads-r.activeLeads},{title:"Converted",dataIndex:"convertedLeads",sorter:(t,r)=>t.convertedLeads-r.convertedLeads},{title:"Conversion Rate",dataIndex:"conversionRate",width:170,render:(t=0)=>a.jsx(z,{percent:t,size:"small",strokeColor:{"0%":"var(--pur-mid)","100%":"var(--sb-accent)"},trailColor:"var(--pur-soft)"})},{title:"Composite Score",dataIndex:"compositeScore",width:140,sorter:(t,r)=>t.compositeScore-r.compositeScore,render:t=>a.jsxs(o,{strong:!0,style:{color:"var(--sb-accent)"},children:[t," pts"]})},{title:"Status",dataIndex:"status",render:t=>{const r=t==="active";return a.jsx(R,{style:{backgroundColor:r?"rgba(92, 3, 155, 0.08)":"rgba(192, 132, 252, 0.08)",color:r?"var(--sb-accent)":"var(--pur-mid)",borderColor:r?"rgba(92, 3, 155, 0.2)":"rgba(192, 132, 252, 0.2)",borderRadius:"4px",fontWeight:500},children:t?t.charAt(0).toUpperCase()+t.slice(1):"Inactive"})}}];return a.jsxs(a.Fragment,{children:[a.jsx("style",{children:L}),a.jsxs("div",{className:"xp-root",children:[a.jsx("div",{className:"xp-header",children:a.jsxs("div",{children:[a.jsx(b,{className:"xp-title",children:"Advisor Leaderboard"}),a.jsx("p",{className:"xp-subtitle",children:"Internal advisor ranking by total leads, conversions, and composite score for assignment decisions."})]})}),a.jsxs(e,{activeKey:s,onChange:g,style:{marginBottom:20},className:"xp-tabs",children:[a.jsx(e.TabPane,{tab:"Weekly"},"weekly"),a.jsx(e.TabPane,{tab:"Monthly"},"monthly"),a.jsx(e.TabPane,{tab:"Quarterly"},"quarterly"),a.jsx(e.TabPane,{tab:"Annual"},"annual"),a.jsx(e.TabPane,{tab:"Trust Ranking"},"trust")]}),a.jsx(y,{spinning:m,children:d.length?a.jsxs(a.Fragment,{children:[a.jsx(k,{gutter:[16,16],style:{marginBottom:24},children:h.map((t,r)=>a.jsx(j,{xs:24,md:8,className:"xp-animate",style:{animationDelay:`${r*.1}s`},children:a.jsx("div",{className:`xp-top-card rank-${t.rank}`,children:a.jsxs("div",{style:{display:"flex",alignItems:"center",gap:14},children:[a.jsx(l,{size:56,src:t.profilePhotoUrl,style:{background:t.rank===1||t.rank===2?"#ffffff":"var(--sb-accent)",color:t.rank===1||t.rank===2?"var(--sb-accent)":"#ffffff"},icon:t.rank===1?a.jsx(x,{}):a.jsx(w,{})}),a.jsxs("div",{style:{flex:1},children:[a.jsxs(o,{style:{fontSize:12,fontWeight:600,color:"inherit",opacity:.85},children:["Rank #",t.rank]}),a.jsx(b,{level:5,style:{margin:"2px 0",fontFamily:"Sora, sans-serif"},children:t.name}),a.jsx("div",{className:"xp-card-metric",style:{fontWeight:600,fontSize:13},children:s==="trust"?a.jsxs("span",{children:["Score: ",a.jsx("strong",{children:t.compositeScore})," pts"]}):a.jsxs("span",{children:["Conv. Rate: ",a.jsxs("strong",{children:[t.conversionRate,"%"]})," (",t.convertedLeads,"/",t.totalLeads,")"]})})]})]})})},t._id))}),a.jsx("div",{className:"xp-card",children:a.jsx(T,{className:"xp-table",columns:v,dataSource:d,rowKey:"_id",pagination:{pageSize:10},scroll:{x:1200},locale:{emptyText:a.jsxs("div",{style:{padding:32,textAlign:"center"},children:[a.jsx("div",{style:{fontSize:32,marginBottom:8},children:"🏆"}),a.jsx(o,{style:{color:"var(--tx-muted)",fontSize:13},children:"No records found"})]})}})})]}):a.jsx("div",{className:"xp-card",children:a.jsxs("div",{style:{padding:72,textAlign:"center"},children:[a.jsx("div",{style:{fontSize:48,marginBottom:12,opacity:.35},children:"🏆"}),a.jsx(o,{style:{fontSize:14,color:"var(--tx-muted)"},children:"No advisor activity yet"})]})})})]})]})};export{K as default};
