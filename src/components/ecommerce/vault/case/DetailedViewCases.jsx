// DetailedViewCases.jsx - FIXED toggle with working API call
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiService } from '../../../../manageApi/utils/custom.apiservice';
import {
  message, Spin, Progress, Modal, Tabs, Tag, Descriptions,
  Row, Col, Card, Steps, Button, Space, Alert, Typography, Empty, notification, Switch
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UploadOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  EyeOutlined,
  ReloadOutlined,
  UserOutlined,
  BankOutlined,
  HomeOutlined,
  FileTextOutlined,
  DownloadOutlined,
  SyncOutlined,
  SolutionOutlined,
  FileOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

// Import the DOCUMENTS_LIST and helpers
import DOCUMENTS_LIST, { getDocumentDetails, getIconComponent, getDocumentCategoryFromList } from './documentList';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const PRIMARY = '#5c039c';
const PRIMARY_LIGHT = '#f3e8ff';

// Helper functions
const isPdf = (name = '') => name?.toLowerCase().endsWith('.pdf');
const fmtSize = (mb) => (mb >= 1 ? `${mb.toFixed(1)} MB` : `${(mb * 1024).toFixed(0)} KB`);

const btnStyle = (bg, color, border) => ({
  padding: '10px 14px',
  background: bg,
  border: `1px solid ${border}`,
  borderRadius: 8,
  color,
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: 5,
});

// View Button Component
const ViewButton = ({ doc }) => {
  const [open, setOpen] = useState(false);
  const fileUrl = doc?.fileUrl;
  if (!fileUrl) return null;
  return (
    <>
      <button onClick={() => setOpen(true)} style={btnStyle('#f3f4f6', '#374151', '#e5e7eb')}>
        <EyeOutlined /> View
      </button>
      <Modal open={open} onCancel={() => setOpen(false)} footer={null} width={1000} centered destroyOnClose>
        <div style={{ minHeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isPdf(fileUrl) ? (
            <iframe src={fileUrl} style={{ width: '100%', height: 600, border: 'none' }} title="PDF Preview" />
          ) : (
            <img src={fileUrl} alt="preview" style={{ maxHeight: 600, maxWidth: '100%', objectFit: 'contain' }} />
          )}
        </div>
      </Modal>
    </>
  );
};

// Dynamic Document Upload Card with WORKING toggle
const DynamicDocUploadCard = ({ document, caseId, uploadedDocs, onUploadSuccess, userRole }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [toggling, setToggling] = useState(false);

  // Get document details from DOCUMENTS_LIST
  const docDetails = getDocumentDetails(document.formName, document.documentType);
  const IconComponent = docDetails ? getIconComponent(docDetails.icon) : FileTextOutlined;
  const docLabel = document.formName || docDetails?.formName || document.documentType?.replace(/_/g, ' ').toUpperCase() || 'Document';
  const docCategory = docDetails?.category || getDocumentCategoryFromList(document.formName, document.documentType) || 'Other';
  
  const docKey = document._id;
  const existing = uploadedDocs.find(d => d.bankFormId === docKey || d.documentType === docKey || d.documentType === document.documentType);
  
  const isUploaded = !!existing;
  const isVerified = existing?.verificationStatus === 'verified';
  const isRejected = existing?.verificationStatus === 'rejected';
  const status = isVerified ? 'verified' : isRejected ? 'rejected' : isUploaded ? 'pending' : null;
  
  const isDownloadable = document.actionType === 'download_fill_upload' || docDetails?.isDownloadable;
  const maxSize = isDownloadable ? 20 : 10;
  
  // Get current assignment from document.bankFormHandling
  const handledByAdvisor = document.bankFormHandling?.handledByAdvisor || false;
  const assignedToOps = document.bankFormHandling?.assignedToOps || false;
  
  const SC = {
    verified: { color: '#10b981', bg: '#ecfdf5', icon: <CheckCircleOutlined />, text: 'Verified' },
    rejected: { color: '#ef4444', bg: '#fef2f2', icon: <CloseCircleOutlined />, text: 'Rejected' },
    pending: { color: '#f59e0b', bg: '#fffbeb', icon: <ClockCircleOutlined />, text: 'Pending' },
  };
  const sc = SC[status];

  // ✅ FIXED: Toggle handler with proper API call and debug logs
  const handleToggleAssignment = async (checked) => {
    console.log('🔘 Toggle clicked! New value:', checked);
    console.log('Document ID:', document._id);
    console.log('Case ID:', caseId);
    
    if (!isDownloadable) {
      message.warning('Toggle is only available for downloadable bank forms');
      return;
    }
    
    if (isUploaded) {
      message.warning('Cannot change assignment after document is uploaded');
      return;
    }
    
    setToggling(true);
    try {
      const newHandledByAdvisor = checked;
      
      // ✅ CORRECT API ENDPOINT
      const apiUrl = `/vault/lead/documents/${caseId}/document-handler`;
      console.log('📡 Calling API:', apiUrl);
      console.log('📦 Payload:', { bankFormId: document._id, handledByAdvisor: newHandledByAdvisor });
      
      const res = await apiService.post(apiUrl, {
        bankFormId: document._id,
        handledByAdvisor: newHandledByAdvisor
      });
      
      console.log('✅ API Response:', res);
      
      if (res.success) {
        message.success(res.message);
        onUploadSuccess(); // Refresh data
      } else {
        message.error(res.message || 'Failed to update assignment');
      }
    } catch (err) {
      console.error('❌ API Error:', err);
      message.error(err.response?.data?.message || 'Failed to update document assignment');
    } finally {
      setToggling(false);
    }
  };

  // Upload file handler
  const handleFile = async (file) => {
    if (!file) return;
    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > maxSize) { 
      message.error(`File size must be under ${maxSize} MB`); 
      return; 
    }
    try {
      setUploading(true);
      const uploadForm = new FormData();
      uploadForm.append('file', file);
      uploadForm.append('entityType', 'Case');
      uploadForm.append('entityId', caseId);
      const uploadRes = await apiService.post('/upload', uploadForm, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const fileUrl = uploadRes?.url || uploadRes?.file?.url;
      if (!fileUrl) throw new Error('File upload failed');
      
      await apiService.post(`/vault/lead/documents/cases/${caseId}`, {
        entityType: 'Case',
        entityId: caseId,
        documentType: document.documentType || docKey,
        documentCategory: docCategory.toLowerCase(),
        fileUrl,
        fileName: file.name,
        fileSizeMb: parseFloat(sizeMb.toFixed(2)),
        mimeType: file.type,
        bankFormId: docKey,
        bankFormName: document.formName,
      });
      message.success(`${docLabel} uploaded successfully!`);
      onUploadSuccess();
    } catch (err) {
      console.error(err);
      message.error(`Failed to upload ${docLabel}. Please try again.`);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  // Handle Download for bank forms
  const downloadImage = async (imageUrl) => {
    try {
      let key = imageUrl.split(".amazonaws.com/")[1];
      if (!key) {
        notification.error({ message: "Invalid Image URL" });
        return;
      }
      key = decodeURIComponent(key);
      await apiService.download(
        `/download-pdf?key=${encodeURIComponent(key)}`,
        `xoto_vault_download_${Date.now()}.pdf`
      );
    } catch (error) {
      notification.error({ message: "Download Failed", description: "PDF could not be generated." });
    }
  };

  // Determine if user can upload this document
  const canUpload = () => {
    if (userRole === 'admin') return true;
    if (userRole === 'advisor' && handledByAdvisor) return true;
    if (userRole === 'ops' && assignedToOps) return true;
    if (!isDownloadable && userRole === 'advisor') return true;
    return false;
  };

  // Show toggle ONLY for downloadable bank forms, NOT uploaded yet, and user is Advisor
  const showToggle = isDownloadable && !isUploaded && userRole === 'advisor';

  return (
    <div
      style={{
        background: '#fff',
        border: `1.5px solid ${dragOver ? PRIMARY : isVerified ? '#10b981' : isUploaded ? PRIMARY : '#e5e7eb'}`,
        borderRadius: 14,
        padding: 20,
        transition: 'all 0.2s',
      }}
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: existing ? (isVerified ? '#ecfdf5' : PRIMARY_LIGHT) : '#f3f4f6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, color: isVerified ? '#10b981' : existing ? PRIMARY : '#9ca3af',
          }}>
            {existing ? (isPdf(existing.fileName) ? <FilePdfOutlined /> : <FileImageOutlined />) : <IconComponent />}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{docLabel}</div>
            {existing?.fileName && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 3 }}>{existing.fileName}</div>}
            {document.isMandatory && <Tag color="error" style={{ marginTop: 4 }}>Required</Tag>}
            {docCategory && <Tag color="blue" style={{ marginTop: 4 }}>{docCategory}</Tag>}
            {isDownloadable && !isUploaded && (
              <Tag color={handledByAdvisor ? 'green' : 'orange'} style={{ marginTop: 4 }}>
                {handledByAdvisor ? '👨‍💼 Advisor Uploads' : '👥 Ops Uploads'}
              </Tag>
            )}
          </div>
        </div>
        {sc && (
          <span style={{ fontSize: 12, fontWeight: 600, color: sc.color, background: sc.bg, padding: '4px 10px', borderRadius: 20 }}>
            {sc.icon} {sc.text}
          </span>
        )}
      </div>

      {/* Toggle Switch - Per card toggle with FIXED onChange */}
      {showToggle && (
        <div style={{ 
          marginBottom: 12, 
          padding: '12px', 
          background: handledByAdvisor ? '#ecfdf5' : '#fef3c7',
          borderRadius: 10,
          border: `1px solid ${handledByAdvisor ? '#10b981' : '#f59e0b'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <Text strong style={{ fontSize: 12 }}>
                {handledByAdvisor ? '👨‍💼 You will upload this form' : '👥 Mortgage Ops will handle this form'}
              </Text>
              <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                {handledByAdvisor 
                  ? 'You are responsible for downloading, filling, signing and uploading this form' 
                  : 'Ops team will handle this form. You don\'t need to upload anything.'}
              </div>
            </div>
            <Switch
              checked={handledByAdvisor}
              onChange={handleToggleAssignment}  // ✅ Pass the checked value directly
              loading={toggling}
              checkedChildren="Advisor"
              unCheckedChildren="Ops"
              disabled={isUploaded}
            />
          </div>
        </div>
      )}

      {/* Description */}
      {(document.description || docDetails?.description) && (
        <div style={{ fontSize: 12, color: '#6b7280', background: '#f9fafb', borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
          {document.description || docDetails?.description}
        </div>
      )}

      {/* Instructions */}
      {(document.fillInstructions || docDetails?.fillInstructions) && (
        <div style={{ fontSize: 12, color: '#374151', display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 12 }}>
          <InfoCircleOutlined style={{ color: PRIMARY, marginTop: 2 }} />
          <span>{document.fillInstructions || docDetails?.fillInstructions}</span>
        </div>
      )}

      {/* Step indicators for downloadable forms */}
      {isDownloadable && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f5f3ff', borderRadius: 10, padding: '10px 14px', marginBottom: 12 }}>
          {['⬇️ Download', '✏️ Fill', '✍️ Sign', '⬆️ Upload'].map((step, i) => (
            <React.Fragment key={step}>
              <span style={{ fontSize: 12, fontWeight: 600, color: PRIMARY }}>{step}</span>
              {i < 3 && <div style={{ flex: 1, height: 1.5, background: `${PRIMARY}40`, borderRadius: 2 }} />}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Drag zone */}
      {!isVerified && canUpload() && (
        <div style={{ border: `1.5px dashed ${dragOver ? PRIMARY : '#d1d5db'}`, borderRadius: 10, padding: '12px', textAlign: 'center', background: dragOver ? PRIMARY_LIGHT : '#fafafa', marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: '#6b7280' }}>{dragOver ? '📂 Drop to upload' : 'Drag & drop or click below'}</div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
            {isDownloadable ? 'PDF' : 'PDF, JPG, PNG'} • Max {maxSize} MB
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {!isVerified && canUpload() && (
          <>
            <input ref={inputRef} type="file" accept={isDownloadable ? '.pdf' : '.pdf,.jpg,.jpeg,.png'} style={{ display: 'none' }} onChange={e => handleFile(e.target.files?.[0])} />
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              style={{ flex: 1, minWidth: 120, padding: '10px', background: uploading ? '#e5e7eb' : PRIMARY, color: uploading ? '#9ca3af' : '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: uploading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              {uploading ? <><Spin size="small" /> Uploading…</> : existing ? <><ReloadOutlined /> Re-upload</> : <><UploadOutlined /> Upload {isDownloadable ? 'Filled Form' : 'Document'}</>}
            </button>
          </>
        )}
        
        {isDownloadable && (document.fileUrl || docDetails?.fileUrl) && (
          <button
            onClick={() => downloadImage(document.fileUrl || docDetails?.fileUrl)}
            style={btnStyle('linear-gradient(135deg, #10b981, #059669)', '#fff', 'none')}
          >
            <DownloadOutlined /> Download Template
          </button>
        )}
        
        {existing?.fileUrl && <ViewButton doc={existing} />}
      </div>

      {/* Status Messages */}
      {isUploaded && !isVerified && !isRejected && (
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#d97706', marginTop: 12 }}>
          <ClockCircleOutlined style={{ marginRight: 6 }} /> Document uploaded. Pending verification.
        </div>
      )}
      
      {isVerified && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#065f46', marginTop: 12 }}>
          <CheckCircleOutlined style={{ marginRight: 6 }} /> Document verified and approved.
        </div>
      )}
      
      {isRejected && existing?.rejectionReason && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#dc2626', marginTop: 12 }}>
          <strong>Rejected:</strong> {existing.rejectionReason}
        </div>
      )}
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const DetailedViewCases = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const [caseData, setCaseData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [bankForms, setBankForms] = useState([]);
  const [bankFormsLoading, setBankFormsLoading] = useState(false);
  const [bankProductInfo, setBankProductInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const roleCode = user?.role?.code;
    if (roleCode === '18') setUserRole('admin');
    else if (roleCode === '26') setUserRole('advisor');
    else if (roleCode === '23') setUserRole('ops');
    else setUserRole('user');
  }, [user]);

  const fetchData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true); else setLoading(true);
      const res = await apiService.get(`/vault/cases/${caseId}`);
      if (res?.success) {
        setCaseData(res.data.case);
        setDocuments(res.data.documents || []);
      } else {
        message.error('Failed to load case details');
      }
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || 'Failed to load case details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchBankForms = async (bankProductId) => {
    if (!bankProductId) return;
    try {
      setBankFormsLoading(true);
      const res = await apiService.get(`/bank/products/bank-forms/bank-product/${bankProductId}`);
      if (res?.success) {
        setBankProductInfo(res.data.bankProduct || null);
        const formsWithMetadata = (res.data.allForms || []).map(form => {
          const docDetails = getDocumentDetails(form.formName, form.documentType);
          const existingReqDoc = caseData?.documentStatus?.requiredDocuments?.find(d => d.bankFormId?.toString() === form._id);
          return {
            ...form,
            ...docDetails,
            icon: docDetails?.icon,
            category: docDetails?.category || getDocumentCategoryFromList(form.formName, form.documentType),
            bankFormHandling: existingReqDoc?.bankFormHandling || {
              handledByAdvisor: form.documentSource === 'Customer',
              assignedToOps: form.documentSource === 'Bank',
              advisorMarkedAt: null
            }
          };
        });
        setBankForms(formsWithMetadata);
      } else {
        message.error('Failed to load bank forms');
      }
    } catch (err) {
      console.error(err);
      message.error('Failed to load bank forms');
    } finally {
      setBankFormsLoading(false);
    }
  };

  useEffect(() => { if (caseId) fetchData(); }, [caseId]);

  useEffect(() => {
    if (caseData?.loanInfo?.selectedBankProduct) {
      fetchBankForms(caseData.loanInfo.selectedBankProduct);
    }
  }, [caseData?.loanInfo?.selectedBankProduct]);

  const groupedDocuments = bankForms.reduce((acc, form) => {
    const cat = form.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(form);
    return acc;
  }, {});

  const categoryOrder = { Identity: 1, Employment: 2, Financial: 3, Property: 4, Insurance: 5, 'Bank Forms': 6, Other: 7 };

  const uploadedCount = documents.length;
  const verifiedCount = documents.filter(d => d.verificationStatus === 'verified').length;
  const totalRequired = bankForms.length;
  const pct = totalRequired > 0 ? Math.round((uploadedCount / totalRequired) * 100) : 0;

  const statusSteps = ['Draft', 'Submitted to Xoto', 'Bank Application', 'Collecting Documentation', 'Pre-Approved', 'Valuation', 'FOL Processed', 'FOL Issued', 'FOL Signed', 'Disbursed'];
  const currentStepIndex = Math.max(0, statusSteps.indexOf(caseData?.currentStatus));

  const getStatusColor = (s) => ({
    Draft: 'default', 'Submitted to Xoto': 'processing', 'Bank Application': 'processing',
    'Collecting Documentation': 'warning', 'Pre-Approved': 'success', Valuation: 'processing',
    'FOL Processed': 'success', 'FOL Issued': 'success', 'FOL Signed': 'success',
    Disbursed: 'success', Rejected: 'error', Lost: 'default',
  }[s] || 'default');

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spin size="large" />
    </div>
  );

  if (!caseData) return (
    <div style={{ padding: 48, textAlign: 'center' }}>
      <Title level={4}>Case not found</Title>
      <Button onClick={() => navigate(-1)}>Back to Cases</Button>
    </div>
  );

  const ci = caseData.clientInfo || {};

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '32px 20px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        <button onClick={() => navigate(-1)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', marginBottom: 28 }}>
          <ArrowLeftOutlined /> Back to Cases
        </button>

        <div style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #7c3aed 100%)`, borderRadius: 16, padding: '28px 32px', color: '#fff', marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.7, textTransform: 'uppercase', marginBottom: 6 }}>Case Details</div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#fff' }}>{caseData.caseReference}</h1>
            <div style={{ marginTop: 6, fontSize: 13, opacity: 0.7 }}>{ci.fullName} • Created {dayjs(caseData.createdAt).format('DD MMM YYYY')}</div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {bankProductInfo && (
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                {bankProductInfo.logo && <img src={bankProductInfo.logo} alt={bankProductInfo.name} style={{ height: 24, objectFit: 'contain', borderRadius: 4 }} />}
                <span style={{ fontSize: 13, fontWeight: 600 }}>{bankProductInfo.name} — {bankProductInfo.productTitle}</span>
              </div>
            )}
            <Tag color={getStatusColor(caseData.currentStatus)} style={{ fontSize: 14, padding: '4px 16px' }}>{caseData.currentStatus}</Tag>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid #e5e7eb', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Document Progress</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: PRIMARY }}>{uploadedCount} / {totalRequired}</span>
            </div>
            <Progress percent={pct} strokeColor={PRIMARY} trailColor="#e5e7eb" strokeWidth={10} showInfo={false} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: pct === 100 ? '#10b981' : PRIMARY }}>{pct}%</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>complete</div>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <div><div style={{ fontSize: 20, fontWeight: 700, color: PRIMARY }}>{uploadedCount}</div><div style={{ fontSize: 11, color: '#6b7280' }}>Uploaded</div></div>
            <div><div style={{ fontSize: 20, fontWeight: 700, color: '#10b981' }}>{verifiedCount}</div><div style={{ fontSize: 11, color: '#6b7280' }}>Verified</div></div>
            <div><div style={{ fontSize: 20, fontWeight: 700, color: '#f59e0b' }}>{totalRequired - uploadedCount}</div><div style={{ fontSize: 11, color: '#6b7280' }}>Pending</div></div>
          </div>
          <button onClick={() => fetchData(true)} disabled={refreshing} style={{ padding: '10px 18px', background: refreshing ? '#f3f4f6' : '#fff', border: '1px solid #d1d5db', borderRadius: 8, cursor: 'pointer' }}>
            {refreshing ? <Spin size="small" /> : <ReloadOutlined />} Refresh
          </button>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          
          <TabPane tab="Overview" key="overview">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card><Steps current={currentStepIndex} items={statusSteps.map(s => ({ title: s }))} responsive /></Card>
              <Row gutter={24}>
                <Col xs={24} lg={12}>
                  <Card title={<span><UserOutlined style={{ color: PRIMARY }} /> Client Information</span>}>
                    <Descriptions bordered size="small" column={1}>
                      <Descriptions.Item label="Full Name"><Text strong>{ci.fullName}</Text></Descriptions.Item>
                      <Descriptions.Item label="Email">{ci.email}</Descriptions.Item>
                      <Descriptions.Item label="Mobile">{ci.mobile}</Descriptions.Item>
                      <Descriptions.Item label="Nationality">{ci.nationality}</Descriptions.Item>
                      <Descriptions.Item label="Marital Status">{ci.maritalStatus}</Descriptions.Item>
                      <Descriptions.Item label="Date of Birth">{dayjs(ci.dateOfBirth).format('DD/MM/YYYY')}</Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title={<span><HomeOutlined style={{ color: PRIMARY }} /> Property Information</span>}>
                    <Descriptions bordered size="small" column={1}>
                      <Descriptions.Item label="Type">{caseData.propertyInfo?.propertyType} – {caseData.propertyInfo?.propertySubtype}</Descriptions.Item>
                      <Descriptions.Item label="Value">AED {caseData.propertyInfo?.propertyValue?.toLocaleString()}</Descriptions.Item>
                      <Descriptions.Item label="Loan Amount">AED {caseData.propertyInfo?.loanAmount?.toLocaleString()}</Descriptions.Item>
                      <Descriptions.Item label="Down Payment">AED {caseData.propertyInfo?.downPayment?.toLocaleString()}</Descriptions.Item>
                      <Descriptions.Item label="LTV">{caseData.propertyInfo?.ltvPercentage?.toFixed(1)}%</Descriptions.Item>
                      <Descriptions.Item label="Address">{caseData.propertyInfo?.propertyAddress?.building}, {caseData.propertyInfo?.propertyAddress?.area}</Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
              </Row>
            </Space>
          </TabPane>

          <TabPane tab={`Documents (${uploadedCount}/${totalRequired})`} key="documents">
            <Alert message="Document Requirements" description={`Please upload all required documents. Verified documents will be marked with a green check.`} type="info" showIcon style={{ marginBottom: 24, borderRadius: 12 }} />
            
            {Object.entries(groupedDocuments)
              .sort(([a], [b]) => (categoryOrder[a] || 99) - (categoryOrder[b] || 99))
              .map(([category, docs]) => {
                const uploadedInCat = docs.filter(d => documents.some(doc => doc.bankFormId === d._id || doc.documentType === d.documentType)).length;
                return (
                  <div key={category} style={{ marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: PRIMARY, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                        {category === 'Identity' && <UserOutlined />}
                        {category === 'Employment' && <SolutionOutlined />}
                        {category === 'Financial' && <BankOutlined />}
                        {category === 'Property' && <HomeOutlined />}
                        {category === 'Bank Forms' && <FileTextOutlined />}
                        {!['Identity', 'Employment', 'Financial', 'Property', 'Bank Forms'].includes(category) && <FileOutlined />}
                      </div>
                      <div><div style={{ fontWeight: 700, fontSize: 16 }}>{category} Documents</div><div style={{ fontSize: 12, color: '#6b7280' }}>{uploadedInCat} / {docs.length} uploaded</div></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 16 }}>
                      {docs.map(doc => (
                        <DynamicDocUploadCard 
                          key={doc._id} 
                          document={doc} 
                          caseId={caseId} 
                          uploadedDocs={documents} 
                          onUploadSuccess={() => fetchData(true)}
                          userRole={userRole}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            
            {bankForms.length === 0 && !bankFormsLoading && <Empty description="No document requirements found for this bank product" />}
            {bankFormsLoading && <div style={{ textAlign: 'center', padding: 40 }}><Spin /> Loading documents...</div>}
          </TabPane>

          <TabPane tab="Uploaded Files" key="files">
            <Card>
              {documents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60 }}><FileTextOutlined style={{ fontSize: 48, color: '#ccc' }} /><br /><Text type="secondary">No documents uploaded yet</Text></div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
                  {documents.map((doc, idx) => {
                    const docDetails = getDocumentDetails(doc.bankFormName, doc.documentType);
                    const label = doc.bankFormName || docDetails?.formName || doc.documentType?.replace(/_/g, ' ').toUpperCase() || 'Document';
                    const isVerified = doc.verificationStatus === 'verified';
                    const isRejected = doc.verificationStatus === 'rejected';
                    return (
                      <div key={idx} style={{ background: '#fff', border: `1px solid ${isVerified ? '#10b981' : isRejected ? '#ef4444' : '#e5e7eb'}`, borderRadius: 14, padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                          <div style={{ width: 44, height: 44, borderRadius: 10, background: isVerified ? '#ecfdf5' : isRejected ? '#fef2f2' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                            {isPdf(doc.fileName) ? <FilePdfOutlined /> : <FileImageOutlined />}
                          </div>
                          <div><div style={{ fontWeight: 600 }}>{label}</div><div style={{ fontSize: 12, color: '#6b7280' }}>{doc.fileName}</div></div>
                          <Tag color={isVerified ? 'success' : isRejected ? 'error' : 'warning'} style={{ marginLeft: 'auto' }}>
                            {isVerified ? 'Verified' : isRejected ? 'Rejected' : 'Pending'}
                          </Tag>
                        </div>
                        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>Uploaded: {dayjs(doc.uploadedAt).format('DD MMM YYYY, hh:mm A')} • {fmtSize(doc.fileSizeMb)}</div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <ViewButton doc={doc} />
                          {doc.fileUrl && <button onClick={() => window.open(doc.fileUrl, '_blank')} style={btnStyle('#f3f4f6', '#374151', '#e5e7eb')}><DownloadOutlined /> Download</button>}
                        </div>
                        {isRejected && doc.rejectionReason && <div style={{ marginTop: 12, fontSize: 11, color: '#dc2626', background: '#fef2f2', padding: 8, borderRadius: 6 }}>Rejected: {doc.rejectionReason}</div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </TabPane>

        </Tabs>
      </div>
    </div>
  );
};

export default DetailedViewCases;