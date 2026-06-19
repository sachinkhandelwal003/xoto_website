import React, { useState, useMemo, useRef, useEffect } from "react";
import { notification } from "antd";
import { useTranslation } from "react-i18next";
import { apiService } from "../../manageApi/utils/custom.apiservice";
import { parsePhoneNumberFromString, validatePhoneNumberLength } from "libphonenumber-js";
import { ChevronDown } from "lucide-react";
import { Country, State, City } from "country-state-city";

import waveint6 from "../../assets/img/wave/waveint6.png";
import waveint from "../../assets/img/wave/waveint4.png";
import image from "../../assets/img/bggg.png";

/* ---------------- PHONE CONFIG ---------------- */
const COUNTRY_CONFIG = {
  "971": { country: "UAE", digits: 9 },
  "91": { country: "India", digits: 10 },
};

const getPhoneConfig = (code) =>
  COUNTRY_CONFIG[code] || { country: "Unknown", digits: 10 };

const validatePhone = (countryCode, phone) => {
  if (!phone) return "Phone number is required";
  const fullNumber = `+${countryCode}${phone}`;
  const phoneObj = parsePhoneNumberFromString(fullNumber);
  if (!phoneObj) return "Invalid phone number";
  const lengthError = validatePhoneNumberLength(phoneObj.nationalNumber, phoneObj.country);
  if (lengthError === "TOO_SHORT") return "Phone number is too short";
  if (lengthError === "TOO_LONG") return "Phone number is too long";
  if (!phoneObj.isValid()) return "Invalid phone number for selected country";
  if (phoneObj.getType() === "FIXED_LINE") return "Landline numbers are not allowed";
  if (countryCode === "971" && !/^(50|52|54|55|56|58)/.test(phone)) return "Invalid UAE mobile number";
  if (countryCode === "91" && !/^[6-9]/.test(phone)) return "Invalid Indian mobile number";
  return "";
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
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 h-[50px] sm:h-[58px] w-full px-3 bg-[#F9FAFB] border border-gray-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-[#FAF5FF] transition-all"
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
        <span className="font-semibold text-sm text-gray-700">+{selected?.code}</span>
        <ChevronDown size={14} className="text-gray-400 ml-auto flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+5px)] left-0 w-full min-w-[260px] bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-500"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.slice(0, 100).map((c) => (
              <button
                key={c.iso}
                type="button"
                onClick={() => { onChange(c.code); setOpen(false); setSearch(""); }}
                className={`flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-[#FAF5FF] border-none text-sm transition-colors ${c.code === value ? "bg-[#F3E8FF] font-semibold" : ""}`}
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

// ─── Searchable Location Select ───────────────────────────────────────────────
const SearchableLocationSelect = ({
  items, value, onChange, placeholder = "Select", disabled = false, isCountry = false,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);

  const selected = items.find((i) => (isCountry ? i.isoCode : i.isoCode || i.name) === value) || null;
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
        className={`flex items-center justify-between gap-2 px-3 h-[50px] sm:h-[58px] w-full border border-gray-300 rounded-xl text-sm transition-all ${
          disabled
            ? "bg-gray-100 cursor-not-allowed opacity-60"
            : "bg-[#F9FAFB] cursor-pointer hover:border-purple-500 hover:bg-[#FAF5FF]"
        }`}
      >
        {selected ? (
          <div className="flex items-center gap-2">
            {isCountry && selected.isoCode && (
              <img
                src={`https://flagcdn.com/w20/${selected.isoCode.toLowerCase()}.png`}
                alt=""
                className="w-5 h-[15px] rounded-sm object-cover"
                onError={(e) => { e.target.src = "https://flagcdn.com/w20/un.png"; }}
              />
            )}
            <span className="font-medium text-gray-700">{selected.name}</span>
          </div>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
      </button>

      {open && !disabled && (
        <div className="absolute top-[calc(100%+5px)] left-0 w-full min-w-[260px] bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-500"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.slice(0, 100).map((c) => {
              const val = isCountry ? c.isoCode : c.isoCode || c.name;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => { onChange(val); setOpen(false); setSearch(""); }}
                  className={`flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-[#FAF5FF] border-none text-sm transition-colors ${val === value ? "bg-[#F3E8FF]" : ""}`}
                >
                  {isCountry && c.isoCode && (
                    <img
                      src={`https://flagcdn.com/w20/${c.isoCode.toLowerCase()}.png`}
                      alt=""
                      className="w-5 h-[15px] rounded-sm flex-shrink-0"
                      onError={(e) => { e.target.src = "https://flagcdn.com/w20/un.png"; }}
                    />
                  )}
                  <span className="flex-1 text-gray-800">{c.name}</span>
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
const SimpleSelect = ({ options, value, onChange, placeholder }) => {
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
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center justify-between gap-2 w-full px-4 h-[50px] sm:h-[58px] border border-gray-300 rounded-xl text-sm bg-[#F9FAFB] cursor-pointer hover:border-purple-500 hover:bg-[#FAF5FF] transition-all`}
      >
        <span className={selected ? "text-gray-700 font-medium" : "text-gray-400"}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
      </button>
      {open && (
        <div className="absolute top-[calc(100%+5px)] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`flex items-center w-full px-4 py-3 text-left text-sm hover:bg-purple-50 border-none transition-colors ${
                value === opt.value ? "bg-purple-100 font-semibold text-purple-700" : "text-gray-700"
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
export default function HeroSection() {
  const { t } = useTranslation("buy7");
  const [api, contextHolder] = notification.useNotification();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "971",
    phone: "",
    lookingFor: "",
    budget: "",
    location_country: null,
    state: null,
    city: null,
  });

  const [loading, setLoading] = useState(false);
  const [countriesList] = useState(Country.getAllCountries());
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);

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

  const showNotification = (type, msg) =>
    api[type]({ message: msg, placement: "topRight" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryCodeChange = (code) => {
    setForm((prev) => ({ ...prev, countryCode: code, phone: "" }));
  };

  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    const max = getPhoneConfig(form.countryCode).digits || 15;
    if (digitsOnly.length > max) return;
    setForm((prev) => ({ ...prev, phone: digitsOnly }));
  };

  const handleLocationCountryChange = (isoCode) => {
    setStatesList(State.getStatesOfCountry(isoCode));
    setCitiesList([]);
    setForm((prev) => ({ ...prev, location_country: isoCode, state: null, city: null }));
  };

  const handleLocationStateChange = (stateCode) => {
    setCitiesList(City.getCitiesOfState(form.location_country, stateCode));
    setForm((prev) => ({ ...prev, state: stateCode, city: null }));
  };

  const handleLocationCityChange = (cityName) => {
    setForm((prev) => ({ ...prev, city: cityName }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.location_country) {
      showNotification("error", "Please select a country");
      return;
    }

    const phoneError = validatePhone(form.countryCode, form.phone);
    if (phoneError) {
      showNotification("error", phoneError);
      return;
    }

    setLoading(true);

    const countryName = Country.getCountryByCode(form.location_country)?.name || "";
    const stateName = State.getStateByCodeAndCountry(form.state, form.location_country)?.name || "";

    const enquiryTypeMap = { buy: "buy", sell: "sell", rent: "rent" };
    const enquiry_type = enquiryTypeMap[form.lookingFor?.toLowerCase()] || "general_enquiry";

    const locationArea = [form.city, stateName, countryName].filter(Boolean).join(", ");

    try {
      const res = await apiService.post("/gridlead/website-lead", {
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        phone_number: form.phone,
        country_code: `+${form.countryCode}`,
        email: form.email.trim().toLowerCase(),
        enquiry_type,
        preferred_contact: "whatsapp",
        requirements: {
          location_preferences: locationArea
            ? [{ area: locationArea, priority: 1 }]
            : undefined,
          budget_min: form.budget ? Number(form.budget) : undefined,
        },
      });

      if (res?.success) {
        showNotification("success", t("success"));
        setForm({
          firstName: "", lastName: "", email: "",
          countryCode: "971", phone: "", lookingFor: "",
          budget: "", location_country: null, state: null, city: null,
        });
      }
    } catch (error) {
      showNotification("error", t("genericError") || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full px-5 py-4 rounded-xl border border-gray-300 outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm";

  return (
    <>
      {contextHolder}

      <section className="relative w-full bg-[var(--color-body)] py-16 overflow-hidden px-4 sm:px-0">
        <div className="absolute top-0 left-0 w-full z-0">
          <img src={waveint6} alt="" className="w-full" />
        </div>
        <div className="absolute -bottom-30 left-0 w-full z-0">
          <img src={waveint} alt="" className="w-full" />
        </div>

        <div className="max-w-8xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="z-20 flex flex-col gap-[20px] items-center lg:items-start">
            <h1 className="font-['DM_Sans'] font-semibold tracking-[-0.03em] text-[#020202]
                           text-[32px] leading-tight
                           sm:text-[42px]
                           lg:text-[60px] lg:leading-[60px] lg:max-w-[494px] lg:ml-20
                           text-center lg:text-left">
              {t("heroTitle")}
            </h1>
            <p className="font-['DM_Sans'] font-semibold text-[#547593]
                          text-[16px] leading-normal px-4
                          lg:text-[24px] lg:leading-[33px] lg:max-w-[482px] lg:ml-20 lg:px-0
                          text-center lg:text-left">
              {t("heroSub")}
            </p>
            <img
              src={image}
              alt=""
              className="w-full max-w-[590px] sm:max-w-[420px] lg:max-w-[590px] mt-[16px] lg:mt-[24px]"
            />
          </div>

          {/* RIGHT FORM */}
          <div className="z-20">
            <div className="bg-white shadow-[0_0_30px_rgba(92,3,155,0.3)] rounded-3xl p-8 max-w-lg mx-auto border border-purple-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{t("formTitle")}</h2>
              <p className="text-gray-800 font-semibold mb-8">{t("formSub")}</p>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Name */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder={t("firstName")}
                    required
                    className={inputCls}
                  />
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder={t("lastName")}
                    required
                    className={inputCls}
                  />
                </div>

                {/* Email */}
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t("email")}
                  required
                  className={inputCls}
                />

                {/* Phone with Country Code */}
                <div className="flex gap-3 items-stretch">
                  <div className="w-[110px] sm:w-[130px] flex-shrink-0">
                    <PhoneCountrySelect
                      countries={phoneCountryOptions}
                      value={form.countryCode}
                      onChange={handleCountryCodeChange}
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    placeholder={`Phone (${getPhoneConfig(form.countryCode).digits} digits)`}
                    required
                    className="min-w-0 flex-1 px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-gray-300 outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm"
                  />
                </div>

                {/* Country & Looking For */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SearchableLocationSelect
                    items={countriesList}
                    value={form.location_country}
                    onChange={handleLocationCountryChange}
                    placeholder="Select Country"
                    isCountry={true}
                  />
                  <SimpleSelect
                    value={form.lookingFor}
                    onChange={(val) => setForm((p) => ({ ...p, lookingFor: val }))}
                    placeholder={t("lookingFor") || "Looking For"}
                    options={[
                      { value: "Buy", label: "Buy" },
                      { value: "Sell", label: "Sell" },
                      { value: "Rent", label: "Rent" },
                    ]}
                  />
                </div>

                {/* State & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SearchableLocationSelect
                    items={statesList}
                    value={form.state}
                    onChange={handleLocationStateChange}
                    disabled={!statesList.length}
                    placeholder="State"
                  />
                  <SearchableLocationSelect
                    items={citiesList}
                    value={form.city}
                    onChange={handleLocationCityChange}
                    disabled={!citiesList.length}
                    placeholder="City"
                  />
                </div>

                {/* Budget */}
                <input
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder={t("budget")}
                  className={inputCls}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--color-primary)] text-white font-bold py-4 sm:py-5 rounded-xl transition hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? t("submitting") : t("submit")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
