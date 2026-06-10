"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { notification } from "antd";
import { Country } from "country-state-city";
import { apiService } from "../../manageApi/utils/custom.apiservice";

import GrowImage from "../../assets/img/Grow.png";
import wave1 from "../../assets/img/wave/wave1.png";

const PHONE_LENGTH_RULES = {
  "971": 9, "91": 10, "966": 9, "1": 10, "44": 10, "61": 9,
};

// ─── Custom Phone Country Select ─────────────────────────────────────────────
const PhoneCountrySelect = ({ countries, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = countries.find((c) => c.code === value) || countries[0];
  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search)
  );

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 h-[42px] px-2 border border-gray-300 rounded-lg bg-white hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[90px] sm:min-w-[110px]"
      >
        {selected && (
          <img
            src={`https://flagcdn.com/w20/${selected.iso.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${selected.iso.toLowerCase()}.png 2x`}
            width={20}
            alt={selected.name}
            className="rounded-sm flex-shrink-0"
          />
        )}
        <span className="text-xs text-gray-700 font-medium">+{selected?.code}</span>
        <svg
          className="w-3 h-3 text-gray-400 flex-shrink-0 ml-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl">
          <div className="p-2 border-b">
            <input
              autoFocus
              type="text"
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>
          <ul className="max-h-52 overflow-y-auto">
            {filtered.map((c) => (
              <li
                key={c.iso}
                onClick={() => {
                  onChange(c.code);
                  setOpen(false);
                  setSearch("");
                }}
                className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-purple-50 text-sm ${
                  value === c.code ? "bg-purple-100 font-semibold" : ""
                }`}
              >
                <img
                  src={`https://flagcdn.com/w20/${c.iso.toLowerCase()}.png`}
                  width={20}
                  alt={c.name}
                  className="rounded-sm flex-shrink-0"
                />
                <span className="flex-1 truncate">{c.name}</span>
                <span className="text-gray-400 text-xs">+{c.code}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const CtaSection = () => {
  const { t } = useTranslation("cta");

  const STAKEHOLDER_MAP = {
    "Buying Property": "Investor",
    "Selling Property": "Investor",
    "Partner with us": "Business Associate",
    "Investor": "Investor",
    "Developer": "Developer",
    "Execution Partner": "Execution Partner",
  };

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const [formData, setFormData] = useState({
    name: "", email: "", company: "", countryCode: "971", contact: "", inquiryType: "", message: "",
  });

  const phoneCountryOptions = useMemo(() => {
    const priorityIsoCodes = ["AE", "IN", "SA", "US", "GB", "AU"];
    return Country.getAllCountries()
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

  const openNotification = (type, title, description) => {
    api[type]({ message: title, description, placement: "topRight" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryCodeChange = (value) => {
    const limit = PHONE_LENGTH_RULES[value] || 15;
    setFormData((prev) => ({ ...prev, countryCode: value, contact: prev.contact.slice(0, limit) }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    const maxLength = PHONE_LENGTH_RULES[formData.countryCode] || 15;
    setFormData((prev) => ({ ...prev, contact: value.slice(0, maxLength) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredLength = PHONE_LENGTH_RULES[formData.countryCode];
    if (requiredLength && formData.contact.length !== requiredLength) {
      openNotification("error", "Invalid Phone", `Please enter ${requiredLength} digits for this country code`);
      return;
    }

    setLoading(true);

    const nameParts = formData.name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || ".";
    const finalStakeholder = STAKEHOLDER_MAP[formData.inquiryType] || "Investor";

    const payload = {
      type: "partner",
      name: { first_name: firstName, last_name: lastName },
      email: formData.email.toLowerCase().trim(),
      company: formData.company.trim(),
      mobile: { country_code: formData.countryCode, number: formData.contact },
      stakeholder_type: finalStakeholder,
      message: formData.message.trim() || "Inquiry from CTA Section",
    };

    try {
      const res = await apiService.post("/property/lead", payload);
      if (res?.success || res?.data?.success || res?.status === 200) {
        openNotification("success", "Success", "Your inquiry has been submitted!");
        setOpenModal(false);
        setFormData({ name: "", email: "", company: "", countryCode: "971", contact: "", inquiryType: "", message: "" });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.[0]?.message || "Validation Error";
      openNotification("error", "Failed", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-[42px] border border-gray-300 px-4 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white transition-all text-sm";

  return (
    <>
      {contextHolder}
      <section className="relative w-full flex justify-center items-center py-12 px-4 sm:px-6 md:h-[450px]">
        <div className="absolute bottom-[-20px] lg:bottom-[-70px] left-0 w-full z-0 overflow-hidden">
          <img
            src={wave1}
            alt=""
            className="w-full min-w-[140%] -ml-[20%] scale-[1.8] lg:scale-100 lg:min-w-full lg:ml-0 pointer-events-none select-none"
          />
        </div>

        <div className="max-w-6xl w-full relative banner-gradient-color1 rounded-2xl text-white flex flex-col md:block items-center p-8 md:p-14 shadow-2xl overflow-hidden z-10">
          <div className="w-full md:w-2/3 relative z-10 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-extrabold leading-snug heading-light mb-6">
              {t("title")}
            </h2>
            <button
              onClick={() => setOpenModal(true)}
              className="bg-[#5C039B] px-8 py-4 rounded-lg font-bold text-white shadow-lg hover:bg-[#4a027d] transition-transform transform hover:scale-105"
            >
              {t("ctaButton")}
            </button>
          </div>
          <div className="mt-8 md:mt-0 md:absolute md:bottom-0 md:right-0 z-0 w-full md:w-auto flex justify-center md:block">
            <img
              src={GrowImage}
              alt="Growth"
              className="object-contain h-56 md:h-[350px] drop-shadow-2xl md:translate-y-2"
            />
          </div>
        </div>
      </section>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl relative animate-fadeIn overflow-y-auto max-h-[95vh]">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-red-500 text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">{t("modal.title")}</h2>

            <form className="space-y-4" onSubmit={handleSubmit}>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t("form.name")} *</label>
                <input
                  type="text"
                  name="name"
                  required
                  className={inputClass}
                  placeholder={t("form.namePlaceholder")}
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t("form.email")} *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className={inputClass}
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Company *</label>
                  <input
                    type="text"
                    name="company"
                    required
                    className={inputClass}
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* PHONE FIELD */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t("form.phone")} *</label>
                <div className="flex w-full gap-2 h-[42px]">
                  <PhoneCountrySelect
                    countries={phoneCountryOptions}
                    value={formData.countryCode}
                    onChange={handleCountryCodeChange}
                  />
                  <input
                    type="tel"
                    name="contact"
                    required
                    className="flex-1 h-full border border-gray-300 px-4 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm"
                    placeholder="Phone Number"
                    value={formData.contact}
                    onChange={handlePhoneChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t("form.inquiry")} *</label>
                <select
                  name="inquiryType"
                  required
                  className={inputClass}
                  value={formData.inquiryType}
                  onChange={handleChange}
                >
                  <option value="">{t("form.select")}</option>
                  {(t("form.options", { returnObjects: true }) || []).map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t("form.message")}</label>
                <textarea
                  name="message"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg outline-none resize-none focus:ring-2 focus:ring-purple-500 text-sm"
                  rows="2"
                  placeholder={t("form.messagePlaceholder")}
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5C039B] hover:bg-[#4a027d] py-3 rounded-lg text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full" />
                ) : (
                  t("form.submit")
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CtaSection;
