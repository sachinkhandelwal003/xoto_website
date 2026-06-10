import React, { useState, useMemo, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { notification } from 'antd';
import { Country, State, City } from "country-state-city"; 
import { ChevronDown } from "lucide-react";
import { apiService } from "../../manageApi/utils/custom.apiservice";

import joinImage from "../../assets/img/join.png";
import wave1 from "../../assets/img/wave/waveint5.png";

const dmSans = { fontFamily: "'DM Sans', sans-serif" };

const PHONE_LENGTH_RULES = {
  "971": 9, "91": 10, "966": 9, "1": 10, "44": 10, "61": 9,
};

// ─── Phone Country Select Component ───────────────────────────────────────
const PhoneCountrySelect = ({ countries, value, onChange, onOpenChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);
  const inputRef = useRef(null);
  
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    if (onOpenChange) onOpenChange(newOpen);
  };
  
  const selected = countries.find(c => c.iso === value) || countries[0];

  const filtered = search
    ? countries.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.includes(search.replace(/\D/g, ''))
      )
    : countries;

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSearch(''); } };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 30); }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <button
        type="button"
        onClick={() => handleOpenChange(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '0 10px',
          height: '100%',
          width: '100%',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '14px',
          transition: 'all 0.2s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => { /* no change */ }}
        onMouseLeave={e => { /* no change */ }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img 
            src={`https://flagcdn.com/w20/${selected.iso.toLowerCase()}.png`} 
            alt="" 
            style={{ width: 20, height: 15, borderRadius: 2, objectFit: 'cover' }}
            onError={(e) => { e.target.src = 'https://flagcdn.com/w20/un.png'; }}
          />
          <span style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>+{selected.code}</span>
        </div>
        <ChevronDown size={16} style={{ color: '#9CA3AF' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 5px)',
          left: 0,
          width: '100%',
          minWidth: 260,
          background: '#fff',
          border: '1px solid #E5E7EB',
          borderRadius: 12,
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
          zIndex: 1000,
          overflow: 'hidden',
        }}>
          <div style={{ padding: 8, borderBottom: '1px solid #F3F4F6' }}>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search country..."
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #E5E7EB',
                borderRadius: 8,
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ maxHeight: 240, overflowY: 'auto' }}>
            {filtered.slice(0, 100).map(c => (
              <button
                key={c.iso}
                type="button"
                onClick={() => { onChange(c.iso); handleOpenChange(false); setSearch(''); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '10px 14px',
                  background: c.iso === value ? '#F3E8FF' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#FAF5FF'}
                onMouseLeave={e => { if (c.iso !== value) e.currentTarget.style.background = 'transparent'; }}
              >
                <img 
                  src={`https://flagcdn.com/w20/${c.iso.toLowerCase()}.png`} 
                  alt="" 
                  style={{ width: 20, height: 15, borderRadius: 2 }}
                  onError={(e) => { e.target.src = 'https://flagcdn.com/w20/un.png'; }}
                />
                <span style={{ fontSize: 13, fontWeight: 500, color: '#1F2937', flex: 1 }}>{c.name}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#8B5CF6' }}>+{c.code}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p style={{ padding: '16px', fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>No results found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const PartnerEcosystemSection = () => {
  const { t } = useTranslation("partnerForm");
  const [loading, setLoading] = useState(false);
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", company: "",
    stakeholder: "", countryCode: "971", dialIso: "AE", contact: "", message: "",
  });

  const phoneCountryOptions = useMemo(() => {
    const priorityIsoCodes = ["AE", "IN", "SA", "US", "GB", "AU"];
    return Country.getAllCountries()
      .filter(c => c.phonecode)
      .map((country) => ({
        name: country.name, code: country.phonecode, iso: country.isoCode,
      })).sort((a, b) => {
        const aPriority = priorityIsoCodes.includes(a.iso);
        const bPriority = priorityIsoCodes.includes(b.iso);
        if (aPriority && !bPriority) return -1;
        if (!aPriority && bPriority) return 1;
        return a.name.localeCompare(b.name);
      });
  }, []);

  const openNotification = (type, title, description) => {
    api[type]({ message: title, description, placement: 'topRight' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryCodeChange = (isoCode) => {
    const selected = phoneCountryOptions.find(c => c.iso === isoCode);
    setFormData((prev) => ({
      ...prev,
      countryCode: selected?.code || "971",
      dialIso: isoCode,
      contact: "",
    }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const maxLength = PHONE_LENGTH_RULES[formData.countryCode] || 15;
    const validatedValue = value.slice(0, maxLength);
    setFormData((prev) => ({ ...prev, contact: validatedValue }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      openNotification("error", "Validation Error", "First Name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      openNotification("error", "Validation Error", "Last Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      openNotification("error", "Validation Error", "Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      openNotification("error", "Validation Error", "Please enter a valid email address");
      return false;
    }
    if (!formData.contact.trim()) {
      openNotification("error", "Validation Error", "Phone number is required");
      return false;
    }
    const requiredLength = PHONE_LENGTH_RULES[formData.countryCode];
    if (requiredLength && formData.contact.length !== requiredLength) {
      openNotification("error", "Validation Error", `Enter ${requiredLength} digits for +${formData.countryCode}`);
      return false;
    }
    if (!formData.company.trim()) {
      openNotification("error", "Validation Error", "Company is required");
      return false;
    }
    if (!formData.stakeholder) {
      openNotification("error", "Validation Error", "Stakeholder type is required");
      return false;
    }
    if (!formData.message.trim()) {
      openNotification("error", "Validation Error", "Message is required");
      return false;
    }
    return true;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;
  //   setLoading(true);

  //   const payload = {
  //     type: "partner",
  //     name: { first_name: formData.firstName.trim(), last_name: formData.lastName.trim() },
  //     email: formData.email.toLowerCase().trim(),
  //     company: formData.company.trim(),
  //     stakeholder_type: formData.stakeholder,
  //     mobile: { country_code: formData.countryCode, number: formData.contact },
  //     message: formData.message.trim(),
  //   };

  //   try {
  //     const res = await apiService.post("/property/lead", payload);
  //     if (res?.success || res?.status === 200 || res?.status === 201) {
  //       openNotification("success", "Success", "Your request has been submitted!");
  //       setFormData({ firstName: "", lastName: "", email: "", company: "", stakeholder: "", countryCode: "971", contact: "", message: "" });
  //       setErrors({});
  //     }
  //   } catch (err) {
  //     openNotification("error", "Failed", err.response?.data?.message || "Server Error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const payload = {
      type: "partner",
      name: {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
      },
      email: formData.email.toLowerCase().trim(),
      company: formData.company.trim(),
      stakeholder_type: formData.stakeholder,
      mobile: {
        country_code: formData.countryCode,
        number: formData.contact,
      },
      message: formData.message.trim(),
    };

    try {
      const res = await apiService.post("/property/lead", payload);

      if (res?.success || res?.status === 200 || res?.status === 201) {
        try {
          const notificationPayload = {
            sender: payload.email,
            receiverType: "admin",
            senderType: "user",
            notificationType: "NEW_INQUIRY",
            title: "Partner Ecosystem Inquiry",
            message: "A new partner inquiry has been submitted.",
          };
          await apiService.post("/notifications/create-notification", notificationPayload);
        } catch (notificationError) {
          console.error("Notification failed", notificationError);
        }

        const msg = res?.message || "Your request has been submitted!";
        openNotification("success", "Success", msg);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          company: "",
          stakeholder: "",
          countryCode: "971",
          dialIso: "AE",
          contact: "",
          message: "",
        });
      }
    } catch (err) {
      const errorData = err.response?.data;
      let errorMessage = "Something went wrong";
      if (Array.isArray(errorData?.errors) && errorData.errors.length > 0) {
        errorMessage = errorData.errors[0].message || errorData.errors[0].msg;
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }
      openNotification("error", "Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      {contextHolder}
      <section className="w-full relative bg-[var(--color-body)] py-16 md:py-20 px-4 md:px-12 z-10 overflow-hidden">
        
        <div className="absolute top-[-40px] sm:top-[-80px] lg:top-[-150px] left-0 w-full z-0 ">
          <img src={wave1} alt="" className="w-full h-auto object-cover scale-[1.6] sm:scale-[1.3] lg:scale-100 -ml-[30%] sm:-ml-[15%] lg:ml-0 pointer-events-none select-none" />
        </div>

        <div className="relative z-20 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col">
            <h2 className="hidden lg:block text-2xl md:text-5xl font-semibold text-black">{t("hero.titleDesktop")}</h2>
            <h2 className="block lg:hidden text-3xl font-semibold text-black mb-6 text-center">{t("hero.titleMobile")}</h2>
            <img src={joinImage} alt="Join" className="hidden md:block w-full max-w-md mt-4 md:mt-8 mx-auto md:mx-0" />
          </div>

          <div className="bg-white shadow-2xl rounded-2xl md:p-10 p-5 w-full max-w-full">
            <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit}>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="w-full min-w-0">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">{t("form.firstName.label")} *</label>
                  <input name="firstName" placeholder={t("form.firstName.placeholder")} value={formData.firstName} onChange={handleChange} className="w-full h-[42px] border border-gray-300 rounded-md px-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 bg-white" required />
                </div>
                <div className="w-full min-w-0">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">{t("form.lastName.label")} *</label>
                  <input name="lastName" placeholder={t("form.lastName.placeholder")} value={formData.lastName} onChange={handleChange} className="w-full h-[42px] border border-gray-300 rounded-md px-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 bg-white" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="w-full min-w-0">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">{t("form.email.label")} *</label>
                  <input type="email" name="email" placeholder={t("form.email.placeholder")} value={formData.email} onChange={handleChange} className="w-full h-[42px] border border-gray-300 rounded-md px-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 bg-white" required />
                </div>
                <div className="w-full min-w-0">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">{t("form.company.label")} *</label>
                  <input name="company" placeholder={t("form.company.placeholder")} value={formData.company} onChange={handleChange} className="w-full h-[42px] border border-gray-300 rounded-md px-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 bg-white" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="w-full min-w-0">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">{t("form.stakeholder.label")} *</label>
                  <select name="stakeholder" value={formData.stakeholder} onChange={handleChange} className="w-full h-[42px] border border-gray-300 rounded-md px-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 bg-white" required>
                    <option value="">{t("form.stakeholder.select")}</option>
                    <option value="Business Associate">{t("form.stakeholder.business")}</option>
                    <option value="Execution Partner">{t("form.stakeholder.execution")}</option>
                    <option value="Developer">{t("form.stakeholder.developer")}</option>
                    <option value="Investor">{t("form.stakeholder.investor")}</option>
                  </select>
                </div>

                {/* --- MOBILE FIELD: RESPONSIVE WIDTH --- */}
                <div className="w-full min-w-0">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">{t("form.phone.label")} *</label>
                  
                  {/* Merged container for country code + number */}
                  <div className={`flex items-center w-full h-[48px] border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 bg-white ${isCountryPickerOpen ? "overflow-visible" : ""}`}>
                    
                    {/* Country code picker (only show when no phone number is entered) */}
                    {!formData.contact && (
                      <div className="flex-shrink-0 h-full border-r border-gray-300">
                        <PhoneCountrySelect
                          countries={phoneCountryOptions}
                          value={formData.dialIso}
                          onChange={handleCountryCodeChange}
                          onOpenChange={setIsCountryPickerOpen}
                        />
                      </div>
                    )}
                    
                    {/* When number is entered, show country code as clickable static text inside the input */}
                    {formData.contact && (
                      <div 
                        className="flex-shrink-0 h-full flex items-center px-3 text-base text-gray-700 border-r border-gray-300 cursor-pointer hover:bg-gray-50"
                        onClick={() => setFormData(prev => ({ ...prev, contact: "" }))}
                      >
                        +{formData.countryCode}
                      </div>
                    )}

                    {/* Phone number input */}
                    <div className="flex-1 h-full">
                       <input 
                         name="contact" 
                         placeholder={t("form.phone.placeholder")} 
                         value={formData.contact} 
                         onChange={handlePhoneChange} 
                         className="w-full h-full px-3 text-base outline-none bg-white" 
                         required
                       />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full min-w-0">
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">{t("form.message.label")} *</label>
                <textarea name="message" rows="3" placeholder={t("form.message.placeholder")} value={formData.message} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none resize-none focus:ring-2 focus:ring-purple-500 bg-white" required />
              </div>

              <button type="submit" disabled={loading} className="w-full py-3 bg-[var(--color-primary)] text-white font-semibold rounded-md shadow-md hover:bg-purple-800 transition-colors flex items-center justify-center gap-2 mt-4">
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : t("form.submit")}
              </button>

            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default PartnerEcosystemSection;