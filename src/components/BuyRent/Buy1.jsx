import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { useTranslation } from "react-i18next";
import { apiService } from "../../manageApi/utils/custom.apiservice";
import { Country, State, City } from "country-state-city";
import {
  X, ArrowRight, Phone, Mail, MessageCircle, User, BedDouble,
  Home, Building2, MapPin, Banknote, FileText, ChevronDown
} from "lucide-react";
import { isValidPhoneNumber } from "libphonenumber-js";

const PHONE_LENGTH_RULES = {
  "971": 9, "91": 10, "7": 10, "1": 10, "44": 10,
};

const validatePhone = (countryCode, mobile) => {
  try {
    return isValidPhoneNumber(`+${countryCode}${mobile}`);
  } catch {
    return false;
  }
};

// ─── Custom Phone Country Select ─────────────────────────────────────────────
const PhoneCountrySelect = ({ countries, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);

  const selected = countries.find((c) => c.code === value) || countries[0];
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
    <div ref={ref} className="relative w-full h-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{ height: 50 }}
        className="flex items-center gap-1.5 w-full px-3 bg-white border-2 border-[#e2e8f0] rounded-xl cursor-pointer hover:border-blue-400 transition-all shadow-sm"
      >
        {selected && (
          <img
            src={`https://flagcdn.com/w20/${selected.iso.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${selected.iso.toLowerCase()}.png 2x`}
            alt={selected.name}
            className="w-5 h-[15px] rounded-sm object-cover flex-shrink-0"
            onError={(e) => { e.target.src = "https://flagcdn.com/w20/un.png"; }}
          />
        )}
        <span className="font-semibold text-sm text-gray-700 whitespace-nowrap">+{selected?.code}</span>
        <ChevronDown size={14} className="text-gray-400 ml-auto flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+5px)] left-0 min-w-[260px] bg-white border border-gray-200 rounded-xl shadow-2xl z-[200] overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filtered.slice(0, 100).map((c) => (
              <button
                key={c.iso}
                type="button"
                onClick={() => { onChange(c.code); setOpen(false); setSearch(""); }}
                className={`flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-blue-50 border-none text-sm transition-colors ${c.code === value ? "bg-purple-50 font-semibold" : ""}`}
              >
                <img
                  src={`https://flagcdn.com/w20/${c.iso.toLowerCase()}.png`}
                  alt=""
                  className="w-5 h-[15px] rounded-sm flex-shrink-0"
                  onError={(e) => { e.target.src = "https://flagcdn.com/w20/un.png"; }}
                />
                <span className="flex-1 text-gray-800">{c.name}</span>
                <span className="text-purple-600 font-semibold text-xs">+{c.code}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-4 text-xs text-gray-400 text-center">No results found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Custom Searchable Location Select ───────────────────────────────────────
const LocationSelect = ({ items, value, onChange, placeholder = "Select", disabled = false, isCountry = false }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);

  const getVal = (item) => isCountry ? item.isoCode : (item.isoCode || item.name);
  const selected = items.find((i) => getVal(i) === value) || null;
  const filtered = search
    ? items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    : items;

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSearch(""); }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        style={{ height: 52, borderRadius: "0.75rem", border: "2px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
        className={`flex items-center justify-between gap-2 w-full px-4 bg-white text-sm transition-all ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-blue-400"
        }`}
      >
        {selected ? (
          <div className="flex items-center gap-2 min-w-0">
            {isCountry && selected.isoCode && (
              <img
                src={`https://flagcdn.com/w20/${selected.isoCode.toLowerCase()}.png`}
                alt=""
                className="w-5 h-[15px] rounded-sm object-cover flex-shrink-0"
                onError={(e) => { e.target.src = "https://flagcdn.com/w20/un.png"; }}
              />
            )}
            <span className="text-gray-700 font-medium truncate">{selected.name}</span>
          </div>
        ) : (
          <span className="text-[#94a3b8]">{placeholder}</span>
        )}
        <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
      </button>

      {open && !disabled && (
        <div className="absolute top-[calc(100%+5px)] left-0 w-full min-w-[260px] bg-white border border-gray-200 rounded-xl shadow-2xl z-[200] overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filtered.slice(0, 100).map((item) => {
              const val = getVal(item);
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => { onChange(val); setOpen(false); setSearch(""); }}
                  className={`flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-blue-50 border-none text-sm transition-colors ${val === value ? "bg-purple-50 font-semibold" : ""}`}
                >
                  {isCountry && item.isoCode && (
                    <img
                      src={`https://flagcdn.com/w20/${item.isoCode.toLowerCase()}.png`}
                      alt=""
                      className="w-5 h-[15px] rounded-sm flex-shrink-0"
                      onError={(e) => { e.target.src = "https://flagcdn.com/w20/un.png"; }}
                    />
                  )}
                  <span className="flex-1 text-gray-800">{item.name}</span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="px-4 py-4 text-xs text-gray-400 text-center">No results found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Simple Option Select ─────────────────────────────────────────────────────
const SimpleSelect = ({ options, value, onChange, placeholder, icon }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{ height: 52, borderRadius: "0.75rem", border: "2px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
        className="premium-input-btn w-full flex items-center justify-between text-left pl-12 pr-4 bg-white hover:border-blue-400 transition-all"
      >
        <span className={selected ? "text-gray-800 text-sm" : "text-[#94a3b8] text-sm"}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
      </button>
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none">
          {icon}
        </div>
      )}
      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-2xl z-[200] overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`flex items-center w-full px-4 py-3 text-left text-sm hover:bg-blue-50 border-none transition-colors ${
                value === opt.value ? "bg-purple-50 font-semibold text-purple-700" : "text-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HeroSection({ openSellModal, setOpenSellModal }) {
  const navigate = useNavigate();
  const { t } = useTranslation("buy1");
  const openModal = openSellModal;
  const setOpenModal = setOpenSellModal;

  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    document.body.style.overflow = openModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [openModal]);

  const countryOptions = useMemo(() => {
    const priorityIsoCodes = ["AE", "IN", "RU", "US", "GB"];
    return Country.getAllCountries()
      .map((country) => ({ name: country.name, code: country.phonecode, iso: country.isoCode }))
      .sort((a, b) => {
        const aPriority = priorityIsoCodes.includes(a.iso);
        const bPriority = priorityIsoCodes.includes(b.iso);
        if (aPriority && !bPriority) return -1;
        if (!aPriority && bPriority) return 1;
        return a.name.localeCompare(b.name);
      });
  }, []);

  const [sellStates, setSellStates] = useState([]);
  const [sellCities, setSellCities] = useState([]);

  const [sellForm, setSellForm] = useState({
    first_name: "", last_name: "", email: "", country_code: "971", mobile: "",
    listing_type: "", location_country: null, state: null, city: null,
    area: "", project_name: "", bedroom_config: "", price: "", description: "",
    preferred_contact: "call",
  });

  const handleSellChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      const numericValue = value.replace(/\D/g, "");
      const limit = PHONE_LENGTH_RULES[sellForm.country_code] || 15;
      setSellForm((prev) => ({ ...prev, [name]: numericValue.slice(0, limit) }));
    } else {
      setSellForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSellCountryChange = (code) => {
    const limit = PHONE_LENGTH_RULES[code] || 15;
    setSellForm((prev) => ({ ...prev, country_code: code, mobile: prev.mobile.slice(0, limit) }));
  };

  const handleSellLocationCountry = (isoCode) => {
    setSellStates(State.getStatesOfCountry(isoCode));
    setSellCities([]);
    setSellForm((prev) => ({ ...prev, location_country: isoCode, state: null, city: null }));
  };

  const handleSellLocationState = (stateCode) => {
    setSellCities(City.getCitiesOfState(sellForm.location_country, stateCode));
    setSellForm((prev) => ({ ...prev, state: stateCode, city: null }));
  };

  const handleSellLocationCity = (cityName) => {
    setSellForm((prev) => ({ ...prev, city: cityName }));
  };

  const openNotification = (type, title, description) => {
    api[type]({ message: title, description, placement: "topRight" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validatePhone(sellForm.country_code, sellForm.mobile)) {
      openNotification("error", "Validation Error", "Please enter a valid phone number for selected country");
      setLoading(false);
      return;
    }
    if (!sellForm.location_country) {
      openNotification("error", "Validation Error", "Please select a country");
      setLoading(false);
      return;
    }
    if (!sellForm.state) {
      openNotification("error", "Validation Error", "Please select a state");
      setLoading(false);
      return;
    }
    if (sellCities.length > 0 && !sellForm.city) {
      openNotification("error", "Validation Error", "Please select a city");
      setLoading(false);
      return;
    }

    const countryName = Country.getCountryByCode(sellForm.location_country)?.name || "";
    const stateName = State.getStateByCodeAndCountry(sellForm.state, sellForm.location_country)?.name || sellForm.state;
    const cityName = sellForm.city || stateName;

    const payload = {
      first_name: sellForm.first_name.trim(),
      last_name: sellForm.last_name.trim(),
      phone_number: sellForm.mobile,
      country_code: `+${sellForm.country_code}`,
      email: sellForm.email.toLowerCase().trim(),
      enquiry_type: "sell",
      preferred_contact: sellForm.preferred_contact,
      message: sellForm.description || undefined,
      requirements: {
        property_type: sellForm.listing_type || undefined,
        location_preferences: [{ area: [cityName, stateName, countryName].filter(Boolean).join(", "), priority: 1 }],
        bedrooms: sellForm.bedroom_config ? Number(sellForm.bedroom_config) : undefined,
        budget_min: Number(sellForm.price) || undefined,
        additional_notes: [
          sellForm.project_name && `Project: ${sellForm.project_name}`,
          sellForm.area && `Area/Locality: ${sellForm.area}`,
        ].filter(Boolean).join(" | ") || undefined,
      },
    };

    try {
      const response = await apiService.post("/gridlead/website-lead", payload);
      if (response.success) {
        openNotification("success", "Request Submitted Successfully", t("toast.success", { name: sellForm.first_name }));
        setOpenModal(false);
        setSellForm({
          first_name: "", last_name: "", email: "", country_code: "971", mobile: "",
          listing_type: "", location_country: null, state: null, city: null,
          area: "", project_name: "", bedroom_config: "", price: "", description: "",
          preferred_contact: "call",
        });
        setSellStates([]);
        setSellCities([]);
        setTermsAccepted(false);
        setMarketingAccepted(false);
      }
    } catch (err) {
      console.error("Lead submission error:", err);
      openNotification("error", "Submission Failed", t("toast.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}

      {/* ── HERO SECTION ── */}
      <section className="relative w-full overflow-hidden font-dm h-140 bg-[var(--color-body)]">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat hero-bg-image">
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
          <h1
            className="mx-auto mb-8 max-w-5xl heading-light flex flex-col items-center gap-2 sm:gap-4 text-center"
            style={{ fontSize: "clamp(28px, 8vw, 54px)", lineHeight: "1.15" }}
          >
            <span>{t("hero.title.line1")}</span>
            <span>{t("hero.title.line2")}</span>
          </h1>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            <button
              onClick={() => navigate("/Property#rent")}
              className="px-5 sm:px-10 py-3 sm:py-4 text-sm sm:text-base bg-transparent border-2 border-white text-white font-extrabold rounded-lg shadow-md hover:bg-[#5C039B] hover:border-[#5C039B] hover:scale-105 transition-all"
            >
              {t("hero.buttons.rent")}
            </button>
            <button
              onClick={() => navigate("/Property#rent")}
              className="px-5 sm:px-10 py-3 sm:py-4 text-sm sm:text-base bg-transparent border-2 border-white text-white font-extrabold rounded-lg shadow-md hover:bg-[#5C039B] hover:border-[#5C039B] hover:scale-105 transition-all"
            >
              {t("hero.buttons.find")}
            </button>
            <button
              onClick={() => setOpenModal(true)}
              className="px-5 sm:px-10 py-3 sm:py-4 text-sm sm:text-base bg-transparent border-2 border-white text-white font-extrabold rounded-lg shadow-md hover:bg-[#5C039B] hover:border-[#5C039B] hover:scale-105 transition-all"
            >
              {t("hero.buttons.sell")}
            </button>
          </div>
        </div>
        <div className="clip-shape-left" />
        <div className="clip-shape-right" />
      </section>

      {/* ── SELL PROPERTY MODAL ── */}
      {openModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl relative max-h-[95vh] overflow-hidden flex flex-col border border-white/20">

            {/* Close */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg z-20"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="p-5 sm:p-8 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 border-b border-white/10 flex-shrink-0">
              <div className="flex flex-col items-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-2 text-center">
                  {t("modal.sell.title")}
                </h2>
                <p className="text-gray-600 text-center text-sm sm:text-base md:text-lg font-medium max-w-2xl px-2">
                  {t("modal.sell.desc")}
                </p>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="p-4 sm:p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">

                {/* Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="relative">
                    <input
                      name="first_name" value={sellForm.first_name} onChange={handleSellChange}
                      placeholder={`${t("form.firstName")} *`} required className="premium-input pl-12"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"><User size={18} /></div>
                  </div>
                  <div className="relative">
                    <input
                      name="last_name" value={sellForm.last_name} onChange={handleSellChange}
                      placeholder={`${t("form.lastName")} *`} required className="premium-input pl-12"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"><User size={18} /></div>
                  </div>
                </div>

                {/* Email */}
                <div className="relative">
                  <input
                    name="email" type="email" value={sellForm.email} onChange={handleSellChange}
                    placeholder={t("form.email")} required className="premium-input pl-12"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"><Mail size={18} /></div>
                </div>

                {/* Phone */}
                <div className="flex gap-3 items-stretch">
                  <div className="w-[130px] sm:w-[145px] flex-shrink-0">
                    <PhoneCountrySelect
                      countries={countryOptions}
                      value={sellForm.country_code}
                      onChange={handleSellCountryChange}
                    />
                  </div>
                  <div className="relative flex-1">
                    <input
                      name="mobile" type="text" inputMode="numeric"
                      value={sellForm.mobile} onChange={handleSellChange}
                      placeholder={`${t("form.phone")} *`} required
                      className="premium-input pl-12 w-full" style={{ height: 50 }}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"><Phone size={18} /></div>
                  </div>
                </div>

                {/* Sell fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

                  {/* Listing type */}
                  <SimpleSelect
                    value={sellForm.listing_type}
                    onChange={(val) => setSellForm((p) => ({ ...p, listing_type: val }))}
                    placeholder={t("form.sell.listing_type") || "Property Type"}
                    icon={<Home size={18} />}
                    options={[
                      { value: "Apartment", label: "Apartment" },
                      { value: "Villa", label: "Villa" },
                      { value: "Townhouse", label: "Townhouse" },
                      { value: "Penthouse", label: "Penthouse" },
                      { value: "Duplex", label: "Duplex" },
                      { value: "Studio", label: "Studio" },
                      { value: "Hotel Apartment", label: "Hotel Apartment" },
                      { value: "Office", label: "Office" },
                      { value: "Retail", label: "Retail" },
                      { value: "Warehouse", label: "Warehouse" },
                      { value: "Land / Plot", label: "Land / Plot" },
                    ]}
                  />

                  {/* Country */}
                  <LocationSelect
                    items={Country.getAllCountries()}
                    value={sellForm.location_country}
                    onChange={handleSellLocationCountry}
                    placeholder="Select Country"
                    isCountry={true}
                  />

                  {/* State */}
                  <LocationSelect
                    items={sellStates}
                    value={sellForm.state}
                    onChange={handleSellLocationState}
                    disabled={!sellStates.length}
                    placeholder="Select State"
                  />

                  {/* City */}
                  <LocationSelect
                    items={sellCities}
                    value={sellForm.city}
                    onChange={handleSellLocationCity}
                    disabled={!sellCities.length}
                    placeholder={t("form.sell.city")}
                  />

                  {/* Area */}
                  <div className="relative">
                    <input
                      name="area" value={sellForm.area} onChange={handleSellChange}
                      placeholder={t("form.sell.area")} className="premium-input pl-12"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"><MapPin size={18} /></div>
                  </div>

                  {/* Project name */}
                  <div className="relative">
                    <input
                      name="project_name" value={sellForm.project_name} onChange={handleSellChange}
                      placeholder={t("form.sell.project_name")} className="premium-input pl-12"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"><Building2 size={18} /></div>
                  </div>

                  {/* Bedroom */}
                  <SimpleSelect
                    value={sellForm.bedroom_config}
                    onChange={(val) => setSellForm((p) => ({ ...p, bedroom_config: val }))}
                    placeholder={t("form.sell.bedroom_config") || "Bedrooms"}
                    icon={<BedDouble size={18} />}
                    options={[
                      { value: "0", label: "Studio" },
                      { value: "1", label: "1 Bedroom" },
                      { value: "2", label: "2 Bedrooms" },
                      { value: "3", label: "3 Bedrooms" },
                      { value: "4", label: "4 Bedrooms" },
                      { value: "5", label: "5 Bedrooms" },
                      { value: "6", label: "6+ Bedrooms" },
                    ]}
                  />

                  {/* Price */}
                  <div className="relative">
                    <input
                      type="number" name="price" value={sellForm.price} onChange={handleSellChange}
                      placeholder={t("form.sell.price")} className="premium-input pl-12"
                      onWheel={(e) => e.target.blur()}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"><Banknote size={18} /></div>
                  </div>
                </div>

                {/* Description */}
                <div className="relative">
                  <textarea
                    name="description" value={sellForm.description} onChange={handleSellChange}
                    placeholder={t("form.sell.description")} rows={4}
                    className="premium-input pl-12 pt-4 resize-none"
                  />
                  <div className="absolute left-4 top-5 text-blue-600"><FileText size={18} /></div>
                </div>

                {/* Preferred contact */}
                <div>
                  <p className="text-gray-700 font-semibold mb-3 text-base sm:text-lg">{t("form.preferredContactTitle")}</p>
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    {[
                      { value: "call",     icon: <Phone size={16} />,         label: t("form.contact.call")     },
                      { value: "whatsapp", icon: <MessageCircle size={16} />, label: t("form.contact.whatsapp") },
                      { value: "email",    icon: <Mail size={16} />,          label: t("form.contact.email")    },
                    ].map(({ value, icon, label }) => (
                      <label key={value} className="relative cursor-pointer">
                        <input
                          type="radio" name="preferred_contact" value={value}
                          checked={sellForm.preferred_contact === value}
                          onChange={handleSellChange} className="sr-only peer"
                        />
                        <div className="p-2 sm:p-4 rounded-xl border-2 border-gray-200 bg-white transition-all duration-300 hover:border-blue-400 peer-checked:border-blue-600 peer-checked:bg-gradient-to-r peer-checked:from-blue-50 peer-checked:to-purple-50 peer-checked:shadow-lg">
                          <div className="flex flex-col items-center gap-1 sm:gap-2">
                            <div className={`p-1.5 sm:p-2 rounded-full ${sellForm.preferred_contact === value ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                              {icon}
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-center leading-tight">{label}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-3 text-gray-700 text-xs sm:text-sm p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 cursor-pointer">
                    <input
                      type="checkbox" className="mt-0.5 w-4 h-4 flex-shrink-0 cursor-pointer"
                      checked={marketingAccepted} onChange={(e) => setMarketingAccepted(e.target.checked)}
                    />
                    <span>{t("checkbox.marketing")}</span>
                  </label>
                  <label className="flex items-start gap-3 text-gray-700 text-xs sm:text-sm p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 cursor-pointer">
                    <input
                      type="checkbox" required className="mt-0.5 w-4 h-4 flex-shrink-0 cursor-pointer"
                      checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <span>{t("checkbox.terms")}</span>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !termsAccepted || !marketingAccepted}
                  className="group w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 sm:py-5 rounded-xl text-base sm:text-xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      {t("form.processing")}
                    </>
                  ) : (
                    <>
                      {t("form.submit.sell")}
                      <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} />
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .hero-bg-image {
          background-image: url("https://xotostaging.s3.me-central-1.amazonaws.com/properties/1770010905007-buy.jpg");
        }
        .clip-shape-left {
          position: absolute; bottom: -1px; left: 0;
          width: 30vw; max-width: 320px; min-width: 120px;
          height: clamp(28px, 3.5vw, 48px);
          background: var(--color-body); z-index: 3;
          clip-path: polygon(0 0, 55% 0, 100% 100%, 0% 100%);
        }
        .clip-shape-right {
          position: absolute; bottom: -1px; right: 0;
          width: 30vw; max-width: 320px; min-width: 120px;
          height: clamp(28px, 3.5vw, 48px);
          background: var(--color-body); z-index: 3;
          clip-path: polygon(47% 0, 100% 0, 100% 100%, 0% 100%);
          box-shadow: 0 -3px 0 white;
        }
        .premium-input {
          width: 100%; padding: 0.875rem 1.25rem 0.875rem 3rem;
          border-radius: 0.75rem; border: 2px solid #e2e8f0;
          background: white; outline: none; font-size: 0.9375rem;
          transition: all 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .premium-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
          transform: translateY(-1px);
        }
        .premium-input::placeholder { color: #94a3b8; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom,#3b82f6,#8b5cf6); border-radius: 4px; }
        @media (max-width: 480px) { .premium-input { font-size: 0.875rem; } }
      ` }} />
    </>
  );
}
