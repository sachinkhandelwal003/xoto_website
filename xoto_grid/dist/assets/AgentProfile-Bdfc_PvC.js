import{r as l,s as De,_ as Se,F as i,a as I,j as e,c as F,aW as Pe,T as Ue,G as $e,H as Ee,z as se,n as Fe,R as B,g as Me,k as Be,bh as Te,y as Le,h as k,B as f,q as re,C as d,I as c,i as ne,L as T,E as Oe,U as He}from"./index-GdvsrsK9.js";import{d as ie}from"./dayjs.min-C5oOvcsE.js";import{s as m}from"./index-BIUPx7jD.js";import{D as b}from"./index-B7e0_U6j.js";import{R as Ye}from"./BankOutlined-C0dr0Zs0.js";import{S as xe}from"./index-B98842Cl.js";import{R as qe}from"./WarningOutlined-pCMmhULb.js";import{R as Ve}from"./SafetyCertificateOutlined-I2JZlflt.js";import{R as L}from"./FilePdfOutlined-TUEZFbNG.js";import{U as P}from"./index-BIyYNqcQ.js";import{R as Ge}from"./CameraOutlined-DGp-Oh6o.js";import{T as y}from"./index-DkuD61z0.js";import{P as le}from"./progress-DA375sSQ.js";import{R as We}from"./SyncOutlined-7-fSNSAT.js";import{M as oe}from"./index-Cl93UlzA.js";import{D as ce}from"./index-CcS7bgE8.js";import{D as Je}from"./index-0AVWFpbJ.js";import{R as de}from"./UploadOutlined-DjT7dApV.js";import"./context-bJgVWRg1.js";import"./fade-CDzJXbVW.js";import"./PaperClipOutlined-DEe2tVFY.js";import"./DeleteOutlined-DpKqx3Y2.js";import"./DownloadOutlined-B_6I8RDC.js";import"./useClosable-2fFoNukg.js";import"./ActionButton-KyfGOTiI.js";import"./context-BjGtD5ms.js";import"./CalendarOutlined-CIeUwdf_.js";var Ke={icon:{tag:"svg",attrs:{viewBox:"0 0 1024 1024",focusable:"false"},children:[{tag:"path",attrs:{d:"M885.2 446.3l-.2-.8-112.2-285.1c-5-16.1-19.9-27.2-36.8-27.2H281.2c-17 0-32.1 11.3-36.9 27.6L139.4 443l-.3.7-.2.8c-1.3 4.9-1.7 9.9-1 14.8-.1 1.6-.2 3.2-.2 4.8V830a60.9 60.9 0 0060.8 60.8h627.2c33.5 0 60.8-27.3 60.9-60.8V464.1c0-1.3 0-2.6-.1-3.7.4-4.9 0-9.6-1.3-14.1zm-295.8-43l-.3 15.7c-.8 44.9-31.8 75.1-77.1 75.1-22.1 0-41.1-7.1-54.8-20.6S436 441.2 435.6 419l-.3-15.7H229.5L309 210h399.2l81.7 193.3H589.4zm-375 76.8h157.3c24.3 57.1 76 90.8 140.4 90.8 33.7 0 65-9.4 90.3-27.2 22.2-15.6 39.5-37.4 50.7-63.6h156.5V814H214.4V480.1z"}}]},name:"inbox",theme:"outlined"},Qe=function(w,v){return l.createElement(De,Se({},w,{ref:v,icon:Ke}))},Xe=l.forwardRef(Qe);const{Text:N,Title:me,Paragraph:Ze}=Ue,{Step:O}=xe,{TextArea:ea}=c,p="#5C039B",aa=(a="")=>a.replace(/\.[^/.]+$/,"")||"Document",ta=a=>(a==null?void 0:a.agencyApprovalStatus)==="approved"&&(a==null?void 0:a.adminApprovalStatus)==="approved"&&(a==null?void 0:a.isActive)!==!1,Da=()=>{var ee,ae,te;const[a,w]=l.useState(null),[v,A]=l.useState([]),[_,u]=l.useState({}),[pe,H]=l.useState(!0),[he,Y]=l.useState(!1),[ue,U]=l.useState(!1),[ge,q]=l.useState(!1),[V,G]=l.useState(!1),[je,W]=l.useState(""),[g,$]=l.useState({open:!1,file:null}),[C,J]=l.useState(!1),[fe,z]=l.useState(0),[K]=i.useForm(),[R]=i.useForm(),D=l.useCallback(async()=>{var n;const t=await I.get("profile/get-profile-data"),s=((n=t==null?void 0:t.data)==null?void 0:n.data)||(t==null?void 0:t.data);return w(s),s},[]),E=l.useCallback(async()=>{const t=await I.get("agent/agreements"),s=(t==null?void 0:t.data)||{};A(s.agreements||[]),u(s.summary||{})},[]),Q=l.useCallback(async()=>{H(!0);try{await Promise.all([D(),E()])}catch(t){console.error(t),m.error("Failed to load agent profile")}finally{H(!1)}},[E,D]);l.useEffect(()=>{Q()},[Q]);const be=async()=>{Y(!0);try{await Promise.all([D(),E()]),m.success("Profile refreshed")}catch{m.error("Failed to refresh profile")}finally{Y(!1)}},X=async(t,s,n,r,j)=>{var h;const x=new FormData;x.append("profilePicture",t),x.append("targetField",s),s==="profile_photo"?G(!0):W(s);try{await I.post("profile/update-profile-picture",x),m.success(`${n} uploaded`),r==null||r("ok");const o=await D();if(s==="profile_photo"){const Re=(o==null?void 0:o.profile_photo)||((h=o==null?void 0:o.data)==null?void 0:h.profile_photo);window.dispatchEvent(new CustomEvent("gridAdvisorPhotoUpdated",{detail:{photoUrl:Re}}))}}catch(o){console.error(o),j==null||j(o),m.error(`${n} upload failed`)}finally{G(!1),W("")}},ye=t=>{const s=t.type==="image/jpeg"||t.type==="image/png"||t.type==="image/webp";s||m.error("Upload JPG, PNG, or WEBP image only");const n=t.size/1024/1024<5;return n||m.error("Image must be smaller than 5MB"),s&&n},Ne=()=>{var t,s,n,r;K.setFieldsValue({first_name:a==null?void 0:a.first_name,last_name:a==null?void 0:a.last_name,country_code:a==null?void 0:a.country_code,phone_number:a==null?void 0:a.phone_number,email:a==null?void 0:a.email,operating_city:a==null?void 0:a.operating_city,country:a==null?void 0:a.country,specialization:a==null?void 0:a.specialization,reraCardNumber:a==null?void 0:a.reraCardNumber,accountHolderName:(t=a==null?void 0:a.bankDetails)==null?void 0:t.accountHolderName,bankName:(s=a==null?void 0:a.bankDetails)==null?void 0:s.bankName,iban:(n=a==null?void 0:a.bankDetails)==null?void 0:n.iban,accountNumber:(r=a==null?void 0:a.bankDetails)==null?void 0:r.accountNumber}),U(!0)},ve=async t=>{var s,n;q(!0);try{await I.put("profile/update-profile",{first_name:t.first_name,last_name:t.last_name,country_code:t.country_code,phone_number:t.phone_number,operating_city:t.operating_city,country:t.country,specialization:t.specialization,reraCardNumber:t.reraCardNumber,bankDetails:{accountHolderName:t.accountHolderName||"",bankName:t.bankName||"",iban:t.iban||"",accountNumber:t.accountNumber||""}}),m.success("Profile updated"),U(!1),await D()}catch(r){m.error(((n=(s=r==null?void 0:r.response)==null?void 0:s.data)==null?void 0:n.message)||"Failed to update profile")}finally{q(!1)}},ke=t=>t.size/1024/1024>25?(m.error("Maximum agreement file size is 25MB"),P.LIST_IGNORE):(R.setFieldsValue({documentName:aa(t.name)}),$(s=>({...s,file:t})),P.LIST_IGNORE),we=async()=>{var t,s,n;if(!g.file){m.warning("Please select a signed agreement file");return}try{const r=await R.validateFields();J(!0),z(5);const j=new FormData;j.append("file",g.file);const x=await I.upload("upload",j,o=>{o.total&&z(Math.max(5,Math.round(o.loaded*88/o.total)))}),h=(x==null?void 0:x.file)||((t=x==null?void 0:x.data)==null?void 0:t.file)||{};if(!h.url)throw new Error("No file URL returned");z(94),await I.post("agent/agreements/documents",{name:((s=r.documentName)==null?void 0:s.trim())||g.file.name,remarks:((n=r.remarks)==null?void 0:n.trim())||"",expiryDate:r.expiryDate?r.expiryDate.toISOString():null,url:h.url,mimeType:h.mimeType||g.file.type,size:h.size||g.file.size}),z(100),m.success("Agreement uploaded"),R.resetFields(),$({open:!1,file:null}),await E()}catch(r){console.error(r),r!=null&&r.errorFields||m.error((r==null?void 0:r.message)||"Agreement upload failed")}finally{J(!1),z(0)}},Ie=(a==null?void 0:a.fullName)||`${(a==null?void 0:a.first_name)||""} ${(a==null?void 0:a.last_name)||""}`.trim()||"Agent",M=ta(a),S=!!(a!=null&&a.emiratesIdUrl&&(a!=null&&a.reraCardUrl)),Ae=v.some(t=>t.status==="active"),_e=Math.round([a==null?void 0:a.first_name,a==null?void 0:a.last_name,a==null?void 0:a.email,a==null?void 0:a.phone_number,a==null?void 0:a.operating_city,a==null?void 0:a.specialization,a==null?void 0:a.profile_photo,a==null?void 0:a.emiratesIdUrl,a==null?void 0:a.reraCardUrl,Ae].filter(Boolean).length/10*100),Z=({title:t,description:s,field:n,url:r,icon:j})=>e.jsx(d,{xs:24,md:12,children:e.jsxs("div",{className:"agent-doc-card",children:[e.jsx("div",{className:"agent-doc-icon",children:j}),e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsx(N,{strong:!0,children:t}),e.jsx(N,{type:"secondary",className:"block text-xs",children:s}),r?e.jsxs(k,{className:"mt-3",wrap:!0,children:[e.jsx(f,{size:"small",icon:e.jsx(ne,{}),onClick:()=>window.open(r,"_blank"),children:"Open"}),e.jsx(y,{color:"green",children:"Uploaded"})]}):e.jsx(y,{color:"red",className:"mt-3",children:"Missing"})]}),e.jsx(P,{showUploadList:!1,customRequest:({file:x,onSuccess:h,onError:o})=>X(x,n,t,h,o),children:e.jsx(f,{icon:e.jsx(de,{}),loading:je===n,className:"theme-soft",children:r?"Replace":"Upload"})})]})}),Ce=()=>e.jsxs("div",{children:[e.jsxs("div",{className:"mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",children:[e.jsxs(k,{size:10,wrap:!0,children:[e.jsx(N,{strong:!0,children:"Signed A2A Agreements"}),e.jsxs(y,{color:"blue",children:[_.total||0," total"]}),e.jsxs(y,{color:"green",children:[_.active||0," active"]})]}),e.jsx(f,{icon:e.jsx(de,{}),className:"theme-primary",onClick:()=>$({open:!0,file:null}),children:"Upload Signed Agreement"})]}),v.length?e.jsx(T,{dataSource:v,renderItem:t=>e.jsxs(T.Item,{className:"agent-list-item",children:[e.jsx(T.Item.Meta,{avatar:e.jsx(L,{style:{fontSize:30,color:"#dc2626"}}),title:e.jsxs(k,{wrap:!0,children:[e.jsx(N,{strong:!0,children:t.agreement_type}),e.jsx(y,{color:t.status==="active"?"green":"default",children:t.status})]}),description:`Effective ${t.effective_date?ie(t.effective_date).format("DD MMM YYYY"):"N/A"} - Expiry ${t.expiry_date?ie(t.expiry_date).format("DD MMM YYYY"):"No expiry"}`}),e.jsx(k,{wrap:!0,children:(t.documents||[]).slice(0,3).map(s=>e.jsx(f,{size:"small",icon:e.jsx(ne,{}),onClick:()=>window.open(s.url,"_blank"),children:s.name||"Open"},s.id))})]})}):e.jsx(Oe,{description:"No signed agreement uploaded yet"})]});if(pe&&!a)return e.jsx("div",{className:"agent-profile-page",children:e.jsx(F,{className:"mx-auto w-full max-w-6xl rounded-xl",children:e.jsx(Pe,{active:!0,avatar:!0,paragraph:{rows:8}})})});const ze=[{key:"profile",label:e.jsxs("span",{children:[e.jsx(se,{})," Profile Details"]}),children:e.jsx("div",{className:"pt-5",children:e.jsxs(b,{bordered:!0,column:{xxl:2,xl:2,lg:2,md:1,sm:1,xs:1},size:"middle",labelStyle:{fontWeight:700,background:"#fafafa",width:180},children:[e.jsx(b.Item,{label:e.jsxs(e.Fragment,{children:[e.jsx($e,{})," Email"]}),children:e.jsx(N,{copyable:!0,children:(a==null?void 0:a.email)||"N/A"})}),e.jsxs(b.Item,{label:e.jsxs(e.Fragment,{children:[e.jsx(Ee,{})," Phone"]}),children:[a==null?void 0:a.country_code," ",a==null?void 0:a.phone_number]}),e.jsx(b.Item,{label:"Operating City",children:(a==null?void 0:a.operating_city)||"N/A"}),e.jsx(b.Item,{label:"Country",children:(a==null?void 0:a.country)||"UAE"}),e.jsx(b.Item,{label:"Specialization",children:(a==null?void 0:a.specialization)||"General"}),e.jsx(b.Item,{label:"RERA Card Number",children:(a==null?void 0:a.reraCardNumber)||"N/A"}),e.jsx(b.Item,{label:e.jsxs(e.Fragment,{children:[e.jsx(Ye,{})," Bank"]}),span:2,children:e.jsxs(Ze,{className:"mb-0",children:[((ee=a==null?void 0:a.bankDetails)==null?void 0:ee.bankName)||"No bank added"," ",(ae=a==null?void 0:a.bankDetails)!=null&&ae.iban?`- IBAN ${a.bankDetails.iban}`:""]})})]})})},{key:"documents",label:e.jsxs("span",{children:[e.jsx(Ve,{})," KYC & Documents"]}),children:e.jsxs("div",{className:"pt-5",children:[e.jsxs(F,{className:"status-card",style:{background:S?"#f6ffed":"#fff7e6",borderColor:S?"#b7eb8f":"#ffd666"},children:[e.jsxs(xe,{current:S?2:0,size:"small",className:"mb-6",children:[e.jsx(O,{title:"Upload Documents"}),e.jsx(O,{title:"Admin Review"}),e.jsx(O,{title:"Verified"})]}),e.jsxs("div",{className:"text-center",children:[S?e.jsx(Fe,{style:{fontSize:40,color:"#52c41a"}}):e.jsx(qe,{style:{fontSize:40,color:"#faad14"}}),e.jsx(me,{level:4,className:"mt-4",children:S?"Documents Uploaded":"Action Required"}),e.jsx(N,{type:"secondary",children:"Upload Emirates ID and RERA card to keep your agent profile complete."})]})]}),e.jsxs(B,{gutter:[16,16],className:"mt-5",children:[Z({title:"Emirates ID",description:"Upload Emirates ID copy, PDF or image.",field:"emiratesIdUrl",url:a==null?void 0:a.emiratesIdUrl,icon:e.jsx(He,{})}),Z({title:"RERA Card",description:"Upload your RERA card or certificate.",field:"reraCardUrl",url:a==null?void 0:a.reraCardUrl,icon:e.jsx(L,{})})]})]})},{key:"agreement",label:e.jsxs("span",{children:[e.jsx(L,{})," Agent Agreement"]}),children:e.jsx("div",{className:"pt-5",children:Ce()})}];return e.jsxs("div",{className:"agent-profile-page",children:[e.jsxs("div",{className:"mx-auto max-w-6xl",children:[e.jsx(F,{className:"profile-hero-card",cover:e.jsx("div",{className:"profile-cover"}),bodyStyle:{padding:0},children:e.jsxs("div",{className:"profile-hero-body",children:[e.jsxs("div",{className:"profile-identity",children:[e.jsx(Me,{dot:!0,status:M?"success":"warning",offset:[-8,92],children:e.jsx(P,{showUploadList:!1,beforeUpload:ye,customRequest:({file:t,onSuccess:s,onError:n})=>X(t,"profile_photo","Profile photo",s,n),disabled:V,children:e.jsx(Be,{title:"Change Photo",children:e.jsxs("div",{className:"avatar-shell",children:[V&&e.jsx("div",{className:"avatar-loading",children:e.jsx(Te,{spin:!0})}),e.jsx("div",{className:"avatar-hover",children:e.jsx(Ge,{})}),e.jsx(Le,{size:128,icon:e.jsx(se,{}),src:a==null?void 0:a.profile_photo,className:"profile-avatar"})]})})})}),e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsx(me,{level:2,className:"!mb-2 !text-gray-800",children:Ie}),e.jsxs(k,{size:10,wrap:!0,children:[e.jsx(y,{color:"purple",className:"pill-tag",children:"Grid Agent"}),e.jsx(y,{color:M?"success":"warning",className:"pill-tag",children:M?"Approved Agent":"Pending Verification"}),((te=a==null?void 0:a.agency)==null?void 0:te.agency_name)&&e.jsx(y,{className:"pill-tag",children:a.agency.agency_name})]}),e.jsxs("div",{className:"mt-4 max-w-lg",children:[e.jsx(N,{type:"secondary",children:"Profile Completion"}),e.jsx(le,{percent:_e,strokeColor:p})]})]})]}),e.jsxs(k,{wrap:!0,children:[e.jsx(f,{icon:e.jsx(We,{spin:he}),onClick:be,children:"Refresh"}),e.jsx(f,{icon:e.jsx(re,{}),onClick:Ne,className:"theme-primary",children:"Edit Profile"})]})]})}),e.jsx(F,{className:"profile-tabs-card",bodyStyle:{padding:"0 24px 24px"},children:e.jsx(sa,{items:ze})})]}),e.jsx(oe,{title:e.jsxs(k,{children:[e.jsx(re,{style:{color:p}})," Edit Agent Profile"]}),open:ue,onCancel:()=>U(!1),footer:null,width:820,destroyOnClose:!0,children:e.jsxs(i,{form:K,layout:"vertical",onFinish:ve,className:"mt-4",children:[e.jsx(ce,{orientation:"left",children:"Basic Information"}),e.jsxs(B,{gutter:16,children:[e.jsx(d,{xs:24,md:12,children:e.jsx(i.Item,{name:"first_name",label:"First Name",rules:[{required:!0}],children:e.jsx(c,{size:"large"})})}),e.jsx(d,{xs:24,md:12,children:e.jsx(i.Item,{name:"last_name",label:"Last Name",rules:[{required:!0}],children:e.jsx(c,{size:"large"})})}),e.jsx(d,{xs:24,md:12,children:e.jsx(i.Item,{name:"email",label:"Email",children:e.jsx(c,{size:"large",disabled:!0})})}),e.jsx(d,{xs:8,md:6,children:e.jsx(i.Item,{name:"country_code",label:"Code",children:e.jsx(c,{size:"large"})})}),e.jsx(d,{xs:16,md:6,children:e.jsx(i.Item,{name:"phone_number",label:"Phone",children:e.jsx(c,{size:"large"})})}),e.jsx(d,{xs:24,md:12,children:e.jsx(i.Item,{name:"operating_city",label:"Operating City",children:e.jsx(c,{size:"large"})})}),e.jsx(d,{xs:24,md:12,children:e.jsx(i.Item,{name:"country",label:"Country",children:e.jsx(c,{size:"large"})})}),e.jsx(d,{xs:24,children:e.jsx(i.Item,{name:"specialization",label:"Specialization",children:e.jsx(c,{size:"large"})})}),e.jsx(d,{xs:24,children:e.jsx(i.Item,{name:"reraCardNumber",label:"RERA Card Number",children:e.jsx(c,{size:"large"})})})]}),e.jsx(ce,{orientation:"left",children:"Bank Details"}),e.jsxs(B,{gutter:16,children:[e.jsx(d,{xs:24,md:12,children:e.jsx(i.Item,{name:"accountHolderName",label:"Account Holder",children:e.jsx(c,{size:"large"})})}),e.jsx(d,{xs:24,md:12,children:e.jsx(i.Item,{name:"bankName",label:"Bank Name",children:e.jsx(c,{size:"large"})})}),e.jsx(d,{xs:24,md:12,children:e.jsx(i.Item,{name:"iban",label:"IBAN",children:e.jsx(c,{size:"large"})})}),e.jsx(d,{xs:24,md:12,children:e.jsx(i.Item,{name:"accountNumber",label:"Account Number",children:e.jsx(c,{size:"large"})})})]}),e.jsxs("div",{className:"flex justify-end gap-3 border-t pt-5",children:[e.jsx(f,{size:"large",onClick:()=>U(!1),children:"Cancel"}),e.jsx(f,{size:"large",type:"primary",htmlType:"submit",loading:ge,className:"theme-primary",children:"Update Profile"})]})]})}),e.jsx(oe,{title:"Upload Signed Agreement",open:g.open,onCancel:()=>{C||(R.resetFields(),$({open:!1,file:null}))},okText:C?"Uploading...":"Upload Agreement",okButtonProps:{loading:C,className:"theme-primary"},onOk:we,destroyOnClose:!0,children:e.jsxs(i,{form:R,layout:"vertical",preserve:!1,children:[e.jsxs(i.Item,{label:"Signed agreement file",required:!0,children:[e.jsxs(P.Dragger,{showUploadList:!1,beforeUpload:ke,maxCount:1,disabled:C,children:[e.jsx("p",{className:"ant-upload-drag-icon",children:e.jsx(Xe,{style:{color:p}})}),e.jsx("p",{className:"ant-upload-text",children:"Click or drag signed agreement file here"}),e.jsx("p",{className:"ant-upload-hint",children:"PDF, image, or document files up to 25MB."})]}),g.file&&e.jsx("div",{className:"mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3",children:e.jsx(N,{strong:!0,children:g.file.name})})]}),C&&e.jsx(le,{percent:fe,strokeColor:p}),e.jsx(i.Item,{name:"documentName",label:"Document name",rules:[{required:!0,whitespace:!0}],children:e.jsx(c,{placeholder:"Signed A2A Agreement"})}),e.jsx(i.Item,{name:"expiryDate",label:"Agreement expiry",children:e.jsx(Je,{style:{width:"100%"},placeholder:"No expiry"})}),e.jsx(i.Item,{name:"remarks",label:"Remarks",children:e.jsx(ea,{rows:3,maxLength:500,showCount:!0})})]})}),e.jsx("style",{children:`
        .agent-profile-page {
          min-height: 100vh;
          background: #f6f8fb;
          padding: 24px 16px;
        }
        .profile-hero-card,
        .profile-tabs-card {
          border: 1px solid #e8edf5 !important;
          border-radius: 14px !important;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05) !important;
          overflow: hidden;
          margin-bottom: 18px;
        }
        .profile-cover {
          height: 178px;
          background: linear-gradient(135deg, #5C039B 0%, #7c3aed 52%, #251044 100%);
        }
        .profile-hero-body {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 18px;
          padding: 0 28px 24px;
        }
        .profile-identity {
          display: flex;
          align-items: flex-end;
          gap: 22px;
          min-width: 0;
          margin-top: -64px;
        }
        .avatar-shell {
          position: relative;
          cursor: pointer;
          border-radius: 999px;
          border: 4px solid #fff;
          background: #fff;
          box-shadow: 0 12px 30px rgba(92, 3, 155, 0.22);
        }
        .profile-avatar {
          background: #fff;
        }
        .avatar-hover,
        .avatar-loading {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          color: #fff;
          font-size: 28px;
          background: rgba(0, 0, 0, 0.42);
          opacity: 0;
          transition: opacity .2s ease;
        }
        .avatar-shell:hover .avatar-hover,
        .avatar-loading {
          opacity: 1;
        }
        .pill-tag {
          border: 0;
          border-radius: 999px;
          padding: 4px 12px;
          font-weight: 700;
        }
        .theme-primary {
          background: ${p} !important;
          border-color: ${p} !important;
          color: #fff !important;
          font-weight: 700;
        }
        .theme-soft {
          border-color: #d8b4fe !important;
          color: ${p} !important;
          font-weight: 700;
        }
        .status-card {
          border-radius: 12px !important;
        }
        .agent-doc-card {
          display: flex;
          align-items: center;
          gap: 14px;
          min-height: 132px;
          border: 1px solid #e8edf5;
          border-radius: 12px;
          background: #fff;
          padding: 16px;
        }
        .agent-doc-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 10px;
          background: #f3e8ff;
          color: ${p};
          font-size: 24px;
          flex-shrink: 0;
        }
        .agent-list-item {
          border: 1px solid #e8edf5 !important;
          border-radius: 12px;
          background: #fff;
          margin-bottom: 10px;
          padding: 14px 16px !important;
        }
        .ant-tabs-tab {
          padding: 16px 18px !important;
          font-weight: 600;
        }
        .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: ${p} !important;
        }
        .ant-tabs-ink-bar {
          background: ${p} !important;
        }
        @media (max-width: 768px) {
          .profile-hero-body,
          .profile-identity {
            align-items: flex-start;
            flex-direction: column;
          }
          .profile-hero-body {
            padding: 0 18px 20px;
          }
          .agent-doc-card {
            align-items: flex-start;
            flex-direction: column;
          }
          .agent-doc-card .ant-upload,
          .agent-doc-card .ant-btn {
            width: 100%;
          }
        }
      `})]})},sa=({items:a})=>{var _;const[w,v]=l.useState((_=a[0])==null?void 0:_.key),A=a.find(u=>u.key===w)||a[0];return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"flex flex-wrap border-b border-slate-200",children:a.map(u=>e.jsx("button",{type:"button",onClick:()=>v(u.key),className:`px-5 py-4 text-sm font-semibold ${w===u.key?"text-[#5C039B] border-b-2 border-[#5C039B]":"text-slate-500"}`,children:u.label},u.key))}),e.jsx("div",{children:A==null?void 0:A.children})]})};export{Da as default};
