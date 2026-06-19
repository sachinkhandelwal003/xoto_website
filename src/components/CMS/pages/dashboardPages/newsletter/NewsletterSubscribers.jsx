import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import {
  Button, Card, Tag, Space, Typography,
  Tooltip, Popconfirm, Input, Modal, Form,
} from "antd";
import {
  MailOutlined, CheckCircleOutlined, StopOutlined,
  TeamOutlined, LinkOutlined,
} from "@ant-design/icons";
import {
  FiToggleLeft, FiToggleRight,
  FiSearch, FiRefreshCw,
} from "react-icons/fi";
import CustomTable from '../../custom/CustomTable';
import { apiService } from '../../../../../manageApi/utils/custom.apiservice';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;

const THEME = {
  primary: "#7c3aed", // violet-600
  success: "#10b981", // emerald-500
  error: "#f43f5e",   // rose-500
};

const NewsletterSubscribers = () => {
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState([]);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    itemsPerPage: 10,
  });

  // Email Modal States
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [emailModalType, setEmailModalType] = useState("individual"); // "individual" | "bulk"
  const [emailTarget, setEmailTarget] = useState(""); // email address if individual
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  const searchTimeout = useRef(null);

  // Fetch subscribers from backend
  const fetchSubscribers = useCallback(async (page = 1, limit = 10, searchVal = "") => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (searchVal?.trim()) params.search = searchVal.trim();

      const res = await apiService.get("newsletter/all", params);
      const allSubscribers = res?.data || [];

      setSubscribers(allSubscribers);
      setTotalCount(res?.total || allSubscribers.length);
      setPagination({
        currentPage: res?.page || page,
        totalPages: res?.totalPages || 1,
        totalResults: res?.total || allSubscribers.length,
        itemsPerPage: limit,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers(1, 10, "");
  }, [fetchSubscribers]);

  // Search handler with debounce
  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchSubscribers(1, pagination.itemsPerPage, val);
    }, 500);
  };

  const handleClearSearch = () => {
    setSearch("");
    fetchSubscribers(1, pagination.itemsPerPage, "");
  };

  // Toggle active status
  const toggleStatus = async (email, isActive) => {
    try {
      const endpoint = isActive ? "newsletter/unsubscribe" : "newsletter/subscribe";
      const res = await apiService.post(endpoint, { email });

      if (res?.success) {
        toast.success(res.message || "Status updated successfully");
        // Reload current page
        fetchSubscribers(pagination.currentPage, pagination.itemsPerPage, search);
      } else {
        toast.error(res?.message || "Operation failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Operation failed");
    }
  };

  // Open email modals
  const handleOpenIndividualModal = (targetEmail) => {
    setEmailModalType("individual");
    setEmailTarget(targetEmail);
    setEmailSubject("");
    setEmailMessage("");
    setEmailModalVisible(true);
  };

  const handleOpenBulkModal = () => {
    setEmailModalType("bulk");
    setEmailTarget("");
    setEmailSubject("");
    setEmailMessage("");
    setEmailModalVisible(true);
  };

  // Submit send email action
  const handleSendEmail = async () => {
    if (!emailSubject.trim()) {
      toast.error("Please enter email subject");
      return;
    }
    if (!emailMessage.trim()) {
      toast.error("Please enter email message");
      return;
    }

    setSendingEmail(true);
    try {
      let endpoint = "";
      let payload = {};

      if (emailModalType === "individual") {
        endpoint = "newsletter/send-individual-email";
        payload = {
          email: emailTarget,
          subject: emailSubject.trim(),
          message: emailMessage.trim(),
        };
      } else {
        endpoint = "newsletter/send-bulk-email";
        payload = {
          subject: emailSubject.trim(),
          message: emailMessage.trim(),
        };
      }

      const res = await apiService.post(endpoint, payload);

      if (res?.success) {
        toast.success(res.message || "Email sent successfully!");
        setEmailModalVisible(false);
        setEmailSubject("");
        setEmailMessage("");
      } else {
        toast.error(res?.message || "Failed to send email.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to send email. Please try again.");
    } finally {
      setSendingEmail(false);
    }
  };

  // Columns definition
  const columns = [
    {
      title: "Subscriber Email",
      key: "email",
      render: (_, r) => (
        <Space>
          <MailOutlined style={{ color: THEME.primary, fontSize: 16 }} />
          <span style={{ fontWeight: 600, color: "#1e293b" }}>{r.email}</span>
        </Space>
      ),
    },
    {
      title: "Linked Customer",
      key: "customer",
      render: (_, r) => {
        if (r.customer) {
          const nameObj = r.customer.name;
          const fullName = nameObj
            ? `${nameObj.first_name || ""} ${nameObj.last_name || ""}`.trim()
            : r.customer.full_name || "Active Customer";

          return (
            <Tag color="purple" icon={<LinkOutlined />} style={{ borderRadius: 6, fontWeight: 500 }}>
              {fullName}
            </Tag>
          );
        }
        return (
          <Tag color="default" style={{ borderRadius: 6 }}>
            None (Visitor)
          </Tag>
        );
      },
    },
    {
      title: "Date Subscribed",
      key: "createdAt",
      render: (_, r) => (
        <Text type="secondary" className="text-xs">
          {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric"
          }) : "—"}
        </Text>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, r) =>
        r.isActive
          ? <Tag color="green" icon={<CheckCircleOutlined />} style={{ borderRadius: 6 }}>Subscribed</Tag>
          : <Tag color="red" icon={<StopOutlined />} style={{ borderRadius: 6 }}>Unsubscribed</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, r) => (
        <Space size="middle">
          <Tooltip title={r.isActive ? "Unsubscribe" : "Subscribe"}>
            <Popconfirm
              title={`${r.isActive ? "Unsubscribe" : "Subscribe"} this email?`}
              onConfirm={() => toggleStatus(r.email, r.isActive)}
              okText="Yes"
              cancelText="Cancel"
            >
              <Button
                type="text"
                icon={
                  r.isActive
                    ? <FiToggleRight style={{ color: THEME.success, fontSize: 20 }} />
                    : <FiToggleLeft style={{ color: THEME.error, fontSize: 20 }} />
                }
              />
            </Popconfirm>
          </Tooltip>
          {r.isActive && (
            <Tooltip title="Send Email Message">
              <Button
                type="text"
                icon={<MailOutlined style={{ color: THEME.primary, fontSize: 18 }} />}
                onClick={() => handleOpenIndividualModal(r.email)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 800 }}>Newsletter Subscribers</Title>
          <Text type="secondary">View and manage newsletter list and subscriptions.</Text>
        </div>
        <Card bordered={false} className="shadow-sm rounded-xl" bodyStyle={{ padding: "12px 24px" }}>
          <div className="flex items-center gap-3">
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: `${THEME.primary}15`, color: THEME.primary,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            }}>
              <TeamOutlined />
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Total Subscribers</div>
              <div className="text-2xl font-bold" style={{ color: THEME.primary }}>{totalCount}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Table Card */}
      <Card bordered={false} className="shadow-sm rounded-xl overflow-hidden" bodyStyle={{ padding: 0 }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
          <Input
            placeholder="Search by email..."
            prefix={<FiSearch className="text-gray-400" />}
            value={search}
            onChange={handleSearch}
            allowClear
            onClear={handleClearSearch}
            style={{ maxWidth: 360, borderRadius: 8 }}
          />
          <Space>
            <Button
              icon={<FiRefreshCw />}
              onClick={() => fetchSubscribers(pagination.currentPage, pagination.itemsPerPage, search)}
            >
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<MailOutlined />}
              style={{ background: THEME.primary, borderColor: THEME.primary, borderRadius: 8, fontWeight: 600 }}
              onClick={handleOpenBulkModal}
            >
              Send Bulk Campaign
            </Button>
          </Space>
        </div>

        <div className="bg-white">
          <CustomTable
            columns={columns}
            data={subscribers}
            loading={loading}
            totalItems={pagination.totalResults}
            currentPage={pagination.currentPage}
            onPageChange={(page, limit) => fetchSubscribers(page, limit, search)}
            scroll={{ x: 800 }}
            showSearch={false}
          />
        </div>
      </Card>

      {/* Send Email Modal */}
      <Modal
        title={
          <span style={{ fontWeight: 800, fontSize: 18, color: "#1e293b" }}>
            {emailModalType === "individual" 
              ? `Send Email to ${emailTarget}` 
              : "Send Bulk Campaign to All Active Subscribers"}
          </span>
        }
        open={emailModalVisible}
        onCancel={() => !sendingEmail && setEmailModalVisible(false)}
        confirmLoading={sendingEmail}
        okText={sendingEmail ? "Sending..." : "Send Email"}
        okButtonProps={{ 
          style: { background: THEME.primary, borderColor: THEME.primary, borderRadius: 6 },
          disabled: sendingEmail
        }}
        cancelButtonProps={{
          disabled: sendingEmail,
          style: { borderRadius: 6 }
        }}
        onOk={handleSendEmail}
        destroyOnClose
        centered
        width={600}
      >
        <div className="py-4">
          <Form layout="vertical">
            <Form.Item 
              label={<span style={{ fontWeight: 600, color: "#475569" }}>Subject</span>} 
              required
            >
              <Input
                placeholder="Enter email subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                disabled={sendingEmail}
                style={{ borderRadius: 6, padding: "8px 12px" }}
              />
            </Form.Item>
            
            <Form.Item 
              label={<span style={{ fontWeight: 600, color: "#475569" }}>Message Body</span>} 
              required
            >
              <Input.TextArea
                placeholder="Write your email message here... (supports plain text and line breaks)"
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                disabled={sendingEmail}
                rows={8}
                style={{ borderRadius: 6, padding: "8px 12px" }}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default NewsletterSubscribers;
