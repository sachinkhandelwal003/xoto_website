// ╔══════════════════════════════════════════════════════════════╗
// ║  CreateCase.jsx — Unified Case & Proposal Creation           ║
// ║  Flow 1: Accepted Proposal → Create Case                     ║
// ║  Flow 2: Qualified Lead → Direct Case (bank/offer picker)    ║
// ║  Flow 3: Qualified Lead → Create Proposal (full flow)        ║
// ╚══════════════════════════════════════════════════════════════╝

import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../../../manageApi/utils/custom.apiservice';
import { useSelector } from 'react-redux';
import {
  Card, Steps, Button, Typography, Row, Col, Avatar,
  Tag, Divider, Spin, message, Modal, Input, Select,
  Form, DatePicker, InputNumber, Alert, Badge, Progress,
  Statistic, Table, Space, Empty,
} from 'antd';
import dayjs from 'dayjs';
import {
  UserOutlined, FileTextOutlined, BankOutlined,
  CheckCircleOutlined, EyeOutlined, CalculatorOutlined,
  RocketOutlined, ArrowRightOutlined, StarFilled,
  TrophyOutlined, DollarOutlined, SafetyOutlined,
  PlusOutlined, SaveOutlined, DeleteOutlined, EditOutlined,
  ArrowLeftOutlined, SendOutlined, LineChartOutlined,
  FileDoneOutlined, ThunderboltOutlined, FileAddOutlined,
  ClockCircleOutlined, CheckSquareOutlined, ExclamationCircleOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// ─── Theme ────────────────────────────────────────────────────────
const P   = '#5C039B';   // Purple primary
const PL  = '#f5f0ff';   // Purple light bg
const PM  = '#7c3aed';   // Purple mid
const G   = '#059669';   // Green
const GD  = '#d97706';   // Gold

// ─── Helpers ─────────────────────────────────────────────────────
const aedFmt = v => (!v ? '' : `AED ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
const aedPrs = v => (!v ? 0 : parseFloat(v.replace(/AED\s?|,/g, '')) || 0);
const genRef  = () => `XOTO-CASE-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
const calcEMI = (p, r, y) => {
  if (!p || !r || p <= 0 || r <= 0) return 0;
  const mr = r / 100 / 12, m = y * 12;
  return mr === 0 ? Math.round(p / m) : Math.round((p * mr * Math.pow(1 + mr, m)) / (Math.pow(1 + mr, m) - 1));
};
const fmtDate = d => (!d ? null : d.$d ? d.$d : d.toDate ? d.toDate() : d);

// ─── Flow constants ───────────────────────────────────────────────
const F_PC = 'proposal_case';
const F_DC = 'direct_case';
const F_CP = 'create_proposal';

// ─── Initial case state factory ───────────────────────────────────
const mkCase = () => ({
  caseReference: genRef(),
  clientInfo: {
    fullName: '', preferredName: '', gender: 'Male', dateOfBirth: null,
    nationality: '', maritalStatus: 'Single', numberOfDependents: 0,
    email: '', mobile: '', homePhone: null, workPhone: null, whatsapp: null,
  },
  employmentDetails: {
    employerName: '', industry: null, designation: '', employmentType: 'Salaried',
    yearsWithEmployer: null, monthsWithEmployer: 0, probationPeriod: 'Completed',
    workAddress: null, workPhone: null, employerEmail: null,
  },
  incomeDetails: {
    basicSalary: 0, housingAllowance: 0, transportAllowance: 0, otherAllowances: 0,
    totalMonthlySalary: 0, annualBonus: 0, otherIncome: 0, totalMonthlyIncome: 0,
    salaryTransferBank: null, salaryTransferType: null,
  },
  expenseDetails: {
    monthlyRent: 0, monthlyOtherLoanInstallments: 0, monthlyCreditCardPayments: 0,
    monthlyLivingExpenses: 0, totalMonthlyLiabilities: 0,
    dbrPercentage: 0, dbrStatus: 'Eligible', existingLoans: [],
  },
  propertyInfo: {
    propertyType: 'Ready', propertySubtype: 'Apartment', propertyValue: 0,
    valuationAmount: null, ltvPercentage: null, loanAmount: 0, downPayment: 0,
    downPaymentSource: null,
    propertyAddress: { building: '', apartment: null, floor: null, area: '', city: 'Dubai', emirate: 'Dubai' },
    propertyDetails: { bedrooms: null, bathrooms: null, areaSqft: null, areaSqm: null, yearBuilt: null, view: null, furnishing: null, parkingSpaces: 0 },
    ownershipDetails: { currentOwner: '', ownerType: 'Individual', titleDeedNumber: null, titleDeedUrl: null, nocAvailable: false },
    transactionDetails: { purchasePrice: 0, agreementDate: dayjs(), handoverDate: null, depositPaid: 0, depositPaidDate: null, agentCommission: 0, dldFees: 0, registrationFees: 0, totalClosingCosts: 0 },
  },
  loanInfo: {
    requestedAmount: 0, approvedAmount: null, tenureYears: 25, interestRateType: 'Fixed',
    interestRatePercentage: 0, processingFee: 0, valuationFee: 2500,
    earlySettlementFeePercentage: 1, earlySettlementAllowedAfterYears: 3,
    lifeInsuranceRequired: true, propertyInsuranceRequired: true,
    monthlyInstallment: { principalAndInterest: 0, lifeInsurance: 0, propertyInsurance: 0, totalMonthlyPayment: 0 },
    selectedBank: '', selectedBankProduct: '',
  },
  internalNotes: '',
  customerNotes: '',
});

// ╔══════════════════════════════════════════════════════════════╗
// ║  OfferCard — renders a calculated bank offer                 ║
// ╚══════════════════════════════════════════════════════════════╝
const OfferCard = ({ offer, index, selectable = false, isSelected = false, onSelect }) => {
  const best = index === 0;
  return (
    <div style={{
      background: '#fff',
      border: `2px solid ${isSelected ? P : best ? GD : '#e5e7eb'}`,
      borderRadius: 20,
      padding: '24px 20px',
      position: 'relative',
      boxShadow: best ? `0 8px 32px rgba(217,119,6,.15)` : `0 2px 12px rgba(0,0,0,.06)`,
      transition: 'all .2s',
    }}>
      {best && (
        <div style={{ position: 'absolute', top: -13, left: 20, background: GD, color: '#fff', padding: '3px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
          🏆 Best Rate
        </div>
      )}
      {isSelected && (
        <div style={{ position: 'absolute', top: -13, right: 20, background: P, color: '#fff', padding: '3px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
          ✓ Selected
        </div>
      )}
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <img
          src={offer.bankLogo} alt={offer.bankName}
          style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 10, border: '1px solid #f0f0f0', padding: 4, background: '#fafafa' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
        <div style={{ flex: 1 }}>
          <Text strong style={{ fontSize: 15, display: 'block' }}>{offer.bankName}</Text>
          <Tag style={{ background: offer.interestType === 'ISLAMIC' ? '#ecfdf5' : '#eff6ff', color: offer.interestType === 'ISLAMIC' ? G : '#2563eb', border: 'none', fontSize: 11, fontWeight: 600, borderRadius: 6 }}>
            {offer.interestType}
          </Tag>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: P, lineHeight: 1 }}>{offer.interestRate}%</div>
          <Text type="secondary" style={{ fontSize: 11 }}>p.a.</Text>
        </div>
      </div>
      <Divider style={{ margin: '0 0 16px' }} />
      {/* Key Numbers */}
      <Row gutter={[8, 8]} style={{ marginBottom: 14 }}>
        {[
          [<DollarOutlined />, 'Monthly EMI', `AED ${(offer.emi || 0).toLocaleString()}`, PL, P],
          [<SafetyOutlined />, 'Loan Amount', `AED ${(((offer.loanAmount || 0) / 1000)).toFixed(0)}K`, '#f0fdf4', G],
          [<TrophyOutlined />, 'Tenure', `${offer.tenureYears || 25} Yrs`, '#fffbeb', GD],
        ].map(([icon, label, val, bg, color]) => (
          <Col span={8} key={label}>
            <div style={{ background: bg, borderRadius: 10, padding: '10px 6px', textAlign: 'center' }}>
              <div style={{ color, fontSize: 16, marginBottom: 2 }}>{icon}</div>
              <Text style={{ fontSize: 10, color: '#6b7280', display: 'block' }}>{label}</Text>
              <Text strong style={{ fontSize: 12 }}>{val}</Text>
            </div>
          </Col>
        ))}
      </Row>
      {/* LTV & DBR */}
      {[
        { label: 'LTV', val: offer.ltv?.value, max: offer.ltv?.maxAllowed, ok: offer.ltv?.eligible },
        { label: 'DBR', val: offer.dbr?.dbr, max: offer.dbr?.maxAllowed, ok: offer.dbr?.isEligible },
      ].map(({ label, val, max, ok }) => (
        <div key={label} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <Text style={{ fontSize: 11, color: '#6b7280' }}>{label}</Text>
            <div style={{ display: 'flex', gap: 6 }}>
              <Text strong style={{ fontSize: 11 }}>{val}%</Text>
              <Tag style={{ background: ok ? '#ecfdf5' : '#fef2f2', color: ok ? G : '#dc2626', border: 'none', fontSize: 10, padding: '0 5px' }}>Max {max}%</Tag>
            </div>
          </div>
          <Progress percent={val} strokeColor={ok ? G : '#dc2626'} trailColor="#f3f4f6" showInfo={false} size="small" />
        </div>
      ))}
      {/* Upfront */}
      <div style={{ background: '#f9fafb', borderRadius: 10, padding: '12px 14px', marginTop: 12 }}>
        <Text style={{ fontSize: 11, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 8 }}>Upfront Costs</Text>
        <Row gutter={[6, 4]}>
          {[['DLD Fee', offer.upfrontCosts?.dldFee], ['Registration', offer.upfrontCosts?.registrationFee], ['Valuation', offer.upfrontCosts?.valuationFee], ['Processing', offer.upfrontCosts?.processingFee]].map(([lbl, v]) => (
            <Col span={12} key={lbl}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 10, color: '#9ca3af' }}>{lbl}</Text>
                <Text style={{ fontSize: 10, fontWeight: 600 }}>{v === 0 ? <span style={{ color: G }}>FREE</span> : `AED ${(v || 0).toLocaleString()}`}</Text>
              </div>
            </Col>
          ))}
        </Row>
        <Divider style={{ margin: '8px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text strong style={{ fontSize: 12 }}>Total Upfront</Text>
          <Text strong style={{ fontSize: 12, color: P }}>AED {(offer.upfrontCosts?.total || 0).toLocaleString()}</Text>
        </div>
      </div>
      {selectable && (
        <Button
          type={isSelected ? 'default' : 'primary'}
          block
          style={{ marginTop: 14, background: isSelected ? PL : P, borderColor: P, color: isSelected ? P : '#fff', borderRadius: 8, height: 40, fontWeight: 600 }}
          onClick={() => onSelect && onSelect(offer)}
        >
          {isSelected ? '✓ Selected for Case' : 'Select This Offer'}
        </Button>
      )}
    </div>
  );
};

// ╔══════════════════════════════════════════════════════════════╗
// ║  BankSelectCard — multi-select bank product card             ║
// ╚══════════════════════════════════════════════════════════════╝
const BankSelectCard = ({ bank, isSelected, onToggle, disabled }) => (
  <div
    onClick={() => !disabled && onToggle(bank)}
    style={{
      background: '#fff', border: `2px solid ${isSelected ? P : '#e5e7eb'}`,
      borderRadius: 14, padding: 18, cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1, transition: 'all .2s',
      boxShadow: isSelected ? `0 4px 20px ${P}25` : '0 2px 8px rgba(0,0,0,.05)', position: 'relative',
    }}
  >
    {isSelected && (
      <div style={{ position: 'absolute', top: 10, right: 10, width: 26, height: 26, borderRadius: '50%', background: P, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CheckCircleOutlined style={{ color: '#fff', fontSize: 13 }} />
      </div>
    )}
    {bank.isPopular && !isSelected && (
      <div style={{ position: 'absolute', top: 10, right: 10, background: '#fef3c7', color: GD, padding: '2px 8px', borderRadius: 8, fontSize: 10, fontWeight: 600 }}>
        🔥 Popular
      </div>
    )}
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
      <img src={bank.logo} alt={bank.bankName} style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 8, border: '1px solid #f0f0f0', padding: 3 }} onError={e => { e.target.style.display = 'none'; }} />
      <div style={{ flex: 1 }}>
        <Text strong style={{ fontSize: 14 }}>{bank.bankName}</Text>
        <div style={{ display: 'flex', gap: 6, marginTop: 3 }}>
          <Tag style={{ fontSize: 10, background: PL, color: P, border: 'none', borderRadius: 5 }}>{bank.interestRate}%</Tag>
          <Tag style={{ fontSize: 10, background: '#f0fdf4', color: G, border: 'none', borderRadius: 5 }}>{bank.interestType}</Tag>
        </div>
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div><Text style={{ fontSize: 10, color: '#9ca3af', display: 'block' }}>Max LTV</Text><Text strong style={{ fontSize: 12 }}>{bank.maxLTV || 85}%</Text></div>
      <div><Text style={{ fontSize: 10, color: '#9ca3af', display: 'block' }}>Min Salary</Text><Text strong style={{ fontSize: 12 }}>AED {bank.minSalary?.toLocaleString() || 'N/A'}</Text></div>
      <div><Text style={{ fontSize: 10, color: '#9ca3af', display: 'block' }}>Tenure</Text><Text strong style={{ fontSize: 12 }}>25 Yrs</Text></div>
    </div>
  </div>
);

// ╔══════════════════════════════════════════════════════════════╗
// ║  CreateCase — Main Component                                  ║
// ╚══════════════════════════════════════════════════════════════╝
const CreateCase = () => {
  const { user } = useSelector(s => s.auth);

  // ── Core state ──────────────────────────────────────────────────
  const [flow, setFlow]     = useState(null);   // null | F_PC | F_DC | F_CP
  const [step, setStep]     = useState(0);      // number | 'success' | 'proposal_success'
  const [loading, setLoading]     = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ── Proposal Case (F_PC) ─────────────────────────────────────────
  const [acceptedProposals, setAcceptedProposals]   = useState([]);
  const [fetchingProposals, setFetchingProposals]   = useState(false);
  const [selectedProposal, setSelectedProposal]     = useState(null);
  const [selectedProposalBank, setSelectedProposalBank] = useState(null);
  const [proposalBanks, setProposalBanks]           = useState([]);  // banks from selected proposal

  // ── Lead (F_DC + F_CP) ───────────────────────────────────────────
  const [qualifiedLeads, setQualifiedLeads]   = useState([]);
  const [fetchingLeads, setFetchingLeads]     = useState(false);
  const [selectedLead, setSelectedLead]       = useState(null);
  const [leadDocuments, setLeadDocuments]     = useState([]);
  const [viewingDoc, setViewingDoc]           = useState(null);

  // ── Bank & Offers ─────────────────────────────────────────────────
  const [bankProducts, setBankProducts]         = useState([]);
  const [fetchingBanks, setFetchingBanks]       = useState(false);
  const [selectedBanks, setSelectedBanks]       = useState([]);   // multi-select (DC + CP)
  const [calculatingOffers, setCalculatingOffers] = useState(false);
  const [offers, setOffers]                     = useState(null);
  const [selectedOffer, setSelectedOffer]       = useState(null); // single offer for case

  // ── Create Proposal (F_CP) ────────────────────────────────────────
  const [coverNote, setCoverNote]             = useState('');
  const [createdProposal, setCreatedProposal] = useState(null);

  // ── Case form ─────────────────────────────────────────────────────
  const [caseData, setCaseData]         = useState(mkCase());
  const [fieldErrors, setFieldErrors]   = useState({});
  const [createdCase, setCreatedCase]   = useState(null);
  const [caseDocStatus, setCaseDocStatus] = useState(null);
  const [fetchingDocStatus, setFetchingDocStatus] = useState(false);

  // ── Loan modal ────────────────────────────────────────────────────
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [editingLoan, setEditingLoan]     = useState(null);
  const [loanForm] = Form.useForm();

  // ══ Auto DBR Recalculation ════════════════════════════════════════
  const recalc = useCallback(() => {
    setCaseData(prev => {
      const inc = prev.incomeDetails;
      const exp = prev.expenseDetails;
      const pi  = prev.propertyInfo;
      const li  = prev.loanInfo;
      const income   = inc.totalMonthlyIncome || 0;
      const expenses = (exp.monthlyRent || 0) + (exp.monthlyOtherLoanInstallments || 0) + (exp.monthlyCreditCardPayments || 0) + (exp.monthlyLivingExpenses || 0);
      const propVal  = pi.propertyValue || 0;
      const dp       = pi.downPayment || 0;
      const loanAmt  = propVal - dp;
      const ltv      = propVal > 0 ? (loanAmt / propVal) * 100 : 0;
      const monthlyEMI = calcEMI(loanAmt, li.interestRatePercentage || 0, li.tenureYears || 25);
      const dbr      = income > 0 ? ((expenses + monthlyEMI) / income) * 100 : 0;
      const dbrStatus = dbr <= 50 ? 'Eligible' : dbr <= 60 ? 'Borderline' : 'Ineligible';
      const dldFee   = propVal * 0.04;
      const regFee   = loanAmt * 0.0025;
      const valFee   = li.valuationFee || 2500;
      const procFee  = li.processingFee || 0;
      return {
        ...prev,
        propertyInfo: {
          ...pi, loanAmount: Math.round(loanAmt), ltvPercentage: parseFloat(ltv.toFixed(2)),
          transactionDetails: { ...pi.transactionDetails, dldFees: Math.round(dldFee), registrationFees: Math.round(regFee), totalClosingCosts: Math.round(dldFee + regFee + valFee + procFee) },
        },
        loanInfo: {
          ...li, requestedAmount: Math.round(loanAmt),
          monthlyInstallment: { ...li.monthlyInstallment, principalAndInterest: monthlyEMI, totalMonthlyPayment: monthlyEMI },
        },
        expenseDetails: { ...exp, totalMonthlyLiabilities: expenses, dbrPercentage: parseFloat(dbr.toFixed(2)), dbrStatus },
      };
    });
  }, []);

  useEffect(() => { recalc(); }, [
    caseData.incomeDetails.totalMonthlyIncome,
    caseData.expenseDetails.monthlyRent, caseData.expenseDetails.monthlyOtherLoanInstallments,
    caseData.expenseDetails.monthlyCreditCardPayments, caseData.expenseDetails.monthlyLivingExpenses,
    caseData.propertyInfo.propertyValue, caseData.propertyInfo.downPayment,
    caseData.loanInfo.interestRatePercentage, caseData.loanInfo.tenureYears, recalc,
  ]);

  // ══ API Calls ════════════════════════════════════════════════════

  const fetchAcceptedProposals = useCallback(async () => {
    setFetchingProposals(true);
    try {
      const res = await apiService.get('/vault/lead/proposals/my-proposals?page=1&limit=100&status=Accepted');
      if (res?.success) setAcceptedProposals((res.data || []).filter(p => !p.convertedToCase));
    } catch { message.error('Failed to fetch proposals'); }
    finally { setFetchingProposals(false); }
  }, []);

  const fetchQualifiedLeads = useCallback(async () => {
    setFetchingLeads(true);
    try {
      const roleCode = user?.role?.code;
      const url = roleCode === '18'
        ? '/vault/lead/admin/all?page=1&limit=100&status=Qualified'
        : roleCode === '21'
        ? '/vault/lead/partner/get?page=1&limit=100&status=Qualified'
        : '/vault/lead/advisor/my-leads?page=1&limit=100&status=Qualified';
      const res = await apiService.get(url);
      if (res?.success) setQualifiedLeads((res.data || []).filter(l => l.currentStatus === 'Qualified' && !l.conversionInfo?.convertedToCase));
    } catch { message.error('Failed to fetch leads'); }
    finally { setFetchingLeads(false); }
  }, [user]);

  const fetchBankProducts = useCallback(async () => {
    setFetchingBanks(true);
    try {
      const res = await apiService.get('/bank/products/get-all-bank-products?page=1&limit=50');
      if (res?.success) {
        setBankProducts(res.data.map(b => ({
          bankProductId: b._id,
          bankName: b.bankInfo?.bankName,
          logo: b.bankInfo?.logo,
          interestRate: b.offerSummary?.initialRate,
          interestType: b.offerSummary?.productType,
          maxLTV: b.loanDetails?.maxLoanToValue,
          minSalary: b.eligibility?.minSalary,
          isPopular: b.isPopular,
          features: b.features?.keyFeatures || [],
          processingFee: b.feesCharges?.processingFee || 0,
        })));
      }
    } catch { message.error('Failed to fetch bank products'); }
    finally { setFetchingBanks(false); }
  }, []);

  const fetchLeadDocuments = useCallback(async (leadId) => {
    try {
      const res = await apiService.get(`/vault/lead/documents/${leadId}`);
      if (res?.success) setLeadDocuments(res.data || []);
    } catch { console.error('Doc fetch failed'); }
  }, []);

  const fetchCaseDocumentStatus = async (caseId) => {
    setFetchingDocStatus(true);
    try {
      const res = await apiService.get(`/vault/case/${caseId}/documents/status`);
      if (res?.success) setCaseDocStatus(res.data);
    } catch { console.error('Doc status fetch failed'); }
    finally { setFetchingDocStatus(false); }
  };

  const calculateOffers = async () => {
    if (!selectedLead || selectedBanks.length === 0) return;
    setCalculatingOffers(true);
    try {
      const payload = {
        leadId: selectedLead._id,
        bankProductIds: selectedBanks.map(b => b.bankProductId),
        tenureYears: selectedLead?.loanRequirements?.preferredTenureYears || 25,
        propertyValue: selectedLead?.propertyDetails?.propertyValue,
        downPayment: selectedLead?.propertyDetails?.downPaymentAmount || 0,
      };
      const res = await apiService.post('/vault/lead/proposals/calculate-offer', payload);
      if (res?.success) { setOffers(res.data); setStep(s => s + 1); }
      else message.error(res?.message || 'Failed to calculate offers');
    } catch { message.error('Error calculating offers'); }
    finally { setCalculatingOffers(false); }
  };

  const submitCase = async () => {
    const sourceLeadId = flow === F_PC
      ? (selectedProposal?.leadId?._id || (typeof selectedProposal?.leadId === 'string' ? selectedProposal.leadId : null))
      : selectedLead?._id;
    if (!sourceLeadId) { message.error('No lead associated'); return; }

    setSubmitting(true);
    try {
      const payload = {
        sourceLeadId,
        proposalId: flow === F_PC ? selectedProposal?._id : null,
        caseReference: caseData.caseReference,
        skipProposalValidation: flow === F_DC,
        clientInfo: { ...caseData.clientInfo, dateOfBirth: fmtDate(caseData.clientInfo.dateOfBirth) },
        employmentDetails: caseData.employmentDetails,
        incomeDetails: caseData.incomeDetails,
        expenseDetails: caseData.expenseDetails,
        propertyInfo: {
          ...caseData.propertyInfo,
          ownershipDetails: { ...caseData.propertyInfo.ownershipDetails, currentOwner: caseData.propertyInfo.ownershipDetails.currentOwner || caseData.clientInfo.fullName },
          transactionDetails: {
            ...caseData.propertyInfo.transactionDetails,
            purchasePrice: caseData.propertyInfo.transactionDetails.purchasePrice || caseData.propertyInfo.propertyValue,
            agreementDate: fmtDate(caseData.propertyInfo.transactionDetails.agreementDate) || new Date(),
            handoverDate: fmtDate(caseData.propertyInfo.transactionDetails.handoverDate),
            depositPaidDate: fmtDate(caseData.propertyInfo.transactionDetails.depositPaidDate),
          },
        },
        loanInfo: { ...caseData.loanInfo, tenureMonths: caseData.loanInfo.tenureYears * 12 },
        currentStatus: 'Draft',
        internalNotes: caseData.internalNotes,
        customerNotes: caseData.customerNotes,
      };
      const res = await apiService.post('/vault/cases', payload);
      if (res?.success) {
        const newCase = res.data?.case || res.data?.data?.case;
        setCreatedCase(newCase);
        message.success(`✅ Case ${caseData.caseReference} created!`);
        if (newCase?._id) fetchCaseDocumentStatus(newCase._id);
        setStep('success');
      } else message.error(res?.message || 'Failed to create case');
    } catch (err) {
      message.error(err?.response?.data?.message || 'Error creating case');
    } finally { setSubmitting(false); }
  };

  const submitProposal = async () => {
    if (!coverNote.trim()) { message.warning('Cover note is required'); return; }
    setSubmitting(true);
    try {
      const res = await apiService.post('/vault/lead/proposals', {
        leadId: selectedLead._id,
        selectedBankProducts: selectedBanks.map(b => ({
          bankProductId: b.bankProductId,
          snapshotRate: b.interestRate,
          snapshotFeatures: b.features || [],
          snapshotMaxLtv: b.maxLTV || 80,
        })),
        coverNote,
      });
      if (res?.success) {
        setCreatedProposal(res.data);
        message.success('✅ Proposal created successfully!');
        setStep('proposal_success');
      } else message.error(res?.message || 'Failed to create proposal');
    } catch { message.error('Error submitting proposal'); }
    finally { setSubmitting(false); }
  };

  // ══ Effects ═══════════════════════════════════════════════════════
  useEffect(() => {
    if (flow === F_PC) { fetchAcceptedProposals(); }
    else if (flow === F_DC || flow === F_CP) { fetchQualifiedLeads(); fetchBankProducts(); }
  }, [flow, fetchAcceptedProposals, fetchQualifiedLeads, fetchBankProducts]);

  useEffect(() => {
    if (selectedLead) {
      fetchLeadDocuments(selectedLead._id);
      if (flow === F_DC) populateCaseFromLead(selectedLead);
    }
  }, [selectedLead]);

  // Auto cover note
  useEffect(() => {
    if (flow === F_CP && step === 4 && selectedLead && !coverNote && offers) {
      const loanAmt = (selectedLead.propertyDetails?.propertyValue || 0) - (selectedLead.propertyDetails?.downPaymentAmount || 0);
      const best = offers.offers?.[0];
      setCoverNote(`Dear ${selectedLead.customerInfo?.fullName},\n\nThank you for choosing Xoto VAULT for your mortgage needs.\n\nBased on your profile:\n• Property Value: AED ${selectedLead.propertyDetails?.propertyValue?.toLocaleString()}\n• Loan Amount: AED ${loanAmt.toLocaleString()}\n• Monthly Salary: AED ${selectedLead.customerInfo?.monthlySalary?.toLocaleString()}\n\nOur best offer for you:\n• ${best?.bankName} — ${best?.interestRate}% rate, EMI AED ${best?.emi?.toLocaleString()}\n\nPlease review the attached proposal.\n\nBest regards,\nXoto VAULT Team`);
    }
  }, [flow, step, selectedLead, offers]);

  // ══ Populate Helpers ══════════════════════════════════════════════
  const populateCaseFromProposal = (proposal, lead, bankProduct) => {
    const bp = bankProduct || proposal.selectedBankProducts?.[0];
    const propVal = lead.propertyDetails?.propertyValue || 0;
    const dp = lead.propertyDetails?.downPaymentAmount || 0;
    const elig = lead.eligibility || {};
    setCaseData(prev => ({
      ...prev, caseReference: genRef(),
      clientInfo: { ...prev.clientInfo, fullName: lead.customerInfo?.fullName || '', email: lead.customerInfo?.email || '', mobile: lead.customerInfo?.mobileNumber || '', nationality: lead.customerInfo?.nationality || '', dateOfBirth: lead.customerInfo?.dateOfBirth ? dayjs(lead.customerInfo.dateOfBirth) : null, maritalStatus: lead.customerInfo?.maritalStatus || 'Single', numberOfDependents: lead.customerInfo?.numberOfDependents || 0, gender: lead.customerInfo?.gender || 'Male' },
      employmentDetails: { ...prev.employmentDetails, employerName: lead.customerInfo?.employer || '', designation: lead.customerInfo?.occupation || '' },
      incomeDetails: { ...prev.incomeDetails, basicSalary: lead.customerInfo?.monthlySalary || 0, totalMonthlySalary: lead.customerInfo?.monthlySalary || 0, totalMonthlyIncome: lead.customerInfo?.monthlySalary || 0 },
      propertyInfo: { ...prev.propertyInfo, propertyValue: propVal, downPayment: dp, propertyAddress: { ...prev.propertyInfo.propertyAddress, building: lead.propertyDetails?.propertyAddress?.building || '', area: lead.propertyDetails?.propertyAddress?.area || '' }, transactionDetails: { ...prev.propertyInfo.transactionDetails, purchasePrice: propVal, agreementDate: dayjs() }, ownershipDetails: { ...prev.propertyInfo.ownershipDetails, currentOwner: lead.customerInfo?.fullName || '' } },
      loanInfo: { ...prev.loanInfo, selectedBank: bp?.bankName || bp?.bankProductId?.bankInfo?.bankName || '', selectedBankProduct: bp?.bankProductId?._id || bp?.bankProductId || '', interestRatePercentage: bp?.snapshotRate || bp?.bankProductId?.offerSummary?.initialRate || 4.25, tenureYears: lead.loanRequirements?.preferredTenureYears || 25 },
      internalNotes: `Case from proposal ${proposal._id}. ${elig.isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'} (DBR: ${elig.dbrPercentage || 0}%)`,
    }));
  };

  const populateCaseFromLead = (lead) => {
    const propVal = lead.propertyDetails?.propertyValue || 0;
    const dp = lead.propertyDetails?.downPaymentAmount || 0;
    const elig = lead.eligibility || {};
    setCaseData(prev => ({
      ...prev, caseReference: genRef(),
      clientInfo: { ...prev.clientInfo, fullName: lead.customerInfo?.fullName || '', email: lead.customerInfo?.email || '', mobile: lead.customerInfo?.mobileNumber || '', nationality: lead.customerInfo?.nationality || '', dateOfBirth: lead.customerInfo?.dateOfBirth ? dayjs(lead.customerInfo.dateOfBirth) : null, maritalStatus: lead.customerInfo?.maritalStatus || 'Single', numberOfDependents: lead.customerInfo?.numberOfDependents || 0, gender: lead.customerInfo?.gender || 'Male' },
      employmentDetails: { ...prev.employmentDetails, employerName: lead.customerInfo?.employer || '', designation: lead.customerInfo?.occupation || '' },
      incomeDetails: { ...prev.incomeDetails, basicSalary: lead.customerInfo?.monthlySalary || 0, totalMonthlySalary: lead.customerInfo?.monthlySalary || 0, totalMonthlyIncome: lead.customerInfo?.monthlySalary || 0 },
      propertyInfo: { ...prev.propertyInfo, propertyValue: propVal, downPayment: dp, loanAmount: lead.propertyDetails?.loanAmountRequired || (propVal - dp), propertyAddress: { ...prev.propertyInfo.propertyAddress, building: lead.propertyDetails?.propertyAddress?.building || '', area: lead.propertyDetails?.propertyAddress?.area || '' }, transactionDetails: { ...prev.propertyInfo.transactionDetails, purchasePrice: propVal, agreementDate: dayjs() }, ownershipDetails: { ...prev.propertyInfo.ownershipDetails, currentOwner: lead.customerInfo?.fullName || '' } },
      loanInfo: { ...prev.loanInfo, tenureYears: lead.loanRequirements?.preferredTenureYears || 25, interestRateType: lead.loanRequirements?.preferredInterestRateType || 'Fixed', requestedAmount: lead.propertyDetails?.loanAmountRequired || (propVal - dp) },
      internalNotes: `Direct case from lead ${lead._id}. ${elig.isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'} (DBR: ${elig.dbrPercentage || 0}%)`,
    }));
  };

  const applyOfferToCase = (offer) => {
    setSelectedOffer(offer);
    setCaseData(prev => ({
      ...prev,
      loanInfo: { ...prev.loanInfo, selectedBank: offer.bankName, selectedBankProduct: offer.bankId || offer.bankProductId, interestRatePercentage: offer.interestRate },
    }));
  };

  // ══ Case Form Handlers ════════════════════════════════════════════
  const setField  = (sec, fld, val) => { setCaseData(p => ({ ...p, [sec]: { ...p[sec], [fld]: val } })); setFieldErrors(p => { const n = { ...p }; delete n[`${sec}.${fld}`]; return n; }); };
  const setNested = (sec, sub, fld, val) => setCaseData(p => ({ ...p, [sec]: { ...p[sec], [sub]: { ...p[sec][sub], [fld]: val } } }));
  const setIncome = (fld, val) => setCaseData(p => { const u = { ...p.incomeDetails, [fld]: val || 0 }; const total = (u.basicSalary || 0) + (u.housingAllowance || 0) + (u.transportAllowance || 0) + (u.otherAllowances || 0); return { ...p, incomeDetails: { ...u, totalMonthlySalary: total, totalMonthlyIncome: total } }; });

  const toggleBank = b => {
    const has = selectedBanks.find(x => x.bankProductId === b.bankProductId);
    if (has) setSelectedBanks(p => p.filter(x => x.bankProductId !== b.bankProductId));
    else if (selectedBanks.length >= 3) message.warning('Maximum 3 banks');
    else setSelectedBanks(p => [...p, b]);
  };

  const handleAddLoan = () => {
    loanForm.validateFields().then(vals => {
      setCaseData(p => {
        const loans = editingLoan !== null
          ? p.expenseDetails.existingLoans.map((l, i) => i === editingLoan ? vals : l)
          : [...p.expenseDetails.existingLoans, vals];
        return { ...p, expenseDetails: { ...p.expenseDetails, existingLoans: loans, monthlyOtherLoanInstallments: loans.reduce((s, l) => s + (l.monthlyInstallment || 0), 0) } };
      });
      loanForm.resetFields(); setShowLoanModal(false); setEditingLoan(null);
    });
  };

  // ══ Validation ════════════════════════════════════════════════════
  const validateClient = () => {
    const errs = {};
    ['fullName', 'email', 'mobile', 'nationality', 'dateOfBirth'].forEach(f => { if (!caseData.clientInfo[f]) errs[`ci.${f}`] = true; });
    if (!caseData.employmentDetails.employerName) errs['emp.name'] = true;
    if (!caseData.employmentDetails.designation) errs['emp.des'] = true;
    setFieldErrors(errs);
    if (Object.keys(errs).length) { message.error('Please fill all required fields'); return false; }
    return true;
  };
  const validateIncome = () => {
    if (!caseData.incomeDetails.totalMonthlyIncome || caseData.incomeDetails.totalMonthlyIncome <= 0) { message.error('Please enter valid monthly income'); return false; }
    return true;
  };
  const validateProperty = () => {
    if (!caseData.propertyInfo.propertyValue || caseData.propertyInfo.propertyValue <= 0) { message.error('Please enter property value'); return false; }
    if (!caseData.loanInfo.interestRatePercentage || caseData.loanInfo.interestRatePercentage <= 0) { message.error('Please enter interest rate'); return false; }
    if (!caseData.loanInfo.selectedBankProduct) { message.error('Please select a bank product'); return false; }
    return true;
  };

  // ══ Reset ════════════════════════════════════════════════════════
  const reset = () => {
    setFlow(null); setStep(0);
    setSelectedProposal(null); setSelectedProposalBank(null); setProposalBanks([]);
    setSelectedLead(null); setLeadDocuments([]); setViewingDoc(null);
    setSelectedBanks([]); setOffers(null); setSelectedOffer(null);
    setCoverNote(''); setCreatedProposal(null);
    setCaseData(mkCase()); setCreatedCase(null); setCaseDocStatus(null);
    setFieldErrors({});
  };

  // ══ Steps config per flow ═════════════════════════════════════════
  const stepsConfig = {
    [F_PC]: ['Select Proposal', 'Select Bank', 'Client Info', 'Income & DBR', 'Property & Loan', 'Review & Submit'],
    [F_DC]: ['Select Lead', 'Review Lead', 'Select Banks', 'View Offers', 'Client Info', 'Income & DBR', 'Property & Loan', 'Review & Submit'],
    [F_CP]: ['Select Lead', 'Review Lead', 'Select Banks', 'View Offers', 'Finalize'],
  };

  // ══════════════════════════════════════════════════════════════════
  //  RENDER FUNCTIONS
  // ══════════════════════════════════════════════════════════════════

  // ─── A: Mode Selection ────────────────────────────────────────────
  const renderModeSelection = () => (
    <div style={{ animation: 'fadeIn .4s' }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <Title level={3} style={{ color: P, margin: 0 }}>What would you like to do?</Title>
        <Text type="secondary">Choose a workflow to get started</Text>
      </div>
      <Row gutter={[24, 24]}>
        {[
          {
            flow: F_PC, icon: <FileDoneOutlined />, title: 'Case from Accepted Proposal',
            desc: 'Convert an accepted proposal into a formal case', tag: 'Recommended', tagColor: 'purple',
            bullets: ['Auto-fill from proposal', 'Bank already selected', 'Eligibility pre-calculated'],
          },
          {
            flow: F_DC, icon: <ThunderboltOutlined />, title: 'Case from Qualified Lead',
            desc: 'Skip proposal — create case directly with bank/offer selection', tag: 'Direct', tagColor: 'blue',
            bullets: ['Select bank & view offers', 'Manual bank comparison', 'Faster processing'],
          },
          {
            flow: F_CP, icon: <FileAddOutlined />, title: 'Create New Proposal',
            desc: 'Build a full mortgage proposal for a qualified lead', tag: 'Full Flow', tagColor: 'green',
            bullets: ['Up to 3 banks compared', 'Offer calculation', 'Customer cover note'],
          },
        ].map(({ flow: f, icon, title, desc, tag, tagColor, bullets }) => (
          <Col xs={24} lg={8} key={f}>
            <Card
              hoverable
              onClick={() => setFlow(f)}
              style={{ borderRadius: 20, border: `2px solid ${P}15`, height: '100%', transition: 'all .25s', cursor: 'pointer' }}
              bodyStyle={{ padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = P}
              onMouseLeave={e => e.currentTarget.style.borderColor = `${P}15`}
            >
              <div style={{ width: 72, height: 72, borderRadius: 20, background: `linear-gradient(135deg, ${P}, ${PM})`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 32, color: '#fff' }}>
                {icon}
              </div>
              <Title level={4} style={{ margin: '0 0 8px', color: '#1e1b4b' }}>{title}</Title>
              <Text type="secondary" style={{ fontSize: 13, marginBottom: 16, display: 'block' }}>{desc}</Text>
              <Tag color={tagColor} style={{ marginBottom: 16 }}>{tag}</Tag>
              <div style={{ textAlign: 'left', width: '100%', background: PL, borderRadius: 10, padding: '12px 16px' }}>
                {bullets.map(b => (
                  <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <CheckCircleOutlined style={{ color: P, fontSize: 12 }} />
                    <Text style={{ fontSize: 12, color: '#4c1d95' }}>{b}</Text>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );

  // ─── B: Proposal Case — Step 0: Select Proposal ──────────────────
  const renderPC_SelectProposal = () => (
    <div style={{ animation: 'fadeIn .4s' }}>
      <Title level={4} style={{ color: P, marginBottom: 24 }}>Select an Accepted Proposal</Title>
      {fetchingProposals ? <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
        : acceptedProposals.length === 0 ? <Alert message="No Accepted Proposals Found" description="No unconverted accepted proposals available." type="info" showIcon style={{ borderRadius: 12 }} />
        : (
          <Row gutter={[16, 16]}>
            {acceptedProposals.map(p => (
              <Col xs={24} md={12} lg={8} key={p._id}>
                <Card
                  hoverable
                  onClick={async () => {
                    setSelectedProposal(p);
                    setLoading(true);
                    try {
                      const res = await apiService.get(`/vault/lead/proposals/${p._id}`);
                      if (res?.success) {
                        const proposal = res.data.proposal || res.data;
                        const lead = proposal?.leadId;
                        const banks = proposal?.selectedBankProducts || [];
                        setProposalBanks(banks);
                        if (banks.length === 1) {
                          const bp = banks[0];
                          setSelectedProposalBank(bp);
                          if (lead) populateCaseFromProposal(proposal, lead, bp);
                          setStep(2); // Skip bank picker
                        } else {
                          if (lead) populateCaseFromProposal(proposal, lead, null);
                          setStep(1); // Show bank picker
                        }
                      }
                    } catch { message.error('Failed to load proposal'); }
                    finally { setLoading(false); }
                  }}
                  style={{ borderRadius: 14, borderColor: selectedProposal?._id === p._id ? P : '#f0f0f0', borderWidth: selectedProposal?._id === p._id ? 2 : 1 }}
                  loading={loading && selectedProposal?._id === p._id}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <Avatar icon={<UserOutlined />} style={{ background: P }} />
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ display: 'block' }}>{p.leadId?.customerInfo?.fullName || 'Unknown'}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>{p.leadId?.customerInfo?.email || ''}</Text>
                    </div>
                    <Badge status="success" text="Accepted" />
                  </div>
                  <Divider style={{ margin: '10px 0' }} />
                  <Row gutter={[8, 8]}>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 11 }}>Property Value</Text>
                      <div><b>AED {(p.clientRequirements?.targetPropertyValue || 0).toLocaleString()}</b></div>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 11 }}>Loan Amount</Text>
                      <div><b>AED {(p.customerFinancialSummary?.estimatedLoanAmount || 0).toLocaleString()}</b></div>
                    </Col>
                    <Col span={24} style={{ marginTop: 6 }}>
                      {(p.selectedBankProducts || []).map((bp, i) => (
                        <Tag key={i} color="purple" style={{ marginBottom: 4 }}>
                          {bp.bankName || bp.bankProductId?.bankInfo?.bankName} ({bp.snapshotRate || bp.bankProductId?.offerSummary?.initialRate}%)
                        </Tag>
                      ))}
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      <NavBar onBack={() => { setFlow(null); setStep(0); }} backLabel="Back to Options" />
    </div>
  );

  // ─── B: Proposal Case — Step 1: Pick Bank from Proposal ──────────
  const renderPC_BankPicker = () => (
    <div style={{ animation: 'fadeIn .4s' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ color: P, margin: 0 }}>Select Bank for this Case</Title>
        <Text type="secondary">This proposal includes multiple banks. Choose one for the case.</Text>
      </div>
      <Alert message="Tip" description="The bank you select will be used for case creation. Interest rate and LTV will be pre-filled from the proposal offer." type="info" showIcon style={{ marginBottom: 20, borderRadius: 10 }} />
      <Row gutter={[20, 20]}>
        {proposalBanks.map((bp, i) => {
          const bankName = bp.bankName || bp.bankProductId?.bankInfo?.bankName;
          const rate = bp.snapshotRate || bp.bankProductId?.offerSummary?.initialRate;
          const maxLtv = bp.snapshotMaxLtv || bp.bankProductId?.loanDetails?.maxLoanToValue;
          const emi = bp.snapshotEmi || bp.bankProductId?.offerSummary?.monthlyEMI;
          const isSelected = selectedProposalBank === bp || selectedProposalBank?.bankProductId === bp.bankProductId;
          return (
            <Col xs={24} md={12} key={i}>
              <div
                onClick={() => {
                  setSelectedProposalBank(bp);
                  const lead = selectedProposal?.leadId;
                  if (lead) populateCaseFromProposal({ selectedBankProducts: proposalBanks, _id: selectedProposal._id, coverNote: selectedProposal.coverNote }, lead, bp);
                }}
                style={{ background: '#fff', border: `2px solid ${isSelected ? P : '#e5e7eb'}`, borderRadius: 16, padding: 24, cursor: 'pointer', transition: 'all .2s', boxShadow: isSelected ? `0 4px 24px ${P}25` : '0 2px 8px rgba(0,0,0,.05)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: isSelected ? P : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BankOutlined style={{ fontSize: 22, color: isSelected ? '#fff' : '#6b7280' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ fontSize: 16 }}>{bankName}</Text>
                    <div style={{ marginTop: 4 }}>
                      <Tag color="purple">Rate: {rate}%</Tag>
                      <Tag color="green">Max LTV: {maxLtv}%</Tag>
                    </div>
                  </div>
                  {isSelected && <CheckCircleOutlined style={{ fontSize: 22, color: P }} />}
                </div>
                {emi && <Text type="secondary" style={{ fontSize: 13 }}>Monthly EMI: <b>AED {Number(emi).toLocaleString()}</b></Text>}
              </div>
            </Col>
          );
        })}
      </Row>
      <NavBar
        onBack={() => setStep(0)}
        onNext={() => { if (!selectedProposalBank) { message.error('Please select a bank'); return; } setStep(2); }}
        nextLabel="Continue to Client Info →"
        nextDisabled={!selectedProposalBank}
      />
    </div>
  );

  // ─── C: Direct Case — Step 0: Select Lead ────────────────────────
  const renderLeadSelect = () => (
    <div style={{ animation: 'fadeIn .4s' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ color: P, margin: 0 }}>Select Qualified Lead</Title>
        <Text type="secondary">Choose the lead to {flow === F_DC ? 'create a case for' : 'create a proposal for'}</Text>
      </div>
      {fetchingLeads ? <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
        : qualifiedLeads.length === 0 ? <Alert message="No Qualified Leads Found" description="No unconverted qualified leads available." type="info" showIcon style={{ borderRadius: 12 }} />
        : (
          <Row gutter={[16, 16]}>
            {qualifiedLeads.map(lead => {
              const sel = selectedLead?._id === lead._id;
              return (
                <Col xs={24} md={12} lg={8} key={lead._id}>
                  <div
                    onClick={() => { setSelectedLead(lead); }}
                    style={{ background: '#fff', border: `2px solid ${sel ? P : '#e5e7eb'}`, borderRadius: 16, padding: 20, cursor: 'pointer', transition: 'all .2s', boxShadow: sel ? `0 4px 20px ${P}20` : '0 2px 8px rgba(0,0,0,.04)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: sel ? P : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UserOutlined style={{ color: sel ? '#fff' : '#6b7280', fontSize: 18 }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text strong style={{ display: 'block', fontSize: 15 }}>{lead.customerInfo?.fullName}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{lead.customerInfo?.email}</Text>
                      </div>
                      {sel && <CheckCircleOutlined style={{ color: P, fontSize: 20 }} />}
                    </div>
                    <Divider style={{ margin: '10px 0' }} />
                    <Row gutter={12}>
                      <Col span={12}>
                        <Text style={{ fontSize: 11, color: '#9ca3af', display: 'block' }}>Property Value</Text>
                        <Text strong style={{ fontSize: 13 }}>AED {(lead.propertyDetails?.propertyValue || 0).toLocaleString()}</Text>
                      </Col>
                      <Col span={12}>
                        <Text style={{ fontSize: 11, color: '#9ca3af', display: 'block' }}>Monthly Salary</Text>
                        <Text strong style={{ fontSize: 13 }}>AED {(lead.customerInfo?.monthlySalary || 0).toLocaleString()}</Text>
                      </Col>
                    </Row>
                    <div style={{ marginTop: 10 }}>
                      {lead.eligibility?.isEligible
                        ? <Tag color="success">✓ Eligible (DBR: {lead.eligibility?.dbrPercentage}%)</Tag>
                        : <Tag color="warning">⚠ Borderline (DBR: {lead.eligibility?.dbrPercentage}%)</Tag>}
                      {lead.documentCollection?.readyForSubmission && <Tag color="green" icon={<CheckCircleOutlined />} style={{ marginLeft: 4 }}>Docs Ready</Tag>}
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        )}
      <NavBar
        onBack={() => { setFlow(null); setStep(0); }} backLabel="Back to Options"
        onNext={() => { if (!selectedLead) { message.error('Please select a lead'); return; } setStep(1); }}
        nextLabel="Continue →" nextDisabled={!selectedLead}
      />
    </div>
  );

  // ─── D: Lead Review + Documents ───────────────────────────────────
  const renderLeadReview = () => {
    const lead = selectedLead;
    const loanAmt = (lead?.propertyDetails?.propertyValue || 0) - (lead?.propertyDetails?.downPaymentAmount || 0);
    return (
      <div style={{ animation: 'fadeIn .4s' }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={4} style={{ color: P, margin: 0 }}>Lead Details & Documents</Title>
          <Text type="secondary">Review customer information before proceeding</Text>
        </div>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card title={<span><UserOutlined style={{ color: P, marginRight: 8 }} />Customer Info</span>} style={{ borderRadius: 14, marginBottom: 20 }}>
              <Row gutter={[16, 12]}>
                {[['Full Name', lead?.customerInfo?.fullName], ['Nationality', lead?.customerInfo?.nationality], ['Email', lead?.customerInfo?.email], ['Mobile', lead?.customerInfo?.mobileNumber], ['Occupation', lead?.customerInfo?.occupation || 'N/A'], ['Employer', lead?.customerInfo?.employer || 'N/A']].map(([lbl, val]) => (
                  <Col xs={24} sm={12} key={lbl}>
                    <Text style={{ fontSize: 11, color: '#9ca3af', display: 'block' }}>{lbl}</Text>
                    <Text strong style={{ fontSize: 14 }}>{val}</Text>
                  </Col>
                ))}
                <Col span={24}>
                  <div style={{ background: PL, borderRadius: 10, padding: '12px 16px', marginTop: 4 }}>
                    <Text style={{ fontSize: 11, color: '#6b7280', display: 'block' }}>Monthly Salary</Text>
                    <Text strong style={{ fontSize: 20, color: P }}>AED {(lead?.customerInfo?.monthlySalary || 0).toLocaleString()}</Text>
                  </div>
                </Col>
              </Row>
            </Card>
            <Card title={<span><BankOutlined style={{ color: P, marginRight: 8 }} />Property & Loan</span>} style={{ borderRadius: 14 }}>
              <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                {[['Property Value', `AED ${(lead?.propertyDetails?.propertyValue || 0).toLocaleString()}`], ['Down Payment', `AED ${(lead?.propertyDetails?.downPaymentAmount || 0).toLocaleString()}`], ['Loan Required', `AED ${loanAmt.toLocaleString()}`]].map(([lbl, val]) => (
                  <Col span={8} key={lbl}>
                    <div style={{ background: PL, borderRadius: 10, padding: '12px 10px', textAlign: 'center' }}>
                      <Text style={{ fontSize: 11, color: '#6b7280', display: 'block' }}>{lbl}</Text>
                      <Text strong style={{ fontSize: 13, color: P }}>{val}</Text>
                    </div>
                  </Col>
                ))}
              </Row>
              <Row gutter={[12, 8]}>
                {[['Property Type', lead?.propertyDetails?.propertyType], ['Location', `${lead?.propertyDetails?.propertyAddress?.area || ''}, ${lead?.propertyDetails?.propertyAddress?.city || 'Dubai'}`], ['Preferred Tenure', `${lead?.loanRequirements?.preferredTenureYears || 25} Years`]].map(([lbl, val]) => (
                  <Col xs={24} sm={8} key={lbl}>
                    <Text style={{ fontSize: 11, color: '#9ca3af', display: 'block' }}>{lbl}</Text>
                    <Text strong style={{ fontSize: 13 }}>{val}</Text>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title={<span><FileTextOutlined style={{ color: P, marginRight: 8 }} />Documents ({leadDocuments.length})</span>} style={{ borderRadius: 14 }}>
              {leadDocuments.length === 0 ? <Text type="secondary">No documents uploaded yet</Text> : leadDocuments.map(doc => (
                <div key={doc._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: '#fafafa', borderRadius: 8, marginBottom: 8 }}>
                  <div>
                    <Text strong style={{ fontSize: 12, textTransform: 'capitalize' }}>{doc.documentType?.replace(/_/g, ' ')}</Text>
                    <Text type="secondary" style={{ display: 'block', fontSize: 11 }}>{doc.formattedFileSize}</Text>
                  </div>
                  <Button type="text" icon={<EyeOutlined />} size="small" style={{ color: P }} onClick={() => setViewingDoc(doc)} />
                </div>
              ))}
            </Card>
          </Col>
        </Row>
        <NavBar
          onBack={() => setStep(0)}
          onNext={() => setStep(2)}
          nextLabel={flow === F_DC ? 'Select Banks →' : 'Choose Banks →'}
        />
      </div>
    );
  };

  // ─── E: Select Bank Products (multi, for DC and CP) ──────────────
  const renderSelectBanks = () => (
    <div style={{ animation: 'fadeIn .4s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <Title level={4} style={{ color: P, margin: 0 }}>
            {flow === F_DC ? 'Select Banks for Offer Comparison' : 'Select Banks for Proposal'}
          </Title>
          <Text type="secondary">
            {flow === F_DC ? 'Choose 1–3 banks. We\'ll calculate offers for each.' : 'Select up to 3 banks to compare.'}
          </Text>
        </div>
        <div style={{ background: selectedBanks.length >= 3 ? '#fef3c7' : PL, color: selectedBanks.length >= 3 ? GD : P, padding: '6px 18px', borderRadius: 20, fontWeight: 700, fontSize: 14 }}>
          {selectedBanks.length}/3 Selected
        </div>
      </div>
      {selectedBanks.length > 0 && (
        <div style={{ background: PL, borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <Text strong style={{ color: P }}>Selected: </Text>
          {selectedBanks.map(b => (
            <Tag key={b.bankProductId} closable onClose={() => toggleBank(b)} style={{ borderRadius: 20, padding: '3px 10px', background: '#fff', color: P, border: `1px solid ${P}`, fontSize: 13 }}>
              {b.bankName}
            </Tag>
          ))}
        </div>
      )}
      {fetchingBanks ? <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
        : bankProducts.length === 0 ? <Empty description="No bank products available" />
        : (
          <Row gutter={[20, 20]}>
            {bankProducts.map(bank => {
              const isSel = selectedBanks.some(b => b.bankProductId === bank.bankProductId);
              return (
                <Col xs={24} md={12} lg={8} key={bank.bankProductId}>
                  <BankSelectCard bank={bank} isSelected={isSel} onToggle={toggleBank} disabled={!isSel && selectedBanks.length >= 3} />
                </Col>
              );
            })}
          </Row>
        )}
      <NavBar
        onBack={() => setStep(1)}
        onNext={calculateOffers}
        nextLabel={calculatingOffers ? 'Calculating...' : `Calculate Offers (${selectedBanks.length})`}
        nextDisabled={selectedBanks.length === 0}
        nextLoading={calculatingOffers}
        nextIcon={<CalculatorOutlined />}
      />
    </div>
  );

  // ─── F: View Calculated Offers ────────────────────────────────────
  const renderViewOffers = () => {
    if (!offers) return <Empty description="No offers available" />;
    const isCase = flow === F_DC;
    return (
      <div style={{ animation: 'fadeIn .4s' }}>
        {/* Header banner */}
        <div style={{ background: `linear-gradient(135deg, ${P} 0%, ${PM} 100%)`, borderRadius: 18, padding: '24px 28px', marginBottom: 28, color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <TrophyOutlined style={{ fontSize: 32 }} />
            <div>
              <Title level={4} style={{ color: '#fff', margin: 0 }}>Personalised Offers</Title>
              <Text style={{ color: 'rgba(255,255,255,.8)' }}>{offers.totalCalculated} offers calculated</Text>
            </div>
          </div>
          <Row gutter={[16, 12]}>
            {[['Best Rate', `${offers.bestRate}%`, offers.bestRateBank], ['Lowest EMI', `AED ${(offers.lowestEmi || 0).toLocaleString()}`, 'per month'], ['Banks', String(offers.totalCalculated), 'compared']].map(([lbl, val, sub]) => (
              <Col xs={24} sm={8} key={lbl}>
                <div style={{ background: 'rgba(255,255,255,.12)', borderRadius: 12, padding: '12px 16px' }}>
                  <Text style={{ color: 'rgba(255,255,255,.7)', fontSize: 12, display: 'block' }}>{lbl}</Text>
                  <Text strong style={{ color: '#fff', fontSize: 22 }}>{val}</Text>
                  <Text style={{ color: 'rgba(255,255,255,.7)', fontSize: 11, display: 'block' }}>{sub}</Text>
                </div>
              </Col>
            ))}
          </Row>
        </div>
        {isCase && !selectedOffer && (
          <Alert message="Select an offer" description="Click 'Select This Offer' on the bank you want to use for the case. The interest rate and bank will be pre-filled." type="info" showIcon style={{ marginBottom: 20, borderRadius: 10 }} />
        )}
        <Row gutter={[24, 24]}>
          {(offers.offers || []).map((offer, i) => (
            <Col xs={24} md={12} lg={8} key={offer.bankId || i}>
              <OfferCard offer={offer} index={i} selectable={isCase} isSelected={selectedOffer?.bankId === offer.bankId} onSelect={applyOfferToCase} />
            </Col>
          ))}
        </Row>
        {flow === F_DC && (
          <NavBar
            onBack={() => setStep(2)}
            onNext={() => { if (!selectedOffer) { message.error('Please select an offer for the case'); return; } setStep(4); }}
            nextLabel="Continue to Client Info →"
            nextDisabled={!selectedOffer}
          />
        )}
        {flow === F_CP && (
          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f0f0f0', paddingTop: 20 }}>
            <Button size="large" onClick={() => setStep(2)} style={{ borderRadius: 10, padding: '0 28px', height: 46 }}>
              <ArrowLeftOutlined /> Back
            </Button>
            <Button type="primary" size="large" onClick={() => setStep(4)} style={{ background: P, borderColor: P, borderRadius: 10, padding: '0 36px', height: 46 }}>
              <SendOutlined /> Create Proposal Now
            </Button>
          </div>
        )}
      </div>
    );
  };

  // ─── G: Create Proposal — Step 4: Finalize ────────────────────────
  const renderProposalFinalize = () => {
    const loanAmt = (selectedLead?.propertyDetails?.propertyValue || 0) - (selectedLead?.propertyDetails?.downPaymentAmount || 0);
    const best = offers?.offers?.[0];
    return (
      <div style={{ animation: 'fadeIn .4s' }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={4} style={{ color: P, margin: 0 }}>Finalize Proposal</Title>
          <Text type="secondary">Write a cover note and submit the proposal</Text>
        </div>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={15}>
            <Card title={<span><FileTextOutlined style={{ color: P, marginRight: 8 }} />Cover Note</span>} style={{ borderRadius: 14 }}>
              <TextArea rows={13} value={coverNote} onChange={e => setCoverNote(e.target.value)} placeholder="Write a personalised cover note for the customer..." style={{ borderRadius: 10, fontSize: 14, lineHeight: 1.7 }} />
              <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>{coverNote.length} characters</Text>
            </Card>
          </Col>
          <Col xs={24} lg={9}>
            <Card title="Proposal Summary" style={{ borderRadius: 14, background: PL }} headStyle={{ color: P, borderBottom: `1px solid ${P}20` }}>
              <Text style={{ fontSize: 12, color: '#9ca3af' }}>Customer</Text>
              <Text strong style={{ display: 'block', fontSize: 15, marginBottom: 12 }}>{selectedLead?.customerInfo?.fullName}</Text>
              <Divider style={{ margin: '8px 0' }} />
              <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
                {[['Property Value', `AED ${(selectedLead?.propertyDetails?.propertyValue || 0).toLocaleString()}`], ['Loan Amount', `AED ${loanAmt.toLocaleString()}`], ['Best Rate', `${best?.interestRate || 0}%`], ['Lowest EMI', `AED ${(offers?.lowestEmi || 0).toLocaleString()}`]].map(([lbl, val]) => (
                  <Col span={12} key={lbl}>
                    <Text style={{ fontSize: 11, color: '#9ca3af', display: 'block' }}>{lbl}</Text>
                    <Text strong style={{ fontSize: 13 }}>{val}</Text>
                  </Col>
                ))}
              </Row>
              <Divider style={{ margin: '8px 0' }} />
              <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>{selectedBanks.length} Banks Included</Text>
              {selectedBanks.map((b, i) => {
                const mo = offers?.offers?.find(o => o.bankId === b.bankProductId);
                return (
                  <div key={i} style={{ background: '#fff', borderRadius: 8, padding: '8px 12px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img src={b.logo} alt={b.bankName} style={{ width: 28, height: 28, objectFit: 'contain', borderRadius: 6 }} onError={e => { e.target.style.display = 'none'; }} />
                    <div>
                      <Text strong style={{ fontSize: 13 }}>{b.bankName}</Text>
                      <Text type="secondary" style={{ display: 'block', fontSize: 11 }}>{mo ? `${mo.interestRate}% • EMI AED ${mo.emi?.toLocaleString()}` : `${b.interestRate}%`}</Text>
                    </div>
                    {i === 0 && <StarFilled style={{ color: GD, marginLeft: 'auto', fontSize: 14 }} />}
                  </div>
                );
              })}
            </Card>
          </Col>
        </Row>
        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f0f0f0', paddingTop: 20 }}>
          <Button size="large" onClick={() => setStep(3)} style={{ borderRadius: 10, padding: '0 32px', height: 46 }}><ArrowLeftOutlined /> Back</Button>
          <Button type="primary" size="large" loading={submitting} disabled={!coverNote.trim()} onClick={submitProposal} style={{ background: G, borderColor: G, borderRadius: 10, padding: '0 40px', height: 46, fontWeight: 700 }}>
            {submitting ? 'Submitting...' : 'Submit Proposal'} {!submitting && <SendOutlined />}
          </Button>
        </div>
      </div>
    );
  };

  // ─── H: Shared Case Form — Step: Client Info ─────────────────────
  const renderClientInfo = () => {
    const ci = caseData.clientInfo;
    const emp = caseData.employmentDetails;
    const err = (k) => fieldErrors[k] ? 'error' : '';
    return (
      <div style={{ animation: 'fadeIn .4s' }}>
        <Title level={4} style={{ color: P, marginBottom: 16 }}>Client Information</Title>
        <Alert message="Data pre-filled from lead/proposal. Review and complete any missing fields." type="success" showIcon style={{ marginBottom: 20, borderRadius: 10 }} />
        <Row gutter={[24, 16]}>
          <Col span={24}>
            <Card title="Personal Details" style={{ borderRadius: 14, marginBottom: 16 }} bodyStyle={{ padding: 20 }}>
              <Row gutter={[16, 14]}>
                {[
                  { lbl: 'Full Name *', key: 'fullName', comp: <Input size="large" value={ci.fullName} onChange={e => setField('clientInfo', 'fullName', e.target.value)} placeholder="Full name" status={err('ci.fullName')} /> },
                  { lbl: 'Preferred Name', key: 'preferredName', comp: <Input size="large" value={ci.preferredName} onChange={e => setField('clientInfo', 'preferredName', e.target.value)} placeholder="Nick name" /> },
                  { lbl: 'Gender *', key: 'gender', comp: <Select size="large" value={ci.gender} onChange={v => setField('clientInfo', 'gender', v)} style={{ width: '100%' }}><Option value="Male">Male</Option><Option value="Female">Female</Option></Select> },
                  { lbl: 'Date of Birth *', key: 'dob', comp: <DatePicker size="large" value={ci.dateOfBirth} onChange={d => setField('clientInfo', 'dateOfBirth', d)} style={{ width: '100%' }} format="DD/MM/YYYY" status={err('ci.dateOfBirth')} /> },
                  { lbl: 'Nationality *', key: 'nationality', comp: <Input size="large" value={ci.nationality} onChange={e => setField('clientInfo', 'nationality', e.target.value)} placeholder="e.g. Indian" status={err('ci.nationality')} /> },
                  { lbl: 'Marital Status', key: 'marital', comp: <Select size="large" value={ci.maritalStatus} onChange={v => setField('clientInfo', 'maritalStatus', v)} style={{ width: '100%' }}>{['Single', 'Married', 'Divorced', 'Widowed'].map(s => <Option key={s} value={s}>{s}</Option>)}</Select> },
                  { lbl: 'Email *', key: 'email', comp: <Input size="large" value={ci.email} onChange={e => setField('clientInfo', 'email', e.target.value)} placeholder="email@example.com" status={err('ci.email')} /> },
                  { lbl: 'Mobile *', key: 'mobile', comp: <Input size="large" value={ci.mobile} onChange={e => setField('clientInfo', 'mobile', e.target.value)} placeholder="+971 XX XXX XXXX" status={err('ci.mobile')} /> },
                  { lbl: 'WhatsApp', key: 'wa', comp: <Input size="large" value={ci.whatsapp} onChange={e => setField('clientInfo', 'whatsapp', e.target.value)} placeholder="+971 XX XXX XXXX" /> },
                  { lbl: 'No. of Dependents', key: 'dep', comp: <InputNumber size="large" value={ci.numberOfDependents} onChange={v => setField('clientInfo', 'numberOfDependents', v || 0)} style={{ width: '100%' }} min={0} max={20} /> },
                ].map(({ lbl, key, comp }) => (
                  <Col xs={24} sm={12} md={8} key={key}>
                    <Text strong style={{ display: 'block', marginBottom: 4, fontSize: 13 }}>{lbl}</Text>
                    {comp}
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
          <Col span={24}>
            <Card title="Employment Details" style={{ borderRadius: 14 }} bodyStyle={{ padding: 20 }}>
              <Row gutter={[16, 14]}>
                {[
                  { lbl: 'Employer Name *', comp: <Input size="large" value={emp.employerName} onChange={e => setField('employmentDetails', 'employerName', e.target.value)} placeholder="Company name" status={err('emp.name')} /> },
                  { lbl: 'Designation *', comp: <Input size="large" value={emp.designation} onChange={e => setField('employmentDetails', 'designation', e.target.value)} placeholder="Job title" status={err('emp.des')} /> },
                  { lbl: 'Employment Type', comp: <Select size="large" value={emp.employmentType} onChange={v => setField('employmentDetails', 'employmentType', v)} style={{ width: '100%' }}><Option value="Salaried">Salaried</Option><Option value="Self-Employed">Self-Employed</Option></Select> },
                  { lbl: 'Industry', comp: <Select size="large" value={emp.industry} onChange={v => setField('employmentDetails', 'industry', v)} style={{ width: '100%' }} placeholder="Select industry" allowClear>{['Banking & Finance', 'Real Estate', 'Technology', 'Healthcare', 'Education', 'Government', 'Retail', 'Construction', 'Other'].map(i => <Option key={i} value={i}>{i}</Option>)}</Select> },
                  { lbl: 'Years with Employer', comp: <InputNumber size="large" value={emp.yearsWithEmployer} onChange={v => setField('employmentDetails', 'yearsWithEmployer', v)} style={{ width: '100%' }} min={0} max={50} placeholder="Years" /> },
                  { lbl: 'Probation Period', comp: <Select size="large" value={emp.probationPeriod} onChange={v => setField('employmentDetails', 'probationPeriod', v)} style={{ width: '100%' }}>{['Completed', 'Ongoing', 'Not Applicable'].map(s => <Option key={s} value={s}>{s}</Option>)}</Select> },
                  { lbl: 'Work Email', comp: <Input size="large" value={emp.employerEmail} onChange={e => setField('employmentDetails', 'employerEmail', e.target.value)} placeholder="work@company.com" /> },
                ].map(({ lbl, comp }, i) => (
                  <Col xs={24} sm={12} md={8} key={i}>
                    <Text strong style={{ display: 'block', marginBottom: 4, fontSize: 13 }}>{lbl}</Text>
                    {comp}
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>
        <NavBar
          onBack={() => setStep(s => s - 1)}
          onNext={() => { if (validateClient()) setStep(s => s + 1); }}
          nextLabel="Income & DBR →"
        />
      </div>
    );
  };

  // ─── I: Shared Case Form — Step: Income & DBR ────────────────────
  const renderIncomeDBR = () => {
    const inc = caseData.incomeDetails;
    const exp = caseData.expenseDetails;
    const dbr = exp.dbrPercentage || 0;
    const dbrColor = dbr <= 50 ? G : dbr <= 60 ? GD : '#ef4444';
    return (
      <div style={{ animation: 'fadeIn .4s' }}>
        <Title level={4} style={{ color: P, marginBottom: 24 }}>Income & Financial Assessment</Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={15}>
            <Card title="Income Breakdown" style={{ borderRadius: 14, marginBottom: 16 }} bodyStyle={{ padding: 20 }}>
              <Row gutter={[16, 14]}>
                {[
                  ['Basic Salary (Monthly) *', inc.basicSalary, v => setIncome('basicSalary', v)],
                  ['Housing Allowance', inc.housingAllowance, v => setIncome('housingAllowance', v)],
                  ['Transport Allowance', inc.transportAllowance, v => setIncome('transportAllowance', v)],
                  ['Other Allowances', inc.otherAllowances, v => setIncome('otherAllowances', v)],
                  ['Annual Bonus', inc.annualBonus, v => setField('incomeDetails', 'annualBonus', v || 0)],
                  ['Other Income', inc.otherIncome, v => setField('incomeDetails', 'otherIncome', v || 0)],
                ].map(([lbl, val, onChange]) => (
                  <Col xs={24} sm={12} key={lbl}>
                    <Text strong style={{ display: 'block', marginBottom: 4, fontSize: 13 }}>{lbl}</Text>
                    <InputNumber size="large" value={val} onChange={onChange} style={{ width: '100%' }} formatter={aedFmt} parser={aedPrs} min={0} />
                  </Col>
                ))}
                <Col span={24}>
                  <div style={{ background: PL, borderRadius: 10, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong style={{ color: P }}>Total Monthly Income</Text>
                    <Text strong style={{ color: P, fontSize: 20 }}>AED {(inc.totalMonthlyIncome || 0).toLocaleString()}</Text>
                  </div>
                </Col>
              </Row>
            </Card>
            <Card title="Monthly Expenses" style={{ borderRadius: 14, marginBottom: 16 }} bodyStyle={{ padding: 20 }}>
              <Row gutter={[16, 14]}>
                {[
                  ['Monthly Rent', exp.monthlyRent, v => setField('expenseDetails', 'monthlyRent', v || 0)],
                  ['Credit Card Payments', exp.monthlyCreditCardPayments, v => setField('expenseDetails', 'monthlyCreditCardPayments', v || 0)],
                  ['Monthly Living Expenses', exp.monthlyLivingExpenses, v => setField('expenseDetails', 'monthlyLivingExpenses', v || 0)],
                ].map(([lbl, val, onChange]) => (
                  <Col xs={24} sm={12} key={lbl}>
                    <Text strong style={{ display: 'block', marginBottom: 4, fontSize: 13 }}>{lbl}</Text>
                    <InputNumber size="large" value={val} onChange={onChange} style={{ width: '100%' }} formatter={aedFmt} parser={aedPrs} min={0} />
                  </Col>
                ))}
              </Row>
            </Card>
            <Card
              title="Existing Loans & Liabilities"
              extra={<Button type="primary" icon={<PlusOutlined />} style={{ background: P }} onClick={() => { setEditingLoan(null); loanForm.resetFields(); setShowLoanModal(true); }}>Add Loan</Button>}
              style={{ borderRadius: 14 }} bodyStyle={{ padding: 0 }}
            >
              <Table
                dataSource={exp.existingLoans}
                rowKey={(_, i) => i}
                pagination={false}
                scroll={{ x: 700 }}
                locale={{ emptyText: 'No existing loans' }}
                columns={[
                  { title: 'Type', dataIndex: 'type', render: v => <Tag color="blue">{v}</Tag> },
                  { title: 'Bank', dataIndex: 'bank' },
                  { title: 'Outstanding', dataIndex: 'outstandingAmount', render: v => `AED ${(v || 0).toLocaleString()}` },
                  { title: 'Monthly EMI', dataIndex: 'monthlyInstallment', render: v => `AED ${(v || 0).toLocaleString()}` },
                  { title: 'Rem. Months', dataIndex: 'tenureRemainingMonths' },
                  { title: '', key: 'act', render: (_, __, i) => <Space><Button size="small" icon={<EditOutlined />} onClick={() => { loanForm.setFieldsValue(exp.existingLoans[i]); setEditingLoan(i); setShowLoanModal(true); }} /><Button size="small" danger icon={<DeleteOutlined />} onClick={() => { setCaseData(p => { const loans = p.expenseDetails.existingLoans.filter((_, j) => j !== i); return { ...p, expenseDetails: { ...p.expenseDetails, existingLoans: loans, monthlyOtherLoanInstallments: loans.reduce((s, l) => s + (l.monthlyInstallment || 0), 0) } }; }); }} /></Space> },
                ]}
              />
            </Card>
          </Col>
          <Col xs={24} lg={9}>
            <Card title={<span><LineChartOutlined style={{ color: P }} /> DBR Analysis</span>} style={{ borderRadius: 14, position: 'sticky', top: 24 }} headStyle={{ background: PL }}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <Progress
                  type="dashboard" percent={Math.min(dbr, 100)}
                  strokeColor={dbrColor} width={160} strokeWidth={12}
                  format={() => (
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: dbrColor }}>{dbr.toFixed(1)}%</div>
                      <div style={{ fontSize: 11, color: '#888' }}>DBR Score</div>
                    </div>
                  )}
                />
              </div>
              <div style={{ background: '#f8f8f8', borderRadius: 10, padding: '12px 16px', marginBottom: 14 }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Monthly Income</Text>
                    <div style={{ fontWeight: 700, color: G, fontSize: 16 }}>AED {(inc.totalMonthlyIncome || 0).toLocaleString()}</div>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Total Liabilities</Text>
                    <div style={{ fontWeight: 700, color: '#ef4444', fontSize: 16 }}>AED {(exp.totalMonthlyLiabilities || 0).toLocaleString()}</div>
                  </Col>
                </Row>
              </div>
              <Alert
                message={exp.dbrStatus === 'Eligible' ? '✅ Eligible' : exp.dbrStatus === 'Borderline' ? '⚠️ Borderline' : '❌ Not Eligible'}
                description={exp.dbrStatus === 'Eligible' ? 'DBR within limits. Loan approval likely.' : exp.dbrStatus === 'Borderline' ? 'DBR borderline. May need extra docs.' : 'DBR too high. Reduce liabilities.'}
                type={exp.dbrStatus === 'Eligible' ? 'success' : exp.dbrStatus === 'Borderline' ? 'warning' : 'error'}
                showIcon style={{ marginBottom: 14 }}
              />
              <Divider />
              <Text strong style={{ display: 'block', marginBottom: 8 }}>DBR Guidelines (UAE)</Text>
              {[['≤ 50%', 'Eligible (Expat)', 'green'], ['≤ 55%', 'Eligible (UAE National)', 'green'], ['50–60%', 'Borderline', 'orange'], ['> 60%', 'Ineligible', 'red']].map(([range, lbl, color]) => (
                <div key={range} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <Tag color={color} style={{ minWidth: 60, textAlign: 'center' }}>{range}</Tag>
                  <Text style={{ fontSize: 12 }}>{lbl}</Text>
                </div>
              ))}
            </Card>
          </Col>
        </Row>
        <NavBar
          onBack={() => setStep(s => s - 1)}
          onNext={() => { if (validateIncome()) setStep(s => s + 1); }}
          nextLabel="Property & Loan →"
        />
      </div>
    );
  };

  // ─── J: Shared Case Form — Step: Property & Loan ─────────────────
  const renderPropertyLoan = () => {
    const pi = caseData.propertyInfo;
    const li = caseData.loanInfo;
    const isProposalFlow = flow === F_PC;
    return (
      <div style={{ animation: 'fadeIn .4s' }}>
        <Title level={4} style={{ color: P, marginBottom: 24 }}>Property & Loan Details</Title>
        <Row gutter={[24, 20]}>
          <Col span={24}>
            <Card title="Property Information" style={{ borderRadius: 14 }} bodyStyle={{ padding: 20 }}>
              <Row gutter={[16, 14]}>
                {[
                  ['Property Type', <Select size="large" value={pi.propertyType} onChange={v => setField('propertyInfo', 'propertyType', v)} style={{ width: '100%' }}>{['Ready', 'Off-plan', 'Commercial'].map(t => <Option key={t} value={t}>{t}</Option>)}</Select>],
                  ['Property Subtype', <Select size="large" value={pi.propertySubtype} onChange={v => setField('propertyInfo', 'propertySubtype', v)} style={{ width: '100%' }}>{['Apartment', 'Villa', 'Townhouse', 'Penthouse'].map(t => <Option key={t} value={t}>{t}</Option>)}</Select>],
                  ['Property Value *', <InputNumber size="large" value={pi.propertyValue} onChange={v => setField('propertyInfo', 'propertyValue', v || 0)} style={{ width: '100%' }} formatter={aedFmt} parser={aedPrs} min={0} />],
                  ['Down Payment', <InputNumber size="large" value={pi.downPayment} onChange={v => setField('propertyInfo', 'downPayment', v || 0)} style={{ width: '100%' }} formatter={aedFmt} parser={aedPrs} min={0} />],
                  ['Building Name', <Input size="large" value={pi.propertyAddress?.building} onChange={e => setNested('propertyInfo', 'propertyAddress', 'building', e.target.value)} placeholder="Building name" />],
                  ['Area / Community', <Input size="large" value={pi.propertyAddress?.area} onChange={e => setNested('propertyInfo', 'propertyAddress', 'area', e.target.value)} placeholder="e.g. Downtown Dubai" />],
                  ['Bedrooms', <InputNumber size="large" value={pi.propertyDetails?.bedrooms} onChange={v => setNested('propertyInfo', 'propertyDetails', 'bedrooms', v)} style={{ width: '100%' }} min={0} max={20} placeholder="No. of bedrooms" />],
                  ['Bathrooms', <InputNumber size="large" value={pi.propertyDetails?.bathrooms} onChange={v => setNested('propertyInfo', 'propertyDetails', 'bathrooms', v)} style={{ width: '100%' }} min={0} max={20} />],
                  ['Area (sqft)', <InputNumber size="large" value={pi.propertyDetails?.areaSqft} onChange={v => setNested('propertyInfo', 'propertyDetails', 'areaSqft', v)} style={{ width: '100%' }} min={0} />],
                  ['Down Payment Source', <Input size="large" value={pi.downPaymentSource} onChange={e => setField('propertyInfo', 'downPaymentSource', e.target.value)} placeholder="e.g. Personal savings" />],
                ].map(([lbl, comp], i) => (
                  <Col xs={24} sm={12} md={6} key={i}>
                    <Text strong style={{ display: 'block', marginBottom: 4, fontSize: 13 }}>{lbl}</Text>
                    {comp}
                  </Col>
                ))}
              </Row>
              {/* Calculated summary */}
              <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
                {[['Loan Amount', `AED ${(pi.loanAmount || 0).toLocaleString()}`, P], ['LTV %', `${pi.ltvPercentage || 0}%`, GD], ['DLD Fee', `AED ${(pi.transactionDetails?.dldFees || 0).toLocaleString()}`, '#6b7280']].map(([lbl, val, color]) => (
                  <div key={lbl} style={{ flex: 1, minWidth: 140, background: '#f9fafb', borderRadius: 10, padding: '10px 14px', border: `1px solid #e5e7eb` }}>
                    <Text style={{ fontSize: 11, color: '#9ca3af', display: 'block' }}>{lbl} (auto)</Text>
                    <Text strong style={{ color, fontSize: 15 }}>{val}</Text>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
          <Col span={24}>
            <Card title="Loan Details" style={{ borderRadius: 14 }} bodyStyle={{ padding: 20 }}>
              <Row gutter={[16, 14]}>
                <Col xs={24} sm={12} md={6}>
                  <Text strong style={{ display: 'block', marginBottom: 4, fontSize: 13 }}>Selected Bank</Text>
                  {isProposalFlow
                    ? <Input size="large" value={li.selectedBank} disabled />
                    : <Input size="large" value={li.selectedBank} onChange={e => setField('loanInfo', 'selectedBank', e.target.value)} placeholder="Bank name" />}
                </Col>
                {[
                  ['Interest Rate (%) *', <InputNumber size="large" value={li.interestRatePercentage} onChange={v => setField('loanInfo', 'interestRatePercentage', v || 0)} style={{ width: '100%' }} step={0.01} min={0} max={25} precision={2} />],
                  ['Tenure (Years)', <InputNumber size="large" value={li.tenureYears} onChange={v => setField('loanInfo', 'tenureYears', v || 25)} style={{ width: '100%' }} min={5} max={30} />],
                  ['Interest Rate Type', <Select size="large" value={li.interestRateType} onChange={v => setField('loanInfo', 'interestRateType', v)} style={{ width: '100%' }}><Option value="Fixed">Fixed</Option><Option value="Variable">Variable</Option></Select>],
                  ['Processing Fee', <InputNumber size="large" value={li.processingFee} onChange={v => setField('loanInfo', 'processingFee', v || 0)} style={{ width: '100%' }} formatter={aedFmt} parser={aedPrs} min={0} />],
                  ['Valuation Fee', <InputNumber size="large" value={li.valuationFee} onChange={v => setField('loanInfo', 'valuationFee', v || 2500)} style={{ width: '100%' }} formatter={aedFmt} parser={aedPrs} min={0} />],
                ].map(([lbl, comp], i) => (
                  <Col xs={24} sm={12} md={6} key={i}>
                    <Text strong style={{ display: 'block', marginBottom: 4, fontSize: 13 }}>{lbl}</Text>
                    {comp}
                  </Col>
                ))}
                {/* Calculated EMI */}
                <Col span={24}>
                  <div style={{ background: `linear-gradient(135deg, ${PL} 0%, #fff 100%)`, border: `1px solid ${P}25`, borderRadius: 12, padding: '14px 20px', display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                    {[['Monthly EMI', `AED ${(li.monthlyInstallment?.principalAndInterest || 0).toLocaleString()}`, P], ['Total Upfront Cost', `AED ${(pi.transactionDetails?.totalClosingCosts || 0).toLocaleString()}`, GD], ['Requested Amount', `AED ${(li.requestedAmount || 0).toLocaleString()}`, G]].map(([lbl, val, color]) => (
                      <div key={lbl}>
                        <Text style={{ fontSize: 11, color: '#9ca3af', display: 'block' }}>{lbl} (calculated)</Text>
                        <Text strong style={{ color, fontSize: 18 }}>{val}</Text>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <NavBar
          onBack={() => setStep(s => s - 1)}
          onNext={() => { if (validateProperty()) setStep(s => s + 1); }}
          nextLabel="Review & Submit →"
        />
      </div>
    );
  };

  // ─── K: Review & Submit ───────────────────────────────────────────
  const renderReviewSubmit = () => {
    const ci = caseData.clientInfo;
    const pi = caseData.propertyInfo;
    const li = caseData.loanInfo;
    const exp = caseData.expenseDetails;
    return (
      <div style={{ animation: 'fadeIn .4s' }}>
        <Title level={4} style={{ color: P, marginBottom: 24 }}>Review & Create Case</Title>
        <Row gutter={[24, 20]}>
          <Col xs={24} lg={12}>
            <Card title="Internal Notes (Xoto Team Only)" style={{ borderRadius: 14 }} bodyStyle={{ padding: 20 }}>
              <TextArea rows={6} value={caseData.internalNotes} onChange={e => setCaseData(p => ({ ...p, internalNotes: e.target.value }))} placeholder="Notes for Xoto ops team..." style={{ borderRadius: 8, fontSize: 14 }} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Customer Notes (Visible to Customer)" style={{ borderRadius: 14 }} bodyStyle={{ padding: 20 }}>
              <TextArea rows={6} value={caseData.customerNotes} onChange={e => setCaseData(p => ({ ...p, customerNotes: e.target.value }))} placeholder="Notes shared with the customer..." style={{ borderRadius: 8, fontSize: 14 }} />
            </Card>
          </Col>
          <Col span={24}>
            <Card title="Case Summary" style={{ borderRadius: 14 }} headStyle={{ background: PL }}>
              <Row gutter={[20, 20]}>
                {[
                  ['Case Reference', caseData.caseReference],
                  ['Client Name', ci.fullName || '—'],
                  ['Property Value', `AED ${(pi.propertyValue || 0).toLocaleString()}`],
                  ['Loan Amount', `AED ${(pi.loanAmount || 0).toLocaleString()}`],
                  ['Down Payment', `AED ${(pi.downPayment || 0).toLocaleString()}`],
                  ['Selected Bank', li.selectedBank || '—'],
                  ['Interest Rate', `${li.interestRatePercentage || 0}%`],
                  ['Tenure', `${li.tenureYears || 25} Years`],
                  ['LTV', `${pi.ltvPercentage || 0}%`],
                  ['Monthly EMI', `AED ${(li.monthlyInstallment?.principalAndInterest || 0).toLocaleString()}`],
                  ['DBR', `${exp.dbrPercentage || 0}%`],
                  ['DBR Status', exp.dbrStatus],
                ].map(([lbl, val]) => (
                  <Col xs={12} sm={8} md={6} key={lbl}>
                    <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>{lbl}</Text>
                    <Text strong style={{ fontSize: 14 }}>{val}</Text>
                  </Col>
                ))}
              </Row>
              <Divider />
              <Alert message="Documents from Lead will be automatically copied to this case." type="info" showIcon style={{ marginBottom: 10 }} />
              <Alert message="Eligibility snapshot from the lead stage will be preserved." type="success" showIcon />
            </Card>
          </Col>
        </Row>
        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: 20 }}>
          <Button size="large" onClick={() => setStep(s => s - 1)} style={{ borderRadius: 8, height: 46, padding: '0 28px' }}>
            <ArrowLeftOutlined /> Previous
          </Button>
          <Button type="primary" size="large" loading={submitting} onClick={submitCase} style={{ background: G, borderColor: G, borderRadius: 8, height: 46, padding: '0 36px', fontWeight: 700 }} icon={<SaveOutlined />}>
            {submitting ? 'Creating Case...' : 'Create Case'}
          </Button>
        </div>
      </div>
    );
  };

  // ─── L: Case Success Screen ───────────────────────────────────────
  const renderCaseSuccess = () => {
    const docStatus = caseDocStatus;
    const completionPct = docStatus?.completionPercentage || 0;
    const uploaded = docStatus?.documentsUploadedCount || 0;
    const required = docStatus?.requiredDocuments?.length || 0;
    const pending = docStatus?.pendingDocumentTypes || [];
    return (
      <div style={{ animation: 'fadeIn .5s', textAlign: 'center' }}>
        <div style={{ background: `linear-gradient(135deg, ${P} 0%, ${PM} 100%)`, borderRadius: 20, padding: '40px 32px', color: '#fff', marginBottom: 28 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>✅</div>
          <Title level={2} style={{ color: '#fff', margin: '0 0 8px' }}>Case Created Successfully!</Title>
          <div style={{ fontSize: 16, opacity: 0.85, marginBottom: 20 }}>{caseData.caseReference}</div>
          <Row gutter={[16, 12]} style={{ maxWidth: 600, margin: '0 auto' }}>
            {[['Client', caseData.clientInfo.fullName], ['Bank', caseData.loanInfo.selectedBank || '—'], ['Loan', `AED ${(caseData.propertyInfo.loanAmount || 0).toLocaleString()}`], ['Rate', `${caseData.loanInfo.interestRatePercentage || 0}%`]].map(([lbl, val]) => (
              <Col span={6} key={lbl}>
                <div style={{ background: 'rgba(255,255,255,.15)', borderRadius: 10, padding: '10px 8px' }}>
                  <div style={{ fontSize: 11, opacity: 0.75 }}>{lbl}</div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{val}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Document Status */}
        <Card title={<span><FileTextOutlined style={{ color: P, marginRight: 8 }} />Document Status</span>} style={{ borderRadius: 16, marginBottom: 20, textAlign: 'left' }} headStyle={{ background: PL }}>
          {fetchingDocStatus ? <div style={{ textAlign: 'center', padding: 30 }}><Spin size="large" /></div> : (
            <>
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text strong>Document Completion</Text>
                  <Text strong style={{ color: P }}>{completionPct.toFixed(0)}%</Text>
                </div>
                <Progress percent={completionPct} strokeColor={P} trailColor="#e5e7eb" />
                <div style={{ display: 'flex', gap: 20, marginTop: 10, flexWrap: 'wrap' }}>
                  {[['Uploaded', uploaded, G], ['Required', required, P], ['Pending', pending.length, '#ef4444']].map(([lbl, val, color]) => (
                    <div key={lbl} style={{ display: 'flex', align: 'center', gap: 6 }}>
                      <Text style={{ color, fontWeight: 700, fontSize: 16 }}>{val}</Text>
                      <Text type="secondary" style={{ fontSize: 13 }}>{lbl}</Text>
                    </div>
                  ))}
                </div>
              </div>
              {docStatus?.requiredDocuments?.length > 0 && (
                <>
                  <Divider style={{ margin: '12px 0' }} />
                  <Row gutter={[12, 12]}>
                    {docStatus.requiredDocuments.map((doc, i) => (
                      <Col xs={24} sm={12} md={8} key={i}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: doc.isUploaded ? '#f0fdf4' : '#fef2f2', borderRadius: 8, border: `1px solid ${doc.isUploaded ? '#bbf7d0' : '#fecaca'}` }}>
                          {doc.isVerified
                            ? <CheckSquareOutlined style={{ color: G, fontSize: 16 }} />
                            : doc.isUploaded
                            ? <CheckCircleOutlined style={{ color: '#16a34a', fontSize: 16 }} />
                            : <ClockCircleOutlined style={{ color: '#ef4444', fontSize: 16 }} />}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <Text style={{ fontSize: 12, textTransform: 'capitalize', display: 'block' }}>{doc.documentType?.replace(/_/g, ' ')}</Text>
                            <Tag style={{ fontSize: 10, padding: '0 5px', marginTop: 2 }} color={doc.isVerified ? 'success' : doc.isUploaded ? 'processing' : 'error'}>
                              {doc.isVerified ? 'Verified' : doc.isUploaded ? 'Uploaded' : 'Pending'}
                            </Tag>
                          </div>
                          {doc.isRequired && !doc.isUploaded && <ExclamationCircleOutlined style={{ color: '#f59e0b', fontSize: 14 }} />}
                        </div>
                      </Col>
                    ))}
                  </Row>
                </>
              )}
              {pending.length > 0 && (
                <Alert
                  style={{ marginTop: 16, borderRadius: 10 }}
                  message={`${pending.length} documents still pending`}
                  description={`Missing: ${pending.map(d => d.replace(/_/g, ' ')).join(', ')}`}
                  type="warning" showIcon
                />
              )}
            </>
          )}
        </Card>

        <Space size={16}>
          <Button size="large" onClick={reset} style={{ borderRadius: 10, padding: '0 28px', height: 46 }}>
            Create Another Case
          </Button>
        </Space>
      </div>
    );
  };

  // ─── M: Proposal Success Screen ───────────────────────────────────
  const renderProposalSuccess = () => (
    <div style={{ animation: 'fadeIn .5s', textAlign: 'center' }}>
      <div style={{ background: `linear-gradient(135deg, ${G} 0%, #10b981 100%)`, borderRadius: 20, padding: '40px 32px', color: '#fff', marginBottom: 28 }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
        <Title level={2} style={{ color: '#fff', margin: '0 0 8px' }}>Proposal Created!</Title>
        <Text style={{ color: 'rgba(255,255,255,.85)', fontSize: 16 }}>The proposal has been sent to the customer for review.</Text>
        <div style={{ marginTop: 20, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['Customer', selectedLead?.customerInfo?.fullName], ['Banks', `${selectedBanks.length} options`], ['Best Rate', `${offers?.bestRate || 0}%`]].map(([lbl, val]) => (
            <div key={lbl} style={{ background: 'rgba(255,255,255,.18)', borderRadius: 12, padding: '12px 20px' }}>
              <div style={{ fontSize: 11, opacity: 0.75 }}>{lbl}</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
      <Card style={{ borderRadius: 16, marginBottom: 20, background: PL, border: `1px solid ${P}25` }}>
        <Title level={4} style={{ color: P }}>What's next?</Title>
        <Text style={{ fontSize: 14, color: '#4c1d95' }}>
          Once the customer accepts the proposal, you can convert it into a formal case. 
          You can also create a case directly from this page using "Case from Accepted Proposal".
        </Text>
      </Card>
      <Space size={16}>
        <Button type="primary" size="large" onClick={() => { reset(); setFlow(F_PC); }} style={{ background: P, borderColor: P, borderRadius: 10, padding: '0 28px', height: 46 }}>
          <FileDoneOutlined /> Create Case from Proposal
        </Button>
        <Button size="large" onClick={reset} style={{ borderRadius: 10, padding: '0 28px', height: 46 }}>
          Back to Options
        </Button>
      </Space>
    </div>
  );

  // ══ Step router ═══════════════════════════════════════════════════
  const renderCurrentStep = () => {
    if (!flow) return renderModeSelection();
    if (step === 'success') return renderCaseSuccess();
    if (step === 'proposal_success') return renderProposalSuccess();

    if (flow === F_PC) {
      if (step === 0) return renderPC_SelectProposal();
      if (step === 1) return renderPC_BankPicker();
      if (step === 2) return renderClientInfo();
      if (step === 3) return renderIncomeDBR();
      if (step === 4) return renderPropertyLoan();
      if (step === 5) return renderReviewSubmit();
    }
    if (flow === F_DC) {
      if (step === 0) return renderLeadSelect();
      if (step === 1) return renderLeadReview();
      if (step === 2) return renderSelectBanks();
      if (step === 3) return renderViewOffers();
      if (step === 4) return renderClientInfo();
      if (step === 5) return renderIncomeDBR();
      if (step === 6) return renderPropertyLoan();
      if (step === 7) return renderReviewSubmit();
    }
    if (flow === F_CP) {
      if (step === 0) return renderLeadSelect();
      if (step === 1) return renderLeadReview();
      if (step === 2) return renderSelectBanks();
      if (step === 3) return renderViewOffers();
      if (step === 4) return renderProposalFinalize();
    }
    return null;
  };

  const currentStepsConfig = flow ? (stepsConfig[flow] || []) : [];
  const showSteps = flow && typeof step === 'number' && step < currentStepsConfig.length;

  // ══ Main Render ════════════════════════════════════════════════════
  return (
    <div style={{ padding: 24, background: '#fdfbff', minHeight: '100vh' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .ant-steps-item-finish .ant-steps-item-icon { background: ${P}; border-color: ${P}; }
        .ant-steps-item-process .ant-steps-item-icon { background: ${P}; border-color: ${P}; }
      `}</style>

      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${P}, ${PM})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RocketOutlined style={{ color: '#fff', fontSize: 22 }} />
          </div>
          <div>
            <Title level={2} style={{ margin: 0, color: '#1e1b4b', fontWeight: 800 }}>
              {!flow ? 'Create Case / Proposal'
                : flow === F_PC ? 'Case from Accepted Proposal'
                : flow === F_DC ? 'Direct Case from Lead'
                : 'Create Mortgage Proposal'}
            </Title>
            <Text type="secondary">
              {!flow ? 'Choose your workflow below'
                : flow === F_PC ? 'Converting proposal → formal case'
                : flow === F_DC ? 'Lead → bank selection → offer → case'
                : 'Lead → bank comparison → proposal'}
            </Text>
          </div>
          {flow && (
            <Button style={{ marginLeft: 'auto', borderRadius: 8 }} onClick={reset}>
              ← Back to Options
            </Button>
          )}
        </div>
      </div>

      <Card style={{ borderRadius: 20, boxShadow: '0 4px 24px rgba(92,3,155,.06)', border: `1px solid ${P}10` }}>
        {/* Steps indicator */}
        {showSteps && (
          <div style={{ marginBottom: 36, padding: '0 4px' }}>
            <Steps
              current={typeof step === 'number' ? step : 0}
              items={currentStepsConfig.map((title, i) => ({
                title,
                status: typeof step === 'number' && step > i ? 'finish' : typeof step === 'number' && step === i ? 'process' : 'wait',
              }))}
            />
          </div>
        )}
        <div style={{ minHeight: 480 }}>
          {renderCurrentStep()}
        </div>
      </Card>

      {/* ── Loan Modal ────────────────────────────────────── */}
      <Modal
        title={editingLoan !== null ? 'Edit Loan' : 'Add Existing Loan'}
        open={showLoanModal}
        onCancel={() => { setShowLoanModal(false); setEditingLoan(null); loanForm.resetFields(); }}
        footer={[
          <Button key="c" onClick={() => { setShowLoanModal(false); setEditingLoan(null); loanForm.resetFields(); }}>Cancel</Button>,
          <Button key="s" type="primary" onClick={handleAddLoan} style={{ background: P }}>
            {editingLoan !== null ? 'Update' : 'Add'} Loan
          </Button>,
        ]}
        width={560}
      >
        <Form form={loanForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="type" label="Loan Type" rules={[{ required: true }]}>
            <Select size="large"><Option value="Car Loan">Car Loan</Option><Option value="Personal Loan">Personal Loan</Option><Option value="Other">Other</Option></Select>
          </Form.Item>
          <Form.Item name="bank" label="Bank / Institution" rules={[{ required: true }]}>
            <Input size="large" placeholder="Bank name" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="outstandingAmount" label="Outstanding Amount" rules={[{ required: true }]}>
                <InputNumber size="large" style={{ width: '100%' }} formatter={aedFmt} parser={aedPrs} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="monthlyInstallment" label="Monthly Installment" rules={[{ required: true }]}>
                <InputNumber size="large" style={{ width: '100%' }} formatter={aedFmt} parser={aedPrs} min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="tenureRemainingMonths" label="Remaining Tenure (Months)" rules={[{ required: true }]}>
            <InputNumber size="large" style={{ width: '100%' }} min={1} max={360} />
          </Form.Item>
        </Form>
      </Modal>

      {/* ── Document Viewer Modal ─────────────────────────── */}
      <Modal
        title="Document Viewer"
        open={!!viewingDoc}
        onCancel={() => setViewingDoc(null)}
        footer={[
          <Button key="close" onClick={() => setViewingDoc(null)}>Close</Button>,
          <Button key="open" type="primary" style={{ background: P }} href={viewingDoc?.fileUrl} target="_blank">Open in New Tab</Button>,
        ]}
        width={860} centered bodyStyle={{ padding: 0, height: '65vh' }}
      >
        {viewingDoc && (
          viewingDoc.mimeType === 'application/pdf'
            ? <iframe src={viewingDoc.fileUrl} style={{ width: '100%', height: '100%', border: 'none' }} title="Document" />
            : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 20 }}>
              <img src={viewingDoc.fileUrl} alt="doc" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
        )}
      </Modal>
    </div>
  );
};

// ── NavBar helper component ──────────────────────────────────────────
const NavBar = ({ onBack, onNext, backLabel = '← Previous', nextLabel = 'Continue →', nextDisabled = false, nextLoading = false, nextIcon }) => (
  <div style={{ marginTop: 36, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: 20 }}>
    {onBack
      ? <Button size="large" onClick={onBack} style={{ borderRadius: 8, height: 46, padding: '0 28px' }}>{backLabel}</Button>
      : <div />}
    {onNext && (
      <Button
        type="primary" size="large"
        onClick={onNext}
        disabled={nextDisabled}
        loading={nextLoading}
        icon={nextIcon}
        style={{ background: nextDisabled ? '#d1d5db' : P, borderColor: nextDisabled ? '#d1d5db' : P, borderRadius: 8, height: 46, padding: '0 32px', fontWeight: 600 }}
      >
        {nextLabel}
      </Button>
    )}
  </div>
);

export default CreateCase;