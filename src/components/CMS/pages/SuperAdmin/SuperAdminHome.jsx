import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Row, Col, Typography, Statistic, Spin, Tag, Badge } from 'antd';
import {
  TeamOutlined, HomeOutlined, CheckCircleOutlined,
  FileTextOutlined, ArrowUpOutlined, ArrowRightOutlined
} from '@ant-design/icons';
import { apiService } from '../../../../manageApi/utils/custom.apiservice';

const { Title, Text } = Typography;

const B = '/dashboard/superadmin';

// Exact URLs provided for SuperAdmin (role code 0)
// Source: permissions API (role code 0) + CUSTOM_ROLE_LINKS["0"] from Sidebar.jsx
const MODULE_GROUPS = [
  {
    group: 'System & Access',
    color: '#722ed1',
    bg: '#f9f0ff',
    icon: 'fas fa-shield-alt',
    modules: [
      { name: 'Role',            icon: 'fas fa-folder', route: `${B}/roles`,        subLinks: [] },
      { name: 'Module',          icon: 'fas fa-box',    route: `${B}/modules/list`, subLinks: [{ label: 'All Modules', path: `${B}/modules/list` }] },
      { name: 'Permission',      icon: 'fas fa-folder', route: `${B}/permission`,   subLinks: [] },
      { name: 'All Team Members',icon: 'fas fa-folder', route: `${B}/users`,        subLinks: [] },
    ],
  },
  {
    group: 'Properties & Real Estate',
    color: '#13c2c2',
    bg: '#e6fffb',
    icon: 'fas fa-building',
    modules: [
      {
        name: 'Properties',
        icon: 'fas fa-folder',
        route: `${B}/developer/create`,
        subLinks: [
          { label: 'Create Developer',    path: `${B}/developer/create` },
          { label: 'Property Management', path: `${B}/developer/property` },
        ],
      },
      {
        name: 'Rental Properties',
        icon: 'fas fa-building',
        route: `${B}/rental/propertieslist`,
        subLinks: [
          { label: 'Create Rental Properties', path: `${B}/rental/properties` },
          { label: 'Rental Properties',         path: `${B}/rental/propertieslist` },
          { label: 'Rental Lead List',           path: `${B}/rental/leadlist` },
        ],
      },
    ],
  },
  {
    group: 'Estimation & Leads',
    color: '#fa8c16',
    bg: '#fff7e6',
    icon: 'fas fa-calculator',
    modules: [
      {
        name: 'All Estimation',
        icon: 'fas fa-folder',
        route: `${B}/leads/requested`,
        subLinks: [{ label: 'Requested Estimation', path: `${B}/leads/requested` }],
      },
      {
        name: 'Estimate Master',
        icon: 'fas fa-folder',
        route: `${B}/estimate/master/categories`,
        subLinks: [
          { label: 'Category',   path: `${B}/estimate/master/categories` },
          { label: 'Gallery',    path: `${B}/master/types/gallery` },
          { label: 'Questions',  path: `${B}/estimate/questions` },
        ],
      },
      {
        name: 'Customer Acquisition',
        icon: 'fas fa-folder',
        route: `${B}/property/leads`,
        subLinks: [
          { label: 'Property Leads', path: `${B}/property/leads` },
          { label: 'Meta Leads',     path: `${B}/meta/leads` },
        ],
      },
    ],
  },
  {
    group: 'Products & Commerce',
    color: '#52c41a',
    bg: '#f6ffed',
    icon: 'fas fa-box',
    modules: [
      {
        name: 'Products',
        icon: 'fas fa-box',
        route: `${B}/products/list`,
        subLinks: [
          { label: 'List Products', path: `${B}/products/list` },
          { label: 'Brands',        path: `${B}/brands` },
          { label: 'Categories',    path: `${B}/categories` },
        ],
      },
      { name: 'Deals',   icon: 'fas fa-folder', route: `${B}/deals`,         subLinks: [] },
      { name: 'Request', icon: 'fas fa-folder', route: `${B}/sellers/list`,  subLinks: [{ label: 'All Sellers', path: `${B}/sellers/list` }] },
    ],
  },
  {
    group: 'Partners & Projects',
    color: '#1890ff',
    bg: '#e6f7ff',
    icon: 'fas fa-handshake',
    modules: [
      {
        name: 'Xoto Partners',
        icon: 'fas fa-folder',
        route: `${B}/freelancer/list`,
        subLinks: [{ label: 'All Partners', path: `${B}/freelancer/list` }],
      },
      {
        name: 'Projects',
        icon: 'fas fa-folder',
        route: `${B}/projects`,
        subLinks: [{ label: 'All Projects', path: `${B}/projects` }],
      },
    ],
  },
  {
    group: 'Finance & Settings',
    color: '#eb2f96',
    bg: '#fff0f6',
    icon: 'fas fa-cog',
    modules: [
      {
        name: 'Mortgages',
        icon: 'fas fa-folder',
        route: `${B}/create-mortgages`,
        subLinks: [{ label: 'Create Mortgages', path: `${B}/create-mortgages` }],
      },
      {
        name: 'Settings',
        icon: 'fas fa-folder',
        route: `${B}/currency`,
        subLinks: [
          { label: 'Currency', path: `${B}/currency` },
          { label: 'Tax',      path: `${B}/tax` },
        ],
      },
    ],
  },
  {
    group: 'Content & Users',
    color: '#2f54eb',
    bg: '#f0f5ff',
    icon: 'fas fa-blog',
    modules: [
      {
        name: 'Blogs',
        icon: 'fas fa-folder',
        route: `${B}/create`,
        subLinks: [{ label: 'Create Blog', path: `${B}/create` }],
      },
      {
        name: 'Customers',
        icon: 'fas fa-users',
        route: `${B}/customers/list`,
        subLinks: [{ label: 'All Customers', path: `${B}/customers/list` }],
      },
      {
        name: 'User Feedbacks',
        icon: 'fas fa-users',
        route: `${B}/feedbacks`,
        subLinks: [{ label: 'View Feedbacks', path: `${B}/feedbacks` }],
      },
    ],
  },
];

const SuperAdminHome = () => {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    apiService.get('/dashboard/view/superadmin')
      .then((res) => { if (res.success) setStats(res.data); })
      .catch(() => {})
      .finally(() => setLoadingStats(false));
  }, []);

  const statCards = [
    { label: 'Total Leads',        value: stats?.leads?.total        ?? 0, icon: <FileTextOutlined />,  color: '#722ed1', bg: '#f9f0ff' },
    { label: 'Active Partners',    value: stats?.users?.freelancers  ?? 0, icon: <TeamOutlined />,       color: '#1890ff', bg: '#e6f7ff' },
    { label: 'Total Properties',   value: stats?.properties?.total   ?? 0, icon: <HomeOutlined />,       color: '#52c41a', bg: '#f6ffed' },
    { label: 'Verified Developers',value: stats?.developers?.verified ?? 0, icon: <CheckCircleOutlined />,color: '#fa8c16', bg: '#fff7e6' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div>
          <Title level={2} style={{ margin: 0, color: '#722ed1' }}>SuperAdmin Dashboard</Title>
          <Text type="secondary">Welcome, {user?.name || 'SuperAdmin'} — Role Code: 0</Text>
        </div>
        <Tag color="default" style={{ cursor: 'pointer', padding: '4px 12px' }} onClick={() => navigate('/')}>
          ← Go to Website
        </Tag>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} className="mb-10">
        {statCards.map((s, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card bordered={false} className="shadow-sm rounded-xl">
              {loadingStats ? (
                <div className="flex justify-center py-4"><Spin /></div>
              ) : (
                <Statistic
                  title={<Text type="secondary">{s.label}</Text>}
                  value={s.value}
                  prefix={<span className="p-2 rounded-lg mr-2" style={{ backgroundColor: s.bg, color: s.color }}>{s.icon}</span>}
                />
              )}
              <div className="mt-2"><Tag color="green"><ArrowUpOutlined /> Live</Tag></div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Module Groups */}
      {MODULE_GROUPS.map((group) => (
        <div key={group.group} className="mb-10">
          <div className="flex items-center gap-3 mb-4 pb-2" style={{ borderBottom: `2px solid ${group.color}` }}>
            <div className="w-1 h-6 rounded" style={{ backgroundColor: group.color }} />
            <i className={`${group.icon} text-sm`} style={{ color: group.color }} />
            <Title level={4} style={{ margin: 0, color: group.color }}>{group.group}</Title>
            <Badge count={group.modules.length} style={{ backgroundColor: group.color }} />
          </div>

          <Row gutter={[16, 16]}>
            {group.modules.map((mod) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={mod.name}>
                <Card
                  bordered={false}
                  hoverable
                  className="shadow-sm rounded-xl h-full"
                  style={{ borderTop: `3px solid ${group.color}` }}
                  styles={{ body: { padding: '16px' } }}
                  onClick={() => navigate(mod.route)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0"
                      style={{ backgroundColor: group.color }}>
                      <i className={mod.icon} />
                    </div>
                    <Text strong style={{ fontSize: '14px' }}>{mod.name}</Text>
                  </div>

                  <div className="flex flex-col gap-1">
                    {mod.subLinks.length > 0 ? mod.subLinks.map((link) => (
                      <button key={link.path}
                        onClick={(e) => { e.stopPropagation(); navigate(link.path); }}
                        className="flex items-center gap-2 text-left text-xs py-1 px-2 rounded w-full"
                        style={{ color: group.color, border: 'none', background: 'transparent', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = group.bg}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <ArrowRightOutlined style={{ fontSize: '9px' }} />
                        {link.label}
                      </button>
                    )) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(mod.route); }}
                        className="flex items-center gap-2 text-xs py-1 px-2 rounded w-full"
                        style={{ color: group.color, border: 'none', background: 'transparent', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = group.bg}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <ArrowRightOutlined style={{ fontSize: '9px' }} />
                        Open {mod.name}
                      </button>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </div>
  );
};

export default SuperAdminHome;
