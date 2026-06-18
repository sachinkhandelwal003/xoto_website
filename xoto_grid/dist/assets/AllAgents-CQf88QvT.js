import{r as p,a as h,j as e,R as be,N as he,C as ye,O as ve,c as je,I as U,aL as Se,B as m,aj as ke,T as Ae,G as J,H as _,k as y,i as Re,U as Ce,z as we,y as H}from"./index-GdvsrsK9.js";import{C as Pe}from"./CustomTable-DQNb2Yra.js";import{R as V}from"./TeamOutlined-m69BO5eF.js";import{R as C}from"./CheckCircleOutlined-BoeGb-W6.js";import{M as Q}from"./index-Cl93UlzA.js";import{R as X}from"./EnvironmentOutlined-EgVsLKhl.js";import{R as T}from"./CloseCircleOutlined-kPxXk4cX.js";import{R as Y}from"./TrophyOutlined-BX5lZcrO.js";import{R as G}from"./FileTextOutlined-YQlfxqpK.js";import{s as u}from"./index-BIUPx7jD.js";import{T as Z}from"./index-DkuD61z0.js";import"./ActionButton-KyfGOTiI.js";import"./context-BjGtD5ms.js";import"./fade-CDzJXbVW.js";import"./useClosable-2fFoNukg.js";import"./context-bJgVWRg1.js";const{Title:Xe,Text:K}=Ae,v={success:"#7c3aed",error:"#c084fc",errorBg:"rgba(192, 132, 252, 0.08)"},q=["#5c039b","#7c3aed","#8b5cf6","#a78bfa","#c084fc","#d8b4fe","#6d28d9","#5b21b6","#4c1d95","#7e22ce"],ze=(t="")=>t.split(" ").map(o=>o[0]||"").join("").toUpperCase().slice(0,2),Ie=(t="")=>{const o=t.split("").reduce((r,i)=>r+i.charCodeAt(0),0);return q[o%q.length]},_e=(t,o,r,i)=>({...t,key:t._id,sno:(r-1)*i+o+1,name:t.fullName||`${t.first_name||""} ${t.last_name||""}`.trim()||"—",fullName:t.fullName||`${t.first_name||""} ${t.last_name||""}`.trim()||"—",phone:t.phone||t.phone_number||"—",email:t.email||"—",location:t.location||t.operating_city||t.country||"—",city:t.operating_city||t.city||t.country||"—",country:t.country||"UAE",avatar:t.profile_photo||null,profile_photo:t.profile_photo||null,status:t.is_active??t.status??!0,is_active:t.is_active??t.status??!0,specialization:t.specialization||"",experience:t.experience_years||t.experience||0,experience_years:t.experience_years||t.experience||0,reraNumber:t.rera_number||"",rera_number:t.rera_number||"",idProof:t.id_proof||null,id_proof:t.id_proof||null,reraCertificate:t.rera_certificate||null,rera_certificate:t.rera_certificate||null,agencyApprovalStatus:t.agencyApprovalStatus||"pending",adminApprovalStatus:t.adminApprovalStatus||"pending"}),ee=({name:t="",src:o,size:r=40})=>e.jsx("div",{style:{position:"relative",display:"inline-block",flexShrink:0},children:o?e.jsx(H,{src:o,size:r,style:{border:"2px solid #ffffff"}}):e.jsx(H,{size:r,style:{background:Ie(t),color:"#ffffff",fontWeight:700,border:"2px solid #ffffff"},children:ze(t)})}),Te=({active:t})=>e.jsx("span",{style:{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:700,border:"1px solid",background:t?"rgba(16, 185, 129, 0.08)":"rgba(239, 68, 68, 0.08)",borderColor:t?"rgba(16, 185, 129, 0.2)":"rgba(239, 68, 68, 0.2)",color:t?"#059669":"#dc2626"},children:t?"Active":"Inactive"}),te=({status:t})=>{const o={approved:{color:"success",label:"Approved"},declined:{color:"error",label:"Declined"},pending:{color:"warning",label:"Pending"}},r=o[t]||o.pending;return e.jsx(Z,{color:r.color,children:r.label})},De=t=>{if(!t)return e.jsx("span",{style:{color:"var(--pur-mid)",fontSize:12},children:"--"});const o=t.trim(),r=o.toLowerCase();let i={background:"rgba(92, 3, 155, 0.08)",color:"#5c039b"};return r.includes("commercial")?i={background:"rgba(219, 39, 119, 0.08)",color:"#db2777"}:r.includes("industrial")?i={background:"rgba(124, 58, 237, 0.08)",color:"#7c3aed"}:r.includes("residential")?i={background:"rgba(92, 3, 155, 0.08)",color:"#5c039b"}:i={background:"rgba(192, 132, 252, 0.08)",color:"#c084fc"},e.jsx(Z,{style:{borderRadius:20,border:"none",fontWeight:700,fontSize:11,padding:"3px 10px",margin:0,...i},children:o})},$e=({icon:t,label:o,value:r,color:i})=>e.jsxs("div",{style:{background:"#fff",border:"1.5px solid var(--border)",borderRadius:12,padding:"16px 20px",display:"flex",alignItems:"center",gap:16,boxShadow:"var(--sh-card)"},children:[e.jsx("div",{style:{width:44,height:44,borderRadius:12,background:`${i}12`,color:i,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0},children:t}),e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:22,fontWeight:800,color:"var(--tx)",lineHeight:1.2},children:r??0}),e.jsx("div",{style:{fontSize:12,color:"var(--tx-muted)"},children:o})]})]}),b=({icon:t,label:o,value:r,valueStyle:i={}})=>e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 0",borderBottom:"1px solid var(--border)"},children:[e.jsx("div",{style:{width:28,height:28,borderRadius:7,background:"var(--pur-soft)",color:"var(--sb-accent)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:13},children:t}),e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("div",{style:{fontSize:10,fontWeight:600,color:"var(--tx-muted)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:1},children:o}),e.jsx("div",{style:{fontSize:13,color:"var(--tx)",fontWeight:500,wordBreak:"break-word",...i},children:r??e.jsx("span",{style:{color:"var(--pur-mid)"},children:"—"})})]})]}),I=({title:t,icon:o,children:r})=>e.jsxs("div",{style:{marginBottom:20},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:10,paddingBottom:8,borderBottom:"2px solid var(--pur-soft)"},children:[e.jsx("div",{style:{width:24,height:24,borderRadius:6,background:"var(--sb-accent)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11},children:o}),e.jsx("span",{style:{fontSize:12,fontWeight:700,color:"var(--sb-accent)",textTransform:"uppercase",letterSpacing:"0.06em"},children:t})]}),r]}),We=({open:t,onClose:o,agent:r,onApprove:i,onDecline:x})=>{if(!r)return null;const j=r.is_active??r.status??!0,l=r.agencyApprovalStatus==="pending";return e.jsx(Q,{open:t,onCancel:o,closable:!0,width:640,centered:!0,footer:null,title:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[e.jsx("div",{style:{width:32,height:32,borderRadius:8,background:"var(--pur-soft)",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(we,{style:{color:"var(--sb-accent)",fontSize:14}})}),e.jsx("span",{style:{fontWeight:700,color:"var(--tx)",fontFamily:"Sora, sans-serif"},children:"Agent Profile Details"})]}),styles:{content:{borderRadius:16,padding:"24px"}},children:e.jsxs("div",{style:{marginTop:20},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:16,padding:"16px",background:"var(--surface2)",borderRadius:12,marginBottom:20,border:"1px solid var(--border)"},children:[e.jsx(ee,{name:r.name,src:r.avatar,size:60}),e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontSize:18,fontWeight:800,color:"var(--tx)",fontFamily:"Sora, sans-serif"},children:r.name}),e.jsx("div",{style:{fontSize:12,color:"var(--tx-muted)",marginTop:2},children:r.email})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end"},children:[e.jsx(Te,{active:j}),e.jsx(te,{status:r.agencyApprovalStatus})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px"},children:[e.jsxs(I,{title:"Contact Info",icon:e.jsx(_,{}),children:[e.jsx(b,{icon:e.jsx(J,{}),label:"Email Address",value:r.email}),e.jsx(b,{icon:e.jsx(_,{}),label:"Phone Number",value:r.phone}),e.jsx(b,{icon:e.jsx(X,{}),label:"Operating City",value:r.city})]}),e.jsxs(I,{title:"Professional Details",icon:e.jsx(Y,{}),children:[e.jsx(b,{icon:e.jsx(Y,{}),label:"Experience",value:r.experience?`${r.experience} Years`:"—"}),e.jsx(b,{icon:e.jsx(G,{}),label:"Specialization",value:r.specialization}),e.jsx(b,{icon:e.jsx(Ce,{}),label:"RERA License",value:r.reraNumber?e.jsxs(e.Fragment,{children:[r.reraNumber," ",e.jsx("span",{style:{color:"var(--sb-accent)",fontWeight:"bold"},children:"✓"})]}):"Not Registered"})]})]}),(r.idProof||r.reraCertificate)&&e.jsx(I,{title:"Verified Documents",icon:e.jsx(G,{}),children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:10,marginTop:8},children:[r.idProof&&e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:"var(--surface2)",borderRadius:10,border:"1px solid var(--border)"},children:[e.jsx("span",{style:{fontSize:13,fontWeight:600,color:"var(--tx-sub)"},children:"🪪 ID Proof Document"}),e.jsx("a",{href:r.idProof,target:"_blank",rel:"noopener noreferrer",style:{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:700,background:"var(--sb-accent)",color:"#fff",textDecoration:"none"},children:"View"})]}),r.reraCertificate&&e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:"var(--surface2)",borderRadius:10,border:"1px solid var(--border)"},children:[e.jsx("span",{style:{fontSize:13,fontWeight:600,color:"var(--tx-sub)"},children:"📜 RERA License Certificate"}),e.jsx("a",{href:r.reraCertificate,target:"_blank",rel:"noopener noreferrer",style:{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:700,background:"var(--sb-accent)",color:"#fff",textDecoration:"none"},children:"View"})]})]})}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,marginTop:24,borderTop:"1px solid var(--border)",paddingTop:16},children:[l&&e.jsxs("div",{style:{display:"flex",gap:10},children:[e.jsx(m,{type:"primary",icon:e.jsx(C,{}),onClick:()=>{i(r._id),o()},style:{background:v.success,borderColor:v.success,borderRadius:20},children:"Approve Agent"}),e.jsx(m,{icon:e.jsx(T,{}),onClick:()=>{x(r)},style:{background:v.errorBg,borderColor:v.error,color:v.error,borderRadius:20,fontWeight:600},children:"Decline Agent"})]}),e.jsx(m,{onClick:o,style:{borderRadius:20,borderColor:"var(--border)",color:"var(--tx-sub)",marginLeft:l?"auto":0},children:"Close"})]})]})})},Ze=()=>{const[t,o]=p.useState([]),[r,i]=p.useState(!1),[x,j]=p.useState(""),[l,re]=p.useState("all"),[c,ae]=p.useState({currentPage:1,totalPages:1,totalResults:0,itemsPerPage:20}),[ne,D]=p.useState(!1),[$,S]=p.useState(null),[oe,w]=p.useState(!1),[P,k]=p.useState(""),[W,A]=p.useState(!1),B=p.useRef(null),g=p.useCallback(async(n=1,a=20,s="",d=l)=>{var E,L,N;i(!0);try{let z=`/agency/agents?page=${n}&limit=${a}`;d&&d!=="all"&&(z+=`&status=${d}`),s!=null&&s.trim()&&(z+=`&search=${encodeURIComponent(s.trim())}`);const R=await h.get(z),f=(R==null?void 0:R.data.data)||R,O=((f==null?void 0:f.data)||[]).map((ue,me)=>_e(ue,me,n,a));o(O),ae({currentPage:n,totalPages:((E=f==null?void 0:f.pagination)==null?void 0:E.pages)||1,totalResults:((L=f==null?void 0:f.pagination)==null?void 0:L.total)||O.length,itemsPerPage:((N=f==null?void 0:f.pagination)==null?void 0:N.limit)||a})}catch{o([])}finally{i(!1)}},[l]);p.useEffect(()=>{g(1,c.itemsPerPage,x,l)},[l]);const ie=n=>{const a=n.target.value;j(a),clearTimeout(B.current),B.current=setTimeout(()=>g(1,c.itemsPerPage,a,l),500)},se=n=>{S(n),D(!0)},F=async n=>{var a,s;try{await h.patch(`/agency/agents/${n}/approve`),u.success("Agent approved successfully!"),g(c.currentPage,c.itemsPerPage,x,l)}catch(d){u.error(((s=(a=d==null?void 0:d.response)==null?void 0:a.data)==null?void 0:s.message)||"Failed to approve agent")}},le=async()=>{var n,a;if(!P.trim()){u.warning("Please provide a reason for declining");return}try{await h.patch(`/agency/agents/${$._id}/decline`,{reason:P}),u.success("Agent declined successfully!"),w(!1),S(null),k(""),g(c.currentPage,c.itemsPerPage,x,l)}catch(s){u.error(((a=(n=s==null?void 0:s.response)==null?void 0:n.data)==null?void 0:a.message)||"Failed to decline agent")}},M=n=>{S(n),k(""),w(!0)},ce=async n=>{var a,s;A(!0);try{await h.patch(`/agency/agents/${n}/suspend`,{}),u.success("Agent suspended successfully!"),g(c.currentPage,c.itemsPerPage,x,l)}catch(d){u.error(((s=(a=d==null?void 0:d.response)==null?void 0:a.data)==null?void 0:s.message)||"Failed to suspend agent")}finally{A(!1)}},de=async n=>{var a,s;A(!0);try{await h.patch(`/agency/agents/${n}/unsuspend`),u.success("Agent unsuspended successfully!"),g(c.currentPage,c.itemsPerPage,x,l)}catch(d){u.error(((s=(a=d==null?void 0:d.response)==null?void 0:a.data)==null?void 0:s.message)||"Failed to unsuspend agent")}finally{A(!1)}},pe=t.length,fe=t.filter(n=>n.agencyApprovalStatus==="pending").length,xe=t.filter(n=>n.agencyApprovalStatus==="approved").length,ge=[{key:"name",title:"Agent",sortable:!0,render:(n,a)=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[e.jsx(ee,{name:a.name,src:a.avatar,size:38}),e.jsxs("div",{children:[e.jsx(K,{strong:!0,style:{fontFamily:"Sora, sans-serif",color:"var(--tx)",fontSize:13},children:a.name}),e.jsxs("div",{style:{fontSize:11,color:"var(--tx-muted)",display:"flex",alignItems:"center",gap:4,marginTop:2},children:[e.jsx(J,{style:{fontSize:10,color:"var(--sb-accent)"}}),e.jsx("span",{children:a.email||"--"})]})]})]})},{key:"phone",title:"Contact",render:(n,a)=>e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:3},children:e.jsxs("div",{style:{fontSize:12,color:"var(--tx-sub)",display:"flex",alignItems:"center",gap:5,fontWeight:600},children:[e.jsx(_,{style:{color:"var(--sb-accent)",fontSize:11}}),a.phone?e.jsx("a",{href:`tel:${a.phone}`,style:{color:"inherit",textDecoration:"none"},children:a.phone}):"--"]})})},{key:"city",title:"City",sortable:!0,render:(n,a)=>e.jsx("div",{children:e.jsxs("div",{style:{fontSize:12,color:"var(--tx-sub)",display:"flex",alignItems:"center",gap:5,fontWeight:600},children:[e.jsx(X,{style:{color:"var(--sb-accent)",fontSize:11}}),a.city||"--"]})})},{key:"specialization",title:"Specialization",sortable:!0,render:(n,a)=>De(a.specialization)},{key:"agencyApproval",title:"Agency Approval",render:(n,a)=>e.jsx(te,{status:a.agencyApprovalStatus})},{key:"actions",title:"Actions",render:(n,a)=>e.jsxs("div",{style:{display:"flex",gap:8,alignItems:"center"},children:[e.jsx(y,{title:"View Details",children:e.jsx(m,{type:"text",size:"small",icon:e.jsx(Re,{}),onClick:()=>se(a),style:{width:34,height:34,borderRadius:"50%",border:"1px solid var(--border)",color:"var(--sb-accent)",background:"var(--surface)"}})}),a.agencyApprovalStatus==="pending"&&e.jsxs(e.Fragment,{children:[e.jsx(y,{title:"Approve Agent",children:e.jsx(m,{type:"text",size:"small",icon:e.jsx(C,{}),onClick:()=>F(a._id),style:{width:34,height:34,borderRadius:"50%",border:"1px solid #10b981",color:"#10b981",background:"rgba(16,185,129,0.08)"}})}),e.jsx(y,{title:"Decline Agent",children:e.jsx(m,{type:"text",size:"small",icon:e.jsx(T,{}),onClick:()=>M(a),style:{width:34,height:34,borderRadius:"50%",border:"1px solid #ef4444",color:"#ef4444",background:"rgba(239,68,68,0.08)"}})})]}),a.agencyApprovalStatus==="approved"&&(a.status?e.jsx(y,{title:"Suspend Agent",children:e.jsx(m,{type:"text",size:"small",icon:e.jsx(T,{}),onClick:()=>ce(a._id),loading:W,style:{width:34,height:34,borderRadius:"50%",border:"1px solid #d97706",color:"#d97706",background:"rgba(217,119,6,0.08)"}})}):e.jsx(y,{title:"Unsuspend Agent",children:e.jsx(m,{type:"text",size:"small",icon:e.jsx(C,{}),onClick:()=>de(a._id),loading:W,style:{width:34,height:34,borderRadius:"50%",border:"1px solid #10b981",color:"#10b981",background:"rgba(16,185,129,0.08)"}})}))]})}];return e.jsxs("div",{style:{padding:"28px 24px",background:"var(--bg)",minHeight:"100vh",fontFamily:"'Inter',sans-serif"},children:[e.jsx("style",{children:`
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
          --sh-sm:  0 1px 3px rgba(92,3,155,0.07), 0 1px 2px rgba(0,0,0,0.04);
          --sh-md:  0 4px 16px rgba(92,3,155,0.11), 0 2px 4px rgba(0,0,0,0.04);
          --sh-lg:  0 14px 40px rgba(92,3,155,0.15), 0 4px 8px rgba(0,0,0,0.06);
          --sh-card:0 2px 8px rgba(92,3,155,0.07);
          --rad:    12px;
          --rad-sm: 8px;
          --rad-xs: 6px;
        }

        /* Customize CustomTable inside our theme */
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

        /* Action View Button Hover */
        .ant-btn-text:hover {
          border-color: var(--pur-mid) !important;
          background: var(--pur-soft) !important;
          color: var(--sb-accent) !important;
        }

        /* Search input theme overrides */
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

        /* Refresh Button theme overrides */
        .ant-btn:not(.ant-btn-text) {
          border-color: var(--border) !important;
        }
        .ant-btn:not(.ant-btn-text):hover {
          border-color: var(--sb-accent) !important;
          color: var(--sb-accent) !important;
        }

        /* Pagination Style overrides */
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
      `}),e.jsxs("div",{style:{maxWidth:1300,margin:"0 auto"},children:[e.jsx("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,gap:10,flexWrap:"wrap",animation:"fadeUp .3s ease"},children:e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:4},children:[e.jsx("div",{style:{width:38,height:38,borderRadius:12,background:"linear-gradient(135deg,#5c039b,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 16px rgba(92,3,155,.3)"},children:e.jsx(V,{style:{color:"#fff",fontSize:18}})}),e.jsx("h1",{style:{fontSize:24,fontWeight:800,color:"var(--tx)",margin:0,fontFamily:"'Sora', sans-serif"},children:"Agent Team"})]}),e.jsx("p",{style:{fontSize:13,color:"var(--tx-sub)",margin:0,marginLeft:48,fontWeight:500},children:"Manage and monitor your partner's real estate agents"})]})}),e.jsx(be,{gutter:[16,16],style:{marginBottom:20},children:[{icon:e.jsx(V,{}),label:"Total Agents",value:pe,color:"var(--sb-accent)"},{icon:e.jsx(C,{}),label:"Approved",value:xe,color:"var(--success)"},{icon:e.jsx(he,{}),label:"Pending",value:fe,color:"#d97706"}].map((n,a)=>e.jsx(ye,{xs:24,sm:8,children:e.jsx($e,{...n})},a))}),e.jsx(ve,{activeKey:l,onChange:re,style:{marginBottom:20},items:[{key:"all",label:"All Agents"},{key:"pending",label:"Pending Approval"},{key:"approved",label:"Approved"},{key:"declined",label:"Declined"}]}),e.jsxs(je,{bordered:!1,style:{borderRadius:14,overflow:"hidden",border:"1.5px solid var(--border)",boxShadow:"var(--sh-card)"},bodyStyle:{padding:0},children:[e.jsx("div",{style:{display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",borderBottom:"1px solid var(--border)",gap:12,background:"#fff"},children:e.jsxs("div",{style:{display:"flex",gap:10,flexWrap:"wrap"},children:[e.jsx(U,{placeholder:"Search name, email, phone...",prefix:e.jsx(Se,{style:{color:"var(--tx-muted)"}}),value:x,onChange:ie,allowClear:!0,onClear:()=>{j(""),g(1,c.itemsPerPage,"",l)},style:{width:260,borderRadius:20}}),e.jsx(m,{icon:e.jsx(ke,{size:14}),onClick:()=>g(c.currentPage,c.itemsPerPage,x,l),style:{borderRadius:20},children:"Refresh"})]})}),e.jsx(Pe,{columns:ge,data:t,loading:r,totalItems:c.totalResults,currentPage:c.currentPage,onPageChange:(n,a)=>g(n,a,x,l),scroll:{x:1050},showSearch:!1})]})]}),e.jsx(We,{open:ne,onClose:()=>D(!1),agent:$,onApprove:F,onDecline:M}),e.jsxs(Q,{title:"Decline Agent",open:oe,onOk:le,onCancel:()=>{w(!1),S(null),k("")},okText:"Decline",okButtonProps:{danger:!0},children:[e.jsx(K,{children:"Please provide a reason for declining this agent:"}),e.jsx(U.TextArea,{rows:4,value:P,onChange:n=>k(n.target.value),style:{marginTop:10},placeholder:"Reason..."})]})]})};export{Ze as default};
