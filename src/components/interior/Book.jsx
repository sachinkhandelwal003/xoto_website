"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { notification } from "antd";
import { useTranslation } from "react-i18next";
import { Country } from "country-state-city";
import { ChevronDown } from "lucide-react";
import { apiService } from "../../manageApi/utils/custom.apiservice";
import helloImage from "../../assets/img/hello.jpg";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// ─── Phone Country Select ──────────────────────────────────────────────────────
const PhoneCountrySelect = ({ countries, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);

  const selected = countries.find((c) => c.iso === value) || countries[0];

  const filtered = search
    ? countries.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.includes(search.replace(/\D/g, ""))
      )
    : countries;

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0, minWidth: 110 }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "0 10px", height: "46px", width: "100%",
          background: "white", border: "1px solid #D1D5DB", borderRadius: "12px",
          cursor: "pointer", fontSize: "14px", whiteSpace: "nowrap",
        }}
      >
        <img
          src={`https://flagcdn.com/w20/${selected.iso.toLowerCase()}.png`}
          alt=""
          style={{ width: 20, height: 14, borderRadius: 2, objectFit: "cover" }}
          onError={(e) => { e.target.src = "https://flagcdn.com/w20/un.png"; }}
        />
        <span style={{ fontWeight: 600, fontSize: 14, color: "#374151" }}>+{selected.code}</span>
        <ChevronDown size={14} style={{ color: "#9CA3AF" }} />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0,
          minWidth: 260, background: "#fff", border: "1px solid #E5E7EB",
          borderRadius: 12, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12)",
          zIndex: 1000, overflow: "hidden",
        }}>
          <div style={{ padding: 8, borderBottom: "1px solid #F3F4F6" }}>
            <input
              ref={inputRef} type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              style={{
                width: "100%", padding: "8px 12px", border: "1px solid #E5E7EB",
                borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ maxHeight: 240, overflowY: "auto" }}>
            {filtered.slice(0, 100).map((c) => (
              <button
                key={c.iso} type="button"
                onClick={() => { onChange(c.iso); setOpen(false); setSearch(""); }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  width: "100%", padding: "9px 14px",
                  background: c.iso === value ? "#F3E8FF" : "transparent",
                  border: "none", cursor: "pointer", textAlign: "left",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FAF5FF")}
                onMouseLeave={(e) => { if (c.iso !== value) e.currentTarget.style.background = "transparent"; }}
              >
                <img
                  src={`https://flagcdn.com/w20/${c.iso.toLowerCase()}.png`}
                  alt=""
                  style={{ width: 20, height: 14, borderRadius: 2 }}
                  onError={(e) => { e.target.src = "https://flagcdn.com/w20/un.png"; }}
                />
                <span style={{ fontSize: 13, fontWeight: 500, color: "#1F2937", flex: 1 }}>{c.name}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#8B5CF6" }}>+{c.code}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p style={{ padding: 16, fontSize: 12, color: "#9CA3AF", textAlign: "center" }}>
                No results found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function ConsultationSection() {
  const { t } = useTranslation("book");
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    dialIso: "AE",
    country_code: "971",
    number: "",
    message: "",
  });

  const phoneCountryOptions = useMemo(() => {
    const priorityIsoCodes = ["AE", "IN", "SA", "US", "GB", "AU"];
    return Country.getAllCountries()
      .filter((c) => c.phonecode)
      .map((country) => ({
        name: country.name,
        code: country.phonecode,
        iso: country.isoCode,
      }))
      .sort((a, b) => {
        const aPriority = priorityIsoCodes.includes(a.iso);
        const bPriority = priorityIsoCodes.includes(b.iso);
        if (aPriority && !bPriority) return -1;
        if (!aPriority && bPriority) return 1;
        return a.name.localeCompare(b.name);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryCodeChange = (isoCode) => {
    const selected = phoneCountryOptions.find((c) => c.iso === isoCode);
    setFormData((prev) => ({
      ...prev,
      dialIso: isoCode,
      country_code: selected?.code || "971",
      number: "",
    }));
  };

  const handleNumber = (e) => {
    setFormData((prev) => ({ ...prev, number: e.target.value.replace(/\D/g, "") }));
  };

  const openNotification = (type, title, description) => {
    api[type]({ message: title, description, placement: "topRight" });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const parsed = parsePhoneNumberFromString(`+${formData.country_code}${formData.number}`);
    if (!parsed || !parsed.isValid()) {
      openNotification("error", "Invalid Phone", `Phone number is invalid for +${formData.country_code}`);
      return;
    }

    setLoading(true);

    const inquiryPayload = {
      type: "consultation",
      consultant_type: "interior",
      name: {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
      },
      mobile: {
        country_code: formData.country_code,
        number: formData.number,
      },
      email: formData.email.trim().toLowerCase(),
      message: formData.message.trim(),
    };

    try {
      await apiService.post("/property/lead", inquiryPayload);

      await apiService.post("/notifications/create-notification", {
        sender: {
          email: inquiryPayload.email,
          full_name: `${inquiryPayload.name.first_name} ${inquiryPayload.name.last_name}`,
          mobile: {
            country_code: inquiryPayload.mobile.country_code,
            number: inquiryPayload.mobile.number,
          },
        },
        receiverType: "admin",
        senderType: "user",
        notificationType: "NEW_INQUIRY",
        title: "Interior Consultation",
        message: "A user has requested an interior consultation.",
      });

      openNotification("success", t("success.title"), t("success.message"));

      setFormData({
        first_name: "", last_name: "", email: "",
        dialIso: "AE", country_code: "971", number: "", message: "",
      });
    } catch (err) {
      const errorData = err.response?.data;
      let errorMessage = t("errors.submit") || "Something went wrong";
      if (Array.isArray(errorData?.errors) && errorData.errors.length > 0) {
        errorMessage = errorData.errors[0].message || errorData.errors[0].msg;
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }
      openNotification("error", t("errors.submitTitle"), errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-gray-900">
      {contextHolder}

      <img
        src={helloImage}
        alt={t("imageAlt")}
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(92, 3, 155, 0.85) 20%, rgba(3, 164, 244, 0.85) 95%)",
        }}
      />

      <div className="relative z-10 mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-start max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-16 gap-12 lg:gap-20">

        {/* Left: Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl text-white text-center lg:text-left"
        >
          <h2 className="mt-9 text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {t("title")}
          </h2>
          <p className="mt-5 text-lg md:text-2xl opacity-90">{t("description")}</p>
        </motion.div>

        {/* Right: Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-lg"
        >
          <div className="rounded-2xl bg-white p-5 sm:p-8 shadow-2xl">
            <form onSubmit={onSubmit} className="space-y-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">{t("form.firstName")} *</label>
                  <input
                    type="text" name="first_name" value={formData.first_name}
                    onChange={handleChange} required placeholder={t("form.firstName")}
                    className="w-full rounded-xl border border-gray-300 px-4 h-[46px] outline-none focus:border-purple-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">{t("form.lastName")} *</label>
                  <input
                    type="text" name="last_name" value={formData.last_name}
                    onChange={handleChange} required placeholder={t("form.lastName")}
                    className="w-full rounded-xl border border-gray-300 px-4 h-[46px] outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">{t("form.email")} *</label>
                <input
                  type="email" name="email" value={formData.email}
                  onChange={handleChange} required placeholder={t("form.email")}
                  className="w-full rounded-xl border border-gray-300 px-4 h-[46px] outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">{t("form.mobile")} *</label>
                <div className="flex gap-2">
                  <PhoneCountrySelect
                    countries={phoneCountryOptions}
                    value={formData.dialIso}
                    onChange={handleCountryCodeChange}
                  />
                  <input
                    type="text" value={formData.number} onChange={handleNumber}
                    required placeholder={t("form.mobile")} inputMode="numeric"
                    className="flex-1 rounded-xl border border-gray-300 px-4 h-[46px] outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">{t("form.message")} *</label>
                <textarea
                  name="message" value={formData.message} onChange={handleChange}
                  required rows={4} placeholder={t("form.message")}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-purple-700 to-indigo-900 py-3.5 text-lg font-bold text-white shadow-lg disabled:opacity-70 transition-all"
              >
                {loading ? t("buttons.submitting") : t("buttons.submit")}
              </motion.button>

              <p className="text-center text-xs text-gray-400 mt-2 px-2">{t("privacy")}</p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
