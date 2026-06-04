import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiService } from '../../../../manageApi/utils/custom.apiservice';
import {
  Card, Button, Typography, Row, Col, Avatar, 
  Tag, Divider, Spin, message, Badge, 
  Pagination, Space, Modal, Tooltip, Alert, Progress
} from 'antd';
import {
  UserOutlined, BankOutlined, FileTextOutlined, 
  CalendarOutlined, HomeOutlined, 
  DollarCircleOutlined, CheckCircleOutlined,
  CloseCircleOutlined, RocketOutlined,
  SendOutlined, TrophyOutlined, TeamOutlined, InfoCircleOutlined,
  FilePdfOutlined, DownloadOutlined, CloudUploadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const THEME_COLOR = "#5C039B";
const SUCCESS_COLOR = "#10b981";

// Role slug mapping for navigation
const roleSlugMap = {
  '0': 'superadmin',
  '1': 'admin',
  '2': "customer",
  '5': 'vendor-b2c',
  '6': 'vendor-b2b',
  '7': 'freelancer',
  '11': 'accountant',
  '12': 'supervisor',
  '15': "agency",
  '16': "agent",
  '17': "developer",
  '18': "vault-admin",
  '22': "vaultagent",
  '21': "vaultpartner",
  '24': "GridAdvisor",
  '25': "gridreferralpartner",
  '26': "vault-advisor",
};

const ViewCases = () => {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const roleSlug = roleSlugMap[user?.role?.code] ?? "superadmin";

  // --- STATE ---
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Submit Modal State
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [selectedCaseForSubmit, setSelectedCaseForSubmit] = useState(null);
  const [submitSuccessModal, setSubmitSuccessModal] = useState(false);
  const [submittedCaseName, setSubmittedCaseName] = useState('');
  const [celebration, setCelebration] = useState(false);

  // Helper function to check if case is ready for submission
  // Only direct_upload documents are required for submission (downloadable bank forms can be skipped)
  const isCaseReadyForSubmission = (caseItem) => {
    const requiredDocs = caseItem.documentStatus?.requiredDocuments || [];
    
    // Filter documents that require direct upload (non-downloadable)
    // These are the mandatory ones for submission
    const requiredDirectUploadDocs = requiredDocs.filter(doc => 
      doc.actionType === 'direct_upload' && doc.isRequired === true
    );
    
    if (requiredDirectUploadDocs.length === 0) {
      return true; // No direct upload docs required
    }
    
    // Check if all direct upload documents are uploaded
    const allDirectUploadsComplete = requiredDirectUploadDocs.every(doc => 
      doc.isUploaded === true
    );
    
    return allDirectUploadsComplete;
  };

  // Get progress for different document types
  const getDocumentProgress = (caseItem) => {
    const requiredDocs = caseItem.documentStatus?.requiredDocuments || [];
    
    // Direct upload documents (MUST be uploaded for submission)
    const directUploadDocs = requiredDocs.filter(doc => 
      doc.actionType === 'direct_upload' && doc.isRequired === true
    );
    
    // Downloadable bank forms (CAN SKIP for submission)
    const downloadableDocs = requiredDocs.filter(doc => 
      doc.actionType === 'download_fill_upload'
    );
    
    const directUploaded = directUploadDocs.filter(doc => doc.isUploaded === true).length;
    const directTotal = directUploadDocs.length;
    
    const downloadableUploaded = downloadableDocs.filter(doc => doc.isUploaded === true).length;
    const downloadableTotal = downloadableDocs.length;
    
    return {
      required: {
        uploaded: directUploaded,
        total: directTotal,
        percentage: directTotal > 0 ? Math.round((directUploaded / directTotal) * 100) : 100,
        label: 'Required Documents'
      },
      optional: {
        uploaded: downloadableUploaded,
        total: downloadableTotal,
        percentage: downloadableTotal > 0 ? Math.round((downloadableUploaded / downloadableTotal) * 100) : 100,
        label: 'Bank Forms (Optional)'
      }
    };
  };

  // --- API CALLS ---
  const fetchCases = useCallback(async (page) => {
    setLoading(true);
    try {
      // Fetch Draft cases with full document status
      const res = await apiService.get(`/vault/cases?page=${page}&limit=10&status=Draft`);
      if (res?.success) {
        setCases(res.data || []);
        setTotalItems(res.pagination?.total || 0);
      }
    } catch (err) {
      message.error("Failed to load cases");
    } finally {
      setLoading(false);
    }
  }, []);

  // Submit case to Xoto
  const submitCaseToXoto = async () => {
    if (!selectedCaseForSubmit) return;
    
    setSubmitting(true);
    try {
      const response = await apiService.post(`/vault/cases/${selectedCaseForSubmit._id}/submit`);
      
      if (response?.success) {
        setCelebration(true);
        setTimeout(() => setCelebration(false), 3000);
        
        setSubmittedCaseName(selectedCaseForSubmit.clientInfo?.fullName || selectedCaseForSubmit.caseReference);
        setSubmitModalVisible(false);
        setSubmitSuccessModal(true);
        
        fetchCases(currentPage);
        
        message.success({
          content: "Case submitted to Xoto team successfully!",
          duration: 3,
          icon: <CheckCircleOutlined />
        });
      } else {
        message.error(response?.message || "Failed to submit case");
      }
    } catch (err) {
      console.error("Submit error:", err);
      message.error(err.response?.data?.message || "Error submitting case");
    } finally {
      setSubmitting(false);
      setSelectedCaseForSubmit(null);
    }
  };

  // --- LIFECYCLE ---
  useEffect(() => {
    fetchCases(currentPage);
  }, [currentPage, fetchCases]);

  // --- HANDLERS ---
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const navigateToCaseDetail = (caseItem) => {
    navigate(`/dashboard/${roleSlug}/case/view/${caseItem._id}`);
  };

  const openSubmitModal = (caseItem, e) => {
    e.stopPropagation();
    setSelectedCaseForSubmit(caseItem);
    setSubmitModalVisible(true);
  };

  // --- STATUS COLOR MAP ---
  const getStatusColor = (status) => {
    const colorMap = {
      'Draft': 'default',
      'Submitted to Xoto': 'processing',
      'Bank Application': 'processing',
      'Collecting Documentation': 'warning',
      'Pre-Approved': 'success',
      'Valuation': 'processing',
      'FOL Processed': 'success',
      'FOL Issued': 'success',
      'FOL Signed': 'success',
      'Disbursed': 'success',
      'Rejected': 'error',
      'Lost': 'default'
    };
    return colorMap[status] || 'default';
  };

  // Render Case Card
  const renderCaseCard = (caseItem) => {
    const clientName = caseItem.clientInfo?.fullName || 'Unknown Client';
    const propertyValue = caseItem.propertyInfo?.propertyValue || 0;
    const loanAmount = caseItem.propertyInfo?.loanAmount || caseItem.loanInfo?.requestedAmount || 0;
    const bankName = caseItem.loanInfo?.selectedBank || 'Not Selected';
    const createdBy = caseItem.createdBy?.role === 'admin' ? 'Admin' : caseItem.createdBy?.partnerName || caseItem.createdBy?.advisorName || 'Advisor';
    
    // Get document progress
    const progress = getDocumentProgress(caseItem);
    const isReady = isCaseReadyForSubmission(caseItem);
    
    return (
      <Card 
        hoverable
        style={{ 
          borderRadius: 16, 
          border: '1px solid #e8e8e8',
          borderTop: `4px solid ${THEME_COLOR}`,
          overflow: 'hidden',
          position: 'relative',
          height: '100%',
          cursor: 'pointer'
        }}
        bodyStyle={{ padding: 0 }}
        onClick={() => navigateToCaseDetail(caseItem)}
      >
        <div style={{ padding: 20 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: THEME_COLOR }} size="large" />
              <div>
                <Text strong style={{ fontSize: 16, display: 'block' }}>{clientName}</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>Case: {caseItem.caseReference}</Text>
              </div>
            </div>
            <Badge 
              status={getStatusColor(caseItem.currentStatus)} 
              text={<span style={{ fontSize: 11 }}>Draft</span>} 
            />
          </div>

          {/* Key Metrics */}
          <Row gutter={12} style={{ background: '#f9f9f9', padding: '12px', borderRadius: 8, marginBottom: 16 }}>
            <Col span={12}>
              <Text type="secondary" style={{ fontSize: 11 }}>Property Value</Text>
              <div style={{ fontWeight: 'bold', color: '#1e1b4b' }}>
                AED {propertyValue.toLocaleString()}
              </div>
            </Col>
            <Col span={12}>
              <Text type="secondary" style={{ fontSize: 11 }}>Loan Amount</Text>
              <div style={{ fontWeight: 'bold', color: THEME_COLOR }}>
                AED {loanAmount.toLocaleString()}
              </div>
            </Col>
          </Row>

          {/* Bank Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <BankOutlined style={{ color: THEME_COLOR }} />
            <Text strong style={{ fontSize: 13 }}>{bankName}</Text>
            {caseItem.loanInfo?.interestRatePercentage && (
              <Tag color="purple" style={{ marginLeft: 'auto' }}>
                {caseItem.loanInfo.interestRatePercentage}%
              </Tag>
            )}
          </div>

          {/* Required Documents Progress Section */}
          {progress.required.total > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  <CloudUploadOutlined /> {progress.required.label}
                </Text>
                <Text style={{ fontSize: 11, fontWeight: 600, color: progress.required.percentage === 100 ? SUCCESS_COLOR : THEME_COLOR }}>
                  {progress.required.uploaded}/{progress.required.total} uploaded
                </Text>
              </div>
              <Progress 
                percent={progress.required.percentage} 
                size="small" 
                strokeColor={progress.required.percentage === 100 ? SUCCESS_COLOR : THEME_COLOR}
                showInfo={false}
              />
              {progress.required.percentage < 100 && (
                <Text type="secondary" style={{ fontSize: 10, display: 'block', marginTop: 4, color: '#f59e0b' }}>
                  ⚠️ {progress.required.total - progress.required.uploaded} required document(s) pending
                </Text>
              )}
              {progress.required.percentage === 100 && (
                <Text style={{ fontSize: 10, color: SUCCESS_COLOR, display: 'block', marginTop: 4 }}>
                  ✓ All required documents uploaded
                </Text>
              )}
            </div>
          )}

          {/* Optional Bank Forms Progress Section */}
          {progress.optional.total > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  <FilePdfOutlined /> {progress.optional.label}
                </Text>
                <Text style={{ fontSize: 11, color: '#888' }}>
                  {progress.optional.uploaded}/{progress.optional.total} completed
                </Text>
              </div>
              <Progress 
                percent={progress.optional.percentage} 
                size="small" 
                strokeColor="#cbd5e1"
                showInfo={false}
              />
              <Text type="secondary" style={{ fontSize: 10, display: 'block', marginTop: 4 }}>
                ℹ️ Optional - Can be submitted later
              </Text>
            </div>
          )}

          {/* Metadata */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: '#888', marginBottom: 16 }}>
            <span><CalendarOutlined /> {dayjs(caseItem.createdAt).format('MMM DD, YYYY')}</span>
            <span><UserOutlined /> {createdBy}</span>
          </div>

          {/* Submit Button - Enabled when all required documents are uploaded */}
          <Tooltip title={isReady ? "Submit case to Xoto team for processing" : `Please upload all required documents (${progress.required.total - progress.required.uploaded} remaining) before submitting`}>
            <Button 
              type="primary"
              block
              icon={<SendOutlined />}
              onClick={(e) => openSubmitModal(caseItem, e)}
              disabled={!isReady}
              style={{ 
                background: isReady ? SUCCESS_COLOR : '#d1d5db',
                borderColor: isReady ? SUCCESS_COLOR : '#d1d5db',
                borderRadius: 8,
                marginTop: 8,
                cursor: isReady ? 'pointer' : 'not-allowed'
              }}
            >
              {isReady ? 'Submit to Xoto' : `${progress.required.total - progress.required.uploaded} Required Document(s) Pending`}
            </Button>
          </Tooltip>
        </div>
      </Card>
    );
  };

  // Submit Confirmation Modal
  const renderSubmitModal = () => {
    const progress = selectedCaseForSubmit ? getDocumentProgress(selectedCaseForSubmit) : { required: { uploaded: 0, total: 0 } };
    
    return (
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <SendOutlined style={{ color: THEME_COLOR, fontSize: 24 }} />
            <span style={{ fontSize: 18, fontWeight: 600 }}>Submit Case to Xoto</span>
          </div>
        }
        open={submitModalVisible}
        onCancel={() => { setSubmitModalVisible(false); setSelectedCaseForSubmit(null); }}
        footer={[
          <Button key="cancel" onClick={() => { setSubmitModalVisible(false); setSelectedCaseForSubmit(null); }} style={{ borderRadius: 8 }}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={submitCaseToXoto}
            loading={submitting}
            style={{ background: SUCCESS_COLOR, borderColor: SUCCESS_COLOR, borderRadius: 8 }}
            icon={<RocketOutlined />}
          >
            Yes, Submit Case
          </Button>
        ]}
        width={550}
        centered
      >
        {selectedCaseForSubmit && (
          <div style={{ padding: '8px 0' }}>
            <Alert
              message="Confirm Submission"
              description={`Are you sure you want to submit "${selectedCaseForSubmit.clientInfo?.fullName || selectedCaseForSubmit.caseReference}" to the Xoto team for further processing?`}
              type="warning"
              showIcon
              style={{ borderRadius: 12, marginBottom: 20 }}
            />
            
            <div style={{ background: '#f8f5ff', padding: 16, borderRadius: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text strong>Case Reference:</Text>
                <Text>{selectedCaseForSubmit.caseReference}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text strong>Client Name:</Text>
                <Text>{selectedCaseForSubmit.clientInfo?.fullName}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text strong>Loan Amount:</Text>
                <Text strong style={{ color: THEME_COLOR }}>AED {selectedCaseForSubmit.propertyInfo?.loanAmount?.toLocaleString()}</Text>
              </div>
            </div>
            
            {/* Show document summary in modal */}
            <div style={{ background: '#f0fdf4', padding: 12, borderRadius: 12, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <CheckCircleOutlined style={{ color: SUCCESS_COLOR }} />
                <Text strong>Required Documents Status</Text>
              </div>
              <Text style={{ fontSize: 13 }}>
                ✓ {progress.required.uploaded}/{progress.required.total} required documents uploaded
              </Text>
            </div>
            
            {progress.optional.total > 0 && (
              <div style={{ background: '#fefce8', padding: 12, borderRadius: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <InfoCircleOutlined style={{ color: '#eab308' }} />
                  <Text strong>Bank Forms (Optional)</Text>
                </div>
                <Text style={{ fontSize: 13 }}>
                  {progress.optional.uploaded}/{progress.optional.total} uploaded
                </Text>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 4 }}>
                  These can be submitted later after case is accepted
                </Text>
              </div>
            )}
            
            <Text type="secondary" style={{ fontSize: 12 }}>
              <InfoCircleOutlined /> Once submitted, the Xoto team will review your case and contact you for further processing.
            </Text>
          </div>
        )}
      </Modal>
    );
  };

  // Success Modal
  const renderSuccessModal = () => (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <TrophyOutlined style={{ color: SUCCESS_COLOR, fontSize: 28 }} />
          <span style={{ fontSize: 20, fontWeight: 700, color: SUCCESS_COLOR }}>Congratulations!</span>
        </div>
      }
      open={submitSuccessModal}
      onCancel={() => setSubmitSuccessModal(false)}
      footer={[
        <Button 
          key="ok" 
          type="primary" 
          onClick={() => setSubmitSuccessModal(false)}
          style={{ background: SUCCESS_COLOR, borderColor: SUCCESS_COLOR, borderRadius: 8 }}
        >
          Great! Thanks
        </Button>
      ]}
      width={550}
      centered
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        {celebration && (
          <div className="celebration-animation">
            <div className="star star1">⭐</div>
            <div className="star star2">🎉</div>
            <div className="star star3">✨</div>
            <div className="star star4">🌟</div>
            <div className="star star5">🎊</div>
          </div>
        )}
        
        <div style={{ 
          width: 80, 
          height: 80, 
          borderRadius: 40, 
          background: '#ecfdf5', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <CheckCircleOutlined style={{ fontSize: 48, color: SUCCESS_COLOR }} />
        </div>
        
        <Title level={4} style={{ color: '#1e1b4b', marginBottom: 12 }}>
          Case Successfully Submitted! 🎉
        </Title>
        
        <Text style={{ fontSize: 16, display: 'block', marginBottom: 8 }}>
          Your case <strong>{submittedCaseName}</strong> has been submitted to the Xoto team.
        </Text>
        
        <div style={{ background: '#f8f5ff', padding: 16, borderRadius: 12, margin: '20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
            <TeamOutlined style={{ fontSize: 24, color: THEME_COLOR }} />
            <div>
              <Text strong>What happens next?</Text>
              <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                Our team will review your case and contact you within 24-48 hours with updates.
              </div>
            </div>
          </div>
        </div>
        
        <Text type="secondary" style={{ fontSize: 12 }}>
          You can track the status of your case in the "Submitted to Xoto" section.
        </Text>
      </div>
      
      <style>{`
        .celebration-animation {
          position: relative;
          height: 100px;
          margin-bottom: 20px;
        }
        .star {
          position: absolute;
          font-size: 24px;
          animation: float 1s ease-out forwards;
        }
        .star1 { top: 0; left: 10%; animation-delay: 0s; }
        .star2 { top: 20%; left: 30%; animation-delay: 0.2s; }
        .star3 { top: 10%; left: 50%; animation-delay: 0.4s; }
        .star4 { top: 30%; left: 70%; animation-delay: 0.1s; }
        .star5 { top: 5%; left: 85%; animation-delay: 0.3s; }
        
        @keyframes float {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          20% {
            transform: translateY(-20px) scale(1);
            opacity: 1;
          }
          80% {
            transform: translateY(-60px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </Modal>
  );

  // Main Render
  return (
    <div style={{ padding: '24px', background: '#fdfbff', minHeight: '100vh' }}>
      
      {/* Header Area */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ color: '#1e1b4b', margin: 0, fontWeight: 800 }}>Draft Cases</Title>
        <Text type="secondary">Review and submit draft cases to the Xoto team for processing.</Text>
        <div style={{ 
          marginTop: 12, 
          padding: '12px 16px', 
          background: '#f0f9ff', 
          borderRadius: 8,
          borderLeft: `4px solid ${THEME_COLOR}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Tag color="green" icon={<CheckCircleOutlined />}>Required Documents</Tag>
            <Text style={{ fontSize: 12 }}>Must be uploaded before submission</Text>
            <Tag color="default" icon={<FilePdfOutlined />}>Bank Forms (Optional)</Tag>
            <Text style={{ fontSize: 12 }}>Can be submitted later after case acceptance</Text>
          </div>
        </div>
      </div>

      {/* Cases Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}><Spin size="large" /></div>
      ) : (
        <>
          <Row gutter={[24, 24]}>
            {cases.map(caseItem => (
              <Col xs={24} md={12} lg={8} key={caseItem._id}>
                {renderCaseCard(caseItem)}
              </Col>
            ))}
          </Row>

          {cases.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
              <FileTextOutlined style={{ fontSize: 48, color: '#ccc', marginBottom: 16 }} />
              <br/>
              <Text type="secondary">No draft cases found</Text>
              <div style={{ marginTop: 16 }}>
                <Button type="link" onClick={() => navigate(`/dashboard/${roleSlug}/vault/cases/create`)}>
                  Create a new case from a proposal or qualified lead
                </Button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalItems > 0 && (
            <div style={{ marginTop: 40, display: 'flex', justifyContent: 'flex-end' }}>
              <Pagination 
                current={currentPage} 
                total={totalItems} 
                pageSize={10} 
                onChange={handlePageChange} 
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {renderSubmitModal()}
      {renderSuccessModal()}
    </div>
  );
};

export default ViewCases;