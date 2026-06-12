import React, { useState } from 'react';
import { Card, Row, Col, Typography, InputNumber, Select, Table, Divider, Statistic, Space, Button, Badge } from 'antd';
import { 
  ThunderboltOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  CalculatorOutlined, 
  BankOutlined, 
  InfoCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const PRIMARY = '#5C039B';
const GRADIENT = 'linear-gradient(135deg, #5C039B 0%, #03A4F4 100%)';

const Eibor = () => {
  // Rates list with realistic values
  const [rates] = useState([
    { tenor: 'Overnight', rate: 5.12, change: 0.01, direction: 'up', status: 'stable' },
    { tenor: '1 Week', rate: 5.21, change: -0.02, direction: 'down', status: 'stable' },
    { tenor: '1 Month', rate: 5.34, change: 0.03, direction: 'up', status: 'increasing' },
    { tenor: '3 Months', rate: 5.41, change: 0.02, direction: 'up', status: 'increasing' },
    { tenor: '6 Months', rate: 5.47, change: 0.00, direction: 'none', status: 'stable' },
    { tenor: '12 Months', rate: 5.53, change: -0.05, direction: 'down', status: 'decreasing' },
  ]);

  // Calculator state
  const [selectedTenor, setSelectedTenor] = useState(5.41); // Default to 3 Months
  const [bankMargin, setBankMargin] = useState(1.5);
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [loanTerm, setLoanTerm] = useState(25);

  // Calculate values
  const totalInterestRate = selectedTenor + bankMargin;
  const monthlyRate = (totalInterestRate / 100) / 12;
  const totalMonths = loanTerm * 12;
  const estimatedEmi = monthlyRate > 0 
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : loanAmount / totalMonths;

  // Contributing Banks table columns
  const bankColumns = [
    {
      title: 'Bank Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <BankOutlined style={{ color: PRIMARY }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Headquarters',
      dataIndex: 'hq',
      key: 'hq',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: () => <Badge status="success" text="Active Panel Member" />,
    },
  ];

  const contributingBanks = [
    { key: '1', name: 'Abu Dhabi Commercial Bank (ADCB)', hq: 'Abu Dhabi' },
    { key: '2', name: 'Emirates NBD', hq: 'Dubai' },
    { key: '3', name: 'First Abu Dhabi Bank (FAB)', hq: 'Abu Dhabi' },
    { key: '4', name: 'Mashreq Bank', hq: 'Dubai' },
    { key: '5', name: 'Commercial Bank of Dubai (CBD)', hq: 'Dubai' },
    { key: '6', name: 'Dubai Islamic Bank (DIB)', hq: 'Dubai' },
  ];

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div style={{ padding: '28px', background: '#F4F0FA', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* ── Hero Header Banner ────────────────────────────────────────── */}
      <Card 
        style={{ 
          borderRadius: 20, 
          border: '1px solid #ede9f6', 
          background: GRADIENT,
          boxShadow: '0 4px 20px rgba(92, 3, 155, 0.08)',
          marginBottom: 24,
          color: '#fff'
        }}
        bodyStyle={{ padding: 28 }}
      >
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Title level={2} style={{ margin: 0, color: '#fff', fontWeight: 800, letterSpacing: '-0.5px' }}>
              UAE EIBOR Rates Board
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: '8px 0 0' }}>
              Emirates Interbank Offered Rate (EIBOR) represents the benchmark interest rate for lending between UAE banks. 
              These rates serve as the base index for floating-rate mortgage and commercial loans in the UAE.
            </Paragraph>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Space style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)' }}>
              <CalendarOutlined style={{ color: '#fff' }} />
              <Text style={{ color: '#fff', fontWeight: 600 }}>As of: {today}</Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* ── Tenor Rates Cards ────────────────────────────────────────── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {rates.map((item) => (
          <Col xs={12} sm={12} md={8} lg={4} key={item.tenor}>
            <Card 
              hoverable
              style={{ 
                borderRadius: 16, 
                border: '1px solid #ede9f6',
                boxShadow: '0 2px 10px rgba(92,3,155,0.01)',
                transition: 'all 0.3s ease'
              }}
              bodyStyle={{ padding: '20px 16px', textAlign: 'center' }}
            >
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {item.tenor}
              </Text>
              <Title level={2} style={{ margin: '8px 0', fontWeight: 800, color: PRIMARY }}>
                {item.rate.toFixed(2)}%
              </Title>
              <Space>
                {item.direction === 'up' && <ArrowUpOutlined style={{ color: '#10b981' }} />}
                {item.direction === 'down' && <ArrowDownOutlined style={{ color: '#ef4444' }} />}
                <Text 
                  strong 
                  style={{ 
                    fontSize: 12,
                    color: item.direction === 'up' ? '#10b981' : item.direction === 'down' ? '#ef4444' : '#9ca3af' 
                  }}
                >
                  {item.change !== 0 ? `${item.change > 0 ? '+' : ''}${item.change.toFixed(2)}%` : '0.00%'}
                </Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ── Interactive Mortgage Calculator & Guide ─────────────────── */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={14}>
          <Card 
            title={<Space><CalculatorOutlined style={{ color: PRIMARY }} /><Text strong>EIBOR Loan Calculator</Text></Space>}
            style={{ borderRadius: 20, border: '1px solid #ede9f6', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
            bodyStyle={{ padding: 24 }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong style={{ display: 'block', marginBottom: 6 }}>Select EIBOR Tenor Base</Text>
                  <Select 
                    defaultValue={5.41} 
                    style={{ width: '100%' }} 
                    size="large"
                    onChange={(val) => setSelectedTenor(val)}
                  >
                    <Option value={5.34}>1 Month EIBOR (5.34%)</Option>
                    <Option value={5.41}>3 Months EIBOR (5.41%)</Option>
                    <Option value={5.47}>6 Months EIBOR (5.47%)</Option>
                    <Option value={5.53}>12 Months EIBOR (5.53%)</Option>
                  </Select>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <Text strong style={{ display: 'block', marginBottom: 6 }}>Bank Profit/Interest Margin (%)</Text>
                  <InputNumber 
                    min={0} 
                    max={10} 
                    step={0.05} 
                    value={bankMargin} 
                    style={{ width: '100%' }} 
                    size="large"
                    onChange={(val) => setBankMargin(val || 0)}
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong style={{ display: 'block', marginBottom: 6 }}>Loan Amount (AED)</Text>
                  <InputNumber 
                    min={10000} 
                    max={100000000} 
                    formatter={value => `AED ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\bAED\s?|(,*)/g, '')}
                    value={loanAmount} 
                    style={{ width: '100%' }} 
                    size="large"
                    onChange={(val) => setLoanAmount(val || 0)}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <Text strong style={{ display: 'block', marginBottom: 6 }}>Loan Duration (Years)</Text>
                  <InputNumber 
                    min={1} 
                    max={30} 
                    value={loanTerm} 
                    style={{ width: '100%' }} 
                    size="large"
                    onChange={(val) => setLoanTerm(val || 25)}
                  />
                </div>
              </Col>
            </Row>

            <Divider style={{ margin: '16px 0' }} />

            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12}>
                <Card style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
                  <Statistic 
                    title="Total Interest Rate (EIBOR + Margin)" 
                    value={totalInterestRate} 
                    precision={2} 
                    suffix="%" 
                    valueStyle={{ color: PRIMARY, fontWeight: 800 }} 
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card style={{ background: 'linear-gradient(135deg, #FAF8FF 0%, #F1EAFF 100%)', border: '1px solid #ede9f6', borderRadius: 12 }}>
                  <Statistic 
                    title="Estimated Monthly Installment" 
                    value={estimatedEmi} 
                    precision={0} 
                    prefix="AED " 
                    valueStyle={{ color: '#03A4F4', fontWeight: 800 }} 
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card 
            title={<Space><InfoCircleOutlined style={{ color: PRIMARY }} /><Text strong style={{ color: '#1e293b' }}>EIBOR Fixing and Guide</Text></Space>}
            style={{ borderRadius: 20, border: '1px solid #ede9f6', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', height: '100%' }}
          >
            <Paragraph style={{ fontSize: 13, color: '#4b5563' }}>
              <strong>How EIBOR influences mortgages:</strong><br />
              Floating rate mortgages in the UAE are typically set as <code>Base Rate (EIBOR tenor) + Bank Margin</code>. For example:
            </Paragraph>
            <ul style={{ paddingLeft: 20, fontSize: 13, color: '#4b5563', lineHeight: '1.8' }}>
              <li><strong>Reset frequency:</strong> If your loan is linked to 3 Months EIBOR, your monthly rate resets every quarter to match the updated index rate.</li>
              <li><strong>Lock-in period:</strong> Most mortgages start with a 1-to-5 year fixed rate, after which they automatically transition to follow the floating EIBOR rate.</li>
              <li><strong>Margin stability:</strong> While EIBOR changes daily, the Bank Margin is fixed inside your loan agreement for the entire tenure of the loan.</li>
            </ul>
            <Divider style={{ margin: '12px 0' }} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Note: EIBOR rates are calculated and published daily by the Central Bank of the UAE. The calculations exclude the highest and lowest bank rates submitted in the panel to obtain a realistic average interbank offer rate.
            </Text>
          </Card>
        </Col>
      </Row>

      {/* ── Contributing Panel Members Table ───────────────────────── */}
      <Card 
        title={<Space><BankOutlined style={{ color: PRIMARY }} /><Text strong>EIBOR Panel Contributing Banks</Text></Space>}
        style={{ borderRadius: 20, border: '1px solid #ede9f6', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
      >
        <Table 
          columns={bankColumns} 
          dataSource={contributingBanks} 
          pagination={false} 
          bordered={false} 
          style={{ fontFamily: "'Inter', sans-serif" }}
        />
      </Card>
    </div>
  );
};

export default Eibor;
