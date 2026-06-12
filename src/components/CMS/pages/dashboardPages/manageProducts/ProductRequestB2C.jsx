import React, { useState, useEffect } from "react";
import { apiService } from "../../../../../manageApi/utils/custom.apiservice";
import CustomTable from "../../custom/CustomTable";
import { useSelector } from "react-redux";

import {
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  Card,
  Table,
  Typography,
  Row,
  Col,
  Statistic,
  Space,
  Divider,
  App,
  InputNumber,
  Select,
  Switch,
  Tag,
  Upload,
  Radio,
} from "antd";

import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  ShoppingOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import { Tooltip } from "antd";
import { PercentageOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const THEME = { primary: "#7c3aed" };

const COLOR_OPTIONS = [
  { label: "Black", value: "Black", hex: "#000000" },
  { label: "White", value: "White", hex: "#ffffff" },
  { label: "Grey", value: "Grey", hex: "#808080" },
  { label: "Walnut", value: "Walnut", hex: "#5d4037" },
  { label: "Oak", value: "Oak", hex: "#b5835a" },
  { label: "Beige", value: "Beige", hex: "#f5f5dc" },
  { label: "Blue", value: "Blue", hex: "#1d4ed8" },
  { label: "Red", value: "Red", hex: "#dc2626" },
];

const ProductManagementContent = () => {
  const { message, notification } = App.useApp();
  const { user } = useSelector((s) => s.auth || {});
  const isSuperAdmin = user?.role?.code === 0 || user?.role?.code === '0';
  const [form] = Form.useForm();
  const [marginForm] = Form.useForm();

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchText, setSearchText] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [marginModalVisible, setMarginModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);

  const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

  // ================= FETCH BRANDS =================

  const fetchBrands = async () => {
    try {
      const response = await apiService.get("/products/get-all-brand", {
        limit: 100,
      });
      setBrands(response?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FETCH CATEGORIES =================

  const fetchCategories = async () => {
    try {
      const response = await apiService.get("/products/get-all-category", {
        limit: 100,
      });
      setCategories(response?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FETCH PRODUCTS =================

  const fetchProducts = async (page = 1, limit = 10, search = "") => {
    setLoading(true);

    try {
      const response = await apiService.get("/products/get-all-products", {
        page,
        limit,
        search: search || undefined,
      });

      setProducts(response?.data?.products || []);
      setTotal(response?.data?.pagination?.total || 0);
    } catch (err) {
      message.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts(currentPage, pageSize, searchText);
    }, 400);

    return () => clearTimeout(delay);
  }, [currentPage, pageSize, searchText]);

  // ================= IMAGE UPLOAD =================

  const customUploadRequest = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiService.upload("/upload", formData);

      const imageUrl =
        response?.url ||
        response?.secure_url ||
        response?.data?.url ||
        response;

      onSuccess(imageUrl);
      message.success("Uploaded");
    } catch (err) {
      onError(err);
      message.error("Upload failed");
    }
  };

  // ================= PRICE CALCULATION =================

  const handleValuesChange = (changedValues, allValues) => {
    if (
      changedValues.price !== undefined ||
      changedValues.marginType !== undefined ||
      changedValues.marginValue !== undefined
    ) {
      const price = parseFloat(allValues.price) || 0;
      const margin = parseFloat(allValues.marginValue) || 0;
      const type = allValues.marginType;

      let finalPrice = 0;

      if (type === "percentage") {
        finalPrice = price + price * (margin / 100);
      } else {
        finalPrice = price + margin;
      }

      form.setFieldsValue({
        discountedPrice: parseFloat(finalPrice.toFixed(2)),
      });
    }
  };

  // ================= SAVE PRODUCT =================

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      setSaving(true);

      const extractUrl = (f) => {
        if (typeof f === "string") return f;

        const res = f.response;

        if (res)
          return typeof res === "string"
            ? res
            : res.url || res.secure_url || res.file?.url;

        return f.url || null;
      };

      const payload = {
        product: {
          name: values.name,
          photos: values.mainImage
            ? values.mainImage.map(extractUrl).filter(Boolean).slice(0, 1)
            : [""],
          category: values.category,
          brandName: values.brandName,
          description: values.description || "",
          price: Number(values.price) || 0,
          discountedPrice: Number(values.discountedPrice) || 0,
          currency: "AED",
          quantity: Number(values.quantity) || 0,
          warrantyYears: Number(values.warrantyYears) || 0,
          returnPolicyDays: Number(values.returnPolicyDays) || 0,
          noCostEmiAvailable: !!values.noCostEmiAvailable,
          isActive: values.isActive ?? true,
          isFeatured: values.isFeatured ?? true,
          finish: values.finish || "",
          originCountry: values.originCountry || "",
          careInstructions: values.careInstructions || "",
          assemblyRequired: !!values.assemblyRequired,
          assemblyToolsProvided: !!values.assemblyToolsProvided,
          keyFeatures:
            typeof values.keyFeatures === "string"
              ? values.keyFeatures.split(",").map((s) => s.trim())
              : [],
          material:
            typeof values.material === "string"
              ? values.material.split(",").map((s) => s.trim())
              : [],
        },

        colours: (values.colours || []).map((col) => ({
          colourName: col.colourName,
          photos: col.photos
            ? col.photos.map(extractUrl).filter(Boolean)
            : [],
          isActive: col.isActive ?? true,
        })),
      };

      const response = await apiService.post(
        editingId
          ? `/products/edit-product-by-id?id=${editingId}`
          : `/products/create-products`,
        payload
      );

      if (response.success) {
        notification.success({
          message: "Success",
          description: "Product saved successfully.",
        });

        closeModal();
        fetchProducts(currentPage, pageSize);
      }
    } catch (err) {
      message.error("Format Error: Check your fields");
    } finally {
      setSaving(false);
    }
  };

  // ================= DELETE PRODUCT =================

  const handleDelete = async (id) => {
    await apiService.post(`/products/delete-product-by-id?id=${id}`);
    fetchProducts();
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingId(null);
    form.resetFields();
  };

  // ================= TABLE =================

  const columns = [
    {
      title: "Product",
      key: "name",
      render: (_, r) => (
        <Space>
          <img
            src={r.photos?.[0]}
            width="50"
            height="50"
            style={{ objectFit: "contain" }}
          />
          <div>
            <Text strong>{r.name}</Text>
            <Tag color="blue">{r.brandName?.brandName}</Tag>
          </div>
        </Space>
      ),
    },
    {
      title: "Stock",
      key: "quantity",
      render: (_, r) => (
        <Tag color={r.quantity > 5 ? "success" : "warning"}>
          {r.quantity} in Stock
        </Tag>
      ),
    },
    {
      title: "Base Price",
      key: "price",
      render: (_, r) => <Text strong>AED {r.price}</Text>,
    },
    {
      title: "Sale Price",
      key: "salePrice",
      render: (_, r) => (
        <Text strong>{r.salePrice ? `AED ${r.salePrice}` : "--"}</Text>
      ),
    },
    {
      title: "Status",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "success" : "error"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined style={{ color: "#7c3aed" }} />}
              onClick={() => {
                setSelectedProduct(record);
                setViewModalVisible(true);
              }}
            />
          </Tooltip>

          {!isSuperAdmin && (
            <>
              <Tooltip title="Add Margin">
                <Button
                  type="text"
                  icon={<PercentageOutlined />}
                  onClick={() => {
                    setSelectedProduct(record);
                    marginForm.setFieldsValue({
                      marginType: record.marginType || "fixed",
                      marginValue: record.marginValue || 0,
                    });
                    setMarginModalVisible(true);
                  }}
                />
              </Tooltip>

              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => {
                  setEditingId(record._id);
                  setCurrentProduct(record);
                  form.setFieldsValue({
                    ...record,
                    brandName: record.brandName?._id || record.brandName,
                    category: record.category?._id || record.category,
                  });
                  setModalVisible(true);
                }}
              />

              <Popconfirm
                title="Delete Product?"
                onConfirm={() => handleDelete(record._id)}
              >
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

      <div className="flex justify-between mb-6">
        <Title level={3}>Product Management</Title>

        {!isSuperAdmin && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ background: THEME.primary }}
            onClick={() => {
              setEditingId(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            Add Product
          </Button>
        )}
      </div>

      <div className="mt-4">
        <CustomTable
          columns={columns}
          data={products}
          totalItems={total}
          currentPage={currentPage}
          itemsPerPage={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onFilter={(filters) => {
            setSearchText(filters.search || "");
            setCurrentPage(1);
          }}
          loading={loading}
          showSearch={true}
        />
      </div>

      {/* FORM MODAL */}
      <Modal
        title={editingId ? "Edit Product" : "Create Product"}
        open={modalVisible}
        footer={null}
        width={1000}
        onCancel={closeModal}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          onValuesChange={handleValuesChange}
        >

          {/* FULL FORM SAME AS BEFORE */}

        </Form>
      </Modal>

      {/* VIEW PRODUCT DETAIL MODAL */}
      <Modal
        title={
          <Space>
            <ShoppingOutlined style={{ color: THEME.primary }} />
            <span style={{ fontWeight: 800 }}>Product Details</span>
          </Space>
        }
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setSelectedProduct(null);
        }}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setViewModalVisible(false)}
            style={{ background: THEME.primary, borderRadius: 8 }}
          >
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedProduct && (
          <div style={{ padding: "10px 0" }}>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={10}>
                <div
                  style={{
                    border: "1px solid #f0f0f0",
                    borderRadius: 12,
                    padding: 12,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#fafafa",
                    height: 260,
                  }}
                >
                  <img
                    src={selectedProduct.photos?.[0]}
                    alt={selectedProduct.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: 8,
                    }}
                  />
                </div>
                {selectedProduct.photos && selectedProduct.photos.length > 1 && (
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginTop: 12,
                      overflowX: "auto",
                      paddingBottom: 4,
                    }}
                  >
                    {selectedProduct.photos.map((p, idx) => (
                      <img
                        key={idx}
                        src={p}
                        alt=""
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 6,
                          border: "1px solid #e5e7eb",
                        }}
                      />
                    ))}
                  </div>
                )}
              </Col>

              <Col xs={24} md={14}>
                <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
                  {selectedProduct.name}
                </Title>
                <Space style={{ marginTop: 8 }}>
                  <Tag color="purple" style={{ borderRadius: 4, fontWeight: 600 }}>
                    {selectedProduct.category?.name ||
                      selectedProduct.category?.categoryName ||
                      "—"}
                  </Tag>
                  <Tag color="blue" style={{ borderRadius: 4, fontWeight: 600 }}>
                    {selectedProduct.brandName?.brandName || "—"}
                  </Tag>
                </Space>

                <Divider style={{ margin: "16px 0" }} />

                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic
                      title="Base Price"
                      value={selectedProduct.price}
                      prefix="AED "
                      precision={2}
                      valueStyle={{ fontWeight: 800, fontSize: 18 }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Sale Price"
                      value={selectedProduct.salePrice || "--"}
                      prefix={selectedProduct.salePrice ? "AED " : ""}
                      valueStyle={{
                        fontWeight: 800,
                        color: "#10b981",
                        fontSize: 18,
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Stock Quantity"
                      value={selectedProduct.quantity}
                      suffix=" units"
                      valueStyle={{ fontWeight: 700, fontSize: 16 }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Warranty"
                      value={selectedProduct.warrantyYears || 0}
                      suffix=" Years"
                      valueStyle={{ fontWeight: 700, fontSize: 16 }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            <Divider style={{ margin: "20px 0" }} />

            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Text strong style={{ color: "#1e293b", fontSize: 14 }}>
                  Description
                </Text>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: 13,
                    marginTop: 6,
                    lineHeight: 1.6,
                  }}
                >
                  {selectedProduct.description || "No description provided."}
                </p>

                <div style={{ marginTop: 16 }}>
                  <Text strong style={{ color: "#1e293b", fontSize: 14 }}>
                    Materials
                  </Text>
                  <div style={{ marginTop: 6 }}>
                    {selectedProduct.material &&
                    selectedProduct.material.length > 0 ? (
                      selectedProduct.material.map((m, i) => (
                        <Tag key={i} style={{ borderRadius: 4 }}>
                          {m}
                        </Tag>
                      ))
                    ) : (
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        —
                      </Text>
                    )}
                  </div>
                </div>
              </Col>

              <Col xs={24} md={12}>
                <Text strong style={{ color: "#1e293b", fontSize: 14 }}>
                  Product Specifications
                </Text>
                <div style={{ marginTop: 8 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "4px 0",
                      borderBottom: "1px dashed #f1f5f9",
                    }}
                  >
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Finish
                    </Text>
                    <Text strong style={{ fontSize: 12 }}>
                      {selectedProduct.finish || "—"}
                    </Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "4px 0",
                      borderBottom: "1px dashed #f1f5f9",
                    }}
                  >
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Origin Country
                    </Text>
                    <Text strong style={{ fontSize: 12 }}>
                      {selectedProduct.originCountry || "—"}
                    </Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "4px 0",
                      borderBottom: "1px dashed #f1f5f9",
                    }}
                  >
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Return Policy
                    </Text>
                    <Text strong style={{ fontSize: 12 }}>
                      {selectedProduct.returnPolicyDays
                        ? `${selectedProduct.returnPolicyDays} Days`
                        : "—"}
                    </Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "4px 0",
                      borderBottom: "1px dashed #f1f5f9",
                    }}
                  >
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      No-Cost EMI
                    </Text>
                    <Text strong style={{ fontSize: 12 }}>
                      {selectedProduct.noCostEmiAvailable ? "Yes" : "No"}
                    </Text>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

    </div>
  );
};

const ProductManagement = () => (
  <App>
    <ProductManagementContent />
  </App>
);

export default ProductManagement;