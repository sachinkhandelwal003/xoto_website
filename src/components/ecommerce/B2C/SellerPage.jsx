"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { notification } from "antd";
import { useForm, Controller } from "react-hook-form";
import { Country, State, City } from "country-state-city";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { apiService } from "../../../manageApi/utils/custom.apiservice";

// ─── Input class helper (Stripe/Apple style) ─────────────────────────────────
const ic = (err, hasIcon) =>
  `w-full rounded-xl border ${
    hasIcon ? "pl-11 pr-4" : "px-4"
  } h-[46px] outline-none text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50/40 focus:bg-white transition-all duration-200 ${
    err
      ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50/5"
      : "border-gray-200 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10"
  }`;

// ─── Field wrapper ────────────────────────────────────────────────────────────
const F = ({ label, required, error, children, half }) => (
  <div className={`${half ? "" : "w-full"} flex flex-col gap-1.5`}>
    {label && (
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-0.5 select-none">
        {label}
        {required && <span className="text-[var(--color-primary)] ml-1 font-bold">*</span>}
      </label>
    )}
    {children}
    {error && (
      <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1.5 animate-fade-in">
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        {error}
      </p>
    )}
  </div>
);

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spin = ({ white = true }) => (
  <span className={`inline-block w-[14px] h-[14px] border-2 border-t-transparent rounded-full animate-spin flex-shrink-0 ${
    white ? "border-white" : "border-[var(--color-primary)]"
  }`} />
);

// ─── Phone Country Select ─────────────────────────────────────────────────────
const PhoneCountrySelect = ({ countries, value, onChange, disabled }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);

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

  const selected = countries.find((c) => c.code === value) || countries[0];
  const filtered = search
    ? countries.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.includes(search.replace(/\D/g, ""))
      )
    : countries;

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`flex items-center gap-2 px-3.5 h-[46px] min-w-[110px] bg-gray-50/40 focus:bg-white border border-gray-200 rounded-xl transition-all duration-200 select-none ${
          disabled
            ? "cursor-not-allowed opacity-60 bg-gray-105"
            : "cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:border-[var(--color-primary)]"
        }`}
      >
        {selected && (
          <img
            src={`https://flagcdn.com/w20/${selected.iso.toLowerCase()}.png`}
            width={20}
            alt={selected.name}
            className="rounded-sm object-cover shadow-sm"
            onError={(e) => {
              e.target.src = "https://flagcdn.com/w20/un.png";
            }}
          />
        )}
        <span className="font-semibold text-sm text-gray-700">+{selected?.code}</span>
        <svg
          className="w-3.5 h-3.5 text-gray-400 ml-auto transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 min-w-[280px] bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-zoom-in">
          <div className="p-2 border-b border-gray-50">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full px-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 outline-none placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:bg-white transition-colors"
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto scrollbar-hide py-1">
            {filtered.slice(0, 100).map((c) => (
              <button
                key={c.iso}
                type="button"
                onClick={() => {
                  onChange(c.code);
                  setOpen(false);
                  setSearch("");
                }}
                className={`flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm transition-all duration-150 ${
                  c.code === value
                    ? "bg-purple-50 text-[var(--color-primary)] font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <img
                  src={`https://flagcdn.com/w20/${c.iso.toLowerCase()}.png`}
                  width={20}
                  alt=""
                  className="rounded-sm shadow-sm"
                  onError={(e) => {
                    e.target.src = "https://flagcdn.com/w20/un.png";
                  }}
                />
                <span className="flex-1 truncate">{c.name}</span>
                <span className="text-xs font-semibold text-[var(--color-primary)]/75">+{c.code}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="py-6 text-sm text-gray-400 text-center">No results found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Searchable Select ────────────────────────────────────────────────────────
const SS = ({ options, value, onChange, placeholder, disabled, error }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);

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

  const selected = options.find((o) => o.value === value);
  const filtered = search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`flex items-center justify-between w-full h-[46px] px-4 bg-gray-50/40 focus:bg-white border rounded-xl transition-all duration-200 select-none ${
          error
            ? "border-red-200 focus:ring-4 focus:ring-red-105"
            : "border-gray-200 focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:border-[var(--color-primary)]"
        } ${disabled ? "cursor-not-allowed opacity-60 bg-gray-100" : "cursor-pointer hover:border-gray-300"}`}
      >
        <span className={`text-sm truncate ${selected ? "text-gray-800 font-medium" : "text-gray-400"}`}>
          {selected?.label || placeholder}
        </span>
        <svg
          className="w-4 h-4 text-gray-400 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-zoom-in">
          <div className="p-2 border-b border-gray-50">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 outline-none placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:bg-white transition-colors"
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto scrollbar-hide py-1">
            {filtered.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                  setSearch("");
                }}
                className={`block w-full px-4 py-2.5 text-left text-sm transition-all duration-155 ${
                  o.value === value
                    ? "bg-purple-50 text-[var(--color-primary)] font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {o.label}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="py-6 text-sm text-gray-400 text-center">No results</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Multi Select ─────────────────────────────────────────────────────────────
const MS = ({ options, value = [], onChange, placeholder, error }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);

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

  const filtered = search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  const toggle = (v) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 w-full min-h-[46px] px-3 bg-gray-50/40 border rounded-xl text-left transition-all duration-200 select-none ${
          error
            ? "border-red-300 focus:ring-4 focus:ring-red-100"
            : "border-gray-200 focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:border-[var(--color-primary)]"
        }`}
      >
        {value.length === 0 ? (
          <span className="text-sm text-gray-400 pl-1">{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-1.5 py-1">
            {value.slice(0, 3).map((v) => {
              const opt = options.find((o) => o.value === v);
              return opt ? (
                <span
                  key={v}
                  className="inline-flex items-center gap-1 bg-purple-50 border border-purple-100 text-[var(--color-primary)] text-xs font-semibold px-2 py-0.5 rounded-lg shadow-sm animate-zoom-in"
                >
                  {opt.label}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(v);
                    }}
                    className="hover:bg-purple-100 text-[var(--color-primary)] hover:text-purple-700 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold transition-all"
                  >
                    ×
                  </button>
                </span>
              ) : null;
            })}
            {value.length > 3 && (
              <span className="text-xs font-semibold text-gray-400 self-center bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-lg">
                +{value.length - 3} more
              </span>
            )}
          </div>
        )}
        <svg
          className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-zoom-in">
          <div className="p-2 border-b border-gray-50">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full px-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 outline-none placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:bg-white transition-colors"
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto scrollbar-hide py-1">
            {filtered.map((o) => {
              const isChecked = value.includes(o.value);
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => toggle(o.value)}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm transition-all duration-150 hover:bg-gray-50 ${
                    isChecked ? "font-semibold text-[var(--color-primary)]" : "text-gray-700"
                  }`}
                >
                  <div
                    className={`w-4.5 h-4.5 rounded border transition-all flex items-center justify-center flex-shrink-0 ${
                      isChecked
                        ? "bg-[var(--color-primary)] border-[var(--color-primary)] shadow-sm"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isChecked && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="white" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="truncate">{o.label}</span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="py-6 text-sm text-gray-400 text-center">No categories found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── File Uploader ────────────────────────────────────────────────────────────
const FileUploader = ({ value, onChange, label }) => {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await apiService.post("/upload", fd);
      const body = res.data || res;
      const url =
        body.url ||
        body.secure_url ||
        body.file?.url ||
        body.file?.location ||
        body.data?.url;
      if (url) onChange(url);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files[0]);
      }}
      className={`border-2 border-dashed rounded-2xl p-5 cursor-pointer flex items-center gap-4 transition-all duration-200 bg-gray-50/30 ${
        value
          ? "border-emerald-500 bg-emerald-50/30 hover:bg-emerald-50/50"
          : "border-gray-200 hover:border-[var(--color-primary)] hover:bg-purple-50/20"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      {loading ? (
        <div className="flex items-center gap-3 w-full">
          <Spin white={false} />
          <span className="text-sm text-gray-500 font-medium">Uploading document...</span>
        </div>
      ) : value ? (
        <div className="flex items-center gap-3 w-full">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-emerald-800">Document Uploaded</p>
            <p className="text-[11px] text-gray-500 truncate mt-0.5">{value.split("/").pop()}</p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors select-none"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 w-full">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[var(--color-primary)] flex items-center justify-center shrink-0 border border-purple-100">
            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">Click or Drag File Here</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Step definitions ─────────────────────────────────────────────────────────
const STEPS = [
  { title: "Personal Info", sub: "Your account details" },
  { title: "Store Details", sub: "Shop & location" },
  { title: "Business & Bank", sub: "Registration & banking" },
  { title: "Contacts", sub: "Team information" },
  { title: "Documents", sub: "Upload required docs" },
];

// ─── OTP box ──────────────────────────────────────────────────────────────────
const OtpBox = ({ value, onChange, onVerify, loading, hint }) => (
  <div className="mt-3 p-4 bg-sky-50/50 border border-sky-100 rounded-2xl flex flex-col gap-3">
    <p className="text-xs text-sky-800 font-medium flex items-center gap-1.5">
      <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {hint}
    </p>
    <div className="flex gap-2.5">
      <input
        type="text"
        maxLength={6}
        placeholder="Enter 6-digit OTP"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 h-10 px-3 border border-sky-200 rounded-xl text-sm font-semibold tracking-widest text-center text-gray-800 bg-white outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 placeholder:text-gray-300 placeholder:tracking-normal placeholder:font-normal"
      />
      <button
        type="button"
        onClick={onVerify}
        disabled={loading}
        className="px-5 h-10 bg-[var(--color-primary)] text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-2 transition-all hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/20 shadow-md shadow-[var(--color-primary)]/10 disabled:opacity-75 disabled:cursor-not-allowed select-none"
      >
        {loading ? <Spin /> : null} Verify
      </button>
    </div>
  </div>
);

// ─── Verified badge ───────────────────────────────────────────────────────────
const VerifiedBadge = ({ label }) => (
  <div className="flex items-center gap-1.5 mt-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-lg w-fit shadow-sm">
    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span>{label} Verified</span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const SellerPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [enteredEmailOtp, setEnteredEmailOtp] = useState("");
  const [emailOtpLoading, setEmailOtpLoading] = useState(false);

  const [api, contextHolder] = notification.useNotification();
  const notify = (type, message, description) =>
    api[type]({ message, description, placement: "topRight" });

  const {
    control,
    handleSubmit,
    trigger,
    setError,
    clearErrors,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      mobile: { country_code: "971" },
      store_details: { country: "AE", social_links: { facebook: "", instagram: "" } },
      operations: { delivery_modes: [], avg_delivery_time_days: 3 },
      contacts: {
        primary_contact: { designation: "Owner" },
        support_contact: { designation: "Support Manager" },
      },
      documents: { trade_license: "", vat_certificate: "", emirates_id: "", bank_letter: "", moa_document: "" },
      meta: { agreed_to_terms: false },
    },
  });

  const selectedCountry = watch("store_details.country");
  const selectedState = watch("store_details.state");
  const watchMobileNumber = watch("mobile.number");

  const phoneCountryOptions = useMemo(() => {
    const priority = ["AE", "IN", "SA", "US", "GB", "AU"];
    return Country.getAllCountries()
      .filter((c) => c.phonecode)
      .map((c) => ({ name: c.name, code: c.phonecode, iso: c.isoCode }))
      .sort((a, b) => {
        const ap = priority.includes(a.iso),
          bp = priority.includes(b.iso);
        if (ap && !bp) return -1;
        if (!ap && bp) return 1;
        return a.name.localeCompare(b.name);
      });
  }, []);

  const countryOptions = useMemo(
    () => Country.getAllCountries().map((c) => ({ label: c.name, value: c.isoCode })),
    []
  );

  useEffect(() => {
    if (selectedCountry) setStatesList(State.getStatesOfCountry(selectedCountry));
    else setStatesList([]);
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState && selectedCountry)
      setCitiesList(City.getCitiesOfState(selectedCountry, selectedState));
    else setCitiesList([]);
  }, [selectedState, selectedCountry]);

  useEffect(() => {
    setLoadingCats(true);
    apiService
      .get("/products/get-all-category?limit=100")
      .then((res) => {
        const data = res.data?.data || res.data || res;
        if (Array.isArray(data)) setCategories(data.map((c) => ({ label: c.name, value: c._id })));
        else if (data.categories)
          setCategories(
            data.categories.map((c) => ({
              label: c.parent ? `${c.name} (${c.parent.name})` : c.name,
              value: c._id,
            }))
          );
      })
      .catch(() => {})
      .finally(() => setLoadingCats(false));
  }, []);

  // OTP
  const handleSendOtp = async () => {
    if (!(await trigger("mobile.number"))) return;
    let cc = getValues("mobile.country_code");
    if (!cc.startsWith("+")) cc = `+${cc}`;
    setOtpLoading(true);
    try {
      await apiService.post("/otp/send-otp", {
        country_code: cc,
        phone_number: getValues("mobile.number"),
      });
      notify("success", "OTP Sent", "Check your mobile for the code");
      setOtpSent(true);
      setOtpVerified(false);
    } catch (err) {
      const e = err.response?.data;
      if (e?.errors?.length)
        e.errors.forEach((x) =>
          setError(x.field === "mobile" ? "mobile.number" : x.field, {
            type: "manual",
            message: x.message,
          })
        );
      else notify("error", "OTP Error", e?.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!enteredOtp) {
      notify("error", "Error", "Please enter the OTP");
      return;
    }
    let cc = getValues("mobile.country_code");
    if (!cc.startsWith("+")) cc = `+${cc}`;
    setOtpLoading(true);
    try {
      await apiService.post("/otp/verify-otp", {
        country_code: cc,
        phone_number: getValues("mobile.number"),
        otp: enteredOtp,
      });
      notify("success", "Verified", "Mobile verified!");
      setOtpVerified(true);
      setOtpSent(false);
    } catch (err) {
      notify("error", "Invalid OTP", err?.response?.data?.message || "Invalid OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSendEmailOtp = async () => {
    if (!(await trigger("email"))) return;
    setEmailOtpLoading(true);
    try {
      await apiService.post("/otp/email-otp/send", { email: getValues("email") });
      notify("success", "OTP Sent", "Check your email inbox");
      setEmailOtpSent(true);
      setEmailOtpVerified(false);
    } catch (err) {
      const e = err.response?.data;
      if (e?.errors?.length)
        e.errors.forEach((x) => {
          if (x.field === "email") setError("email", { type: "manual", message: x.message });
        });
      else notify("error", "OTP Error", e?.message || "Failed to send OTP");
    } finally {
      setEmailOtpLoading(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!enteredEmailOtp) {
      notify("error", "Error", "Please enter the OTP");
      return;
    }
    setEmailOtpLoading(true);
    try {
      await apiService.post("/otp/email-otp/verify", {
        email: getValues("email"),
        otp: enteredEmailOtp,
      });
      notify("success", "Verified", "Email verified!");
      setEmailOtpVerified(true);
      setEmailOtpSent(false);
    } catch (err) {
      notify("error", "Invalid OTP", err?.response?.data?.message || "Invalid OTP");
    } finally {
      setEmailOtpLoading(false);
    }
  };

  const handleNext = async () => {
    let fields = [];
    if (currentStep === 0) {
      if (!otpVerified || !emailOtpVerified) {
        notify("error", "Verification Required", "Please verify your mobile and email first.");
        return;
      }
      fields = ["first_name", "last_name", "email", "mobile.number", "password", "confirmPassword"];
    } else if (currentStep === 1) {
      fields = [
        "store_details.store_name",
        "store_details.store_type",
        "store_details.categories",
        "store_details.store_address",
        "store_details.country",
        "store_details.state",
        "store_details.city",
        "store_details.pincode",
      ];
    } else if (currentStep === 2) {
      fields = [
        "registration.trade_license_number",
        "registration.trn_number",
        "bank_details.bank_account_number",
        "bank_details.iban",
        "bank_details.account_holder_name",
        "bank_details.bank_name",
      ];
    } else if (currentStep === 3) {
      fields = [
        "contacts.primary_contact.name",
        "contacts.primary_contact.mobile",
        "contacts.primary_contact.email",
      ];
    }
    if (await trigger(fields)) setCurrentStep((p) => p + 1);
  };

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      notify("error", "Error", "Passwords do not match");
      return;
    }
    if (!data.meta?.agreed_to_terms) {
      notify("error", "Error", "You must agree to the terms.");
      return;
    }
    setSubmitting(true);
    const countryObj = Country.getCountryByCode(data.store_details.country);
    const stateObj = State.getStateByCodeAndCountry(
      data.store_details.state,
      data.store_details.country
    );
    let cc = data.mobile.country_code;
    if (!cc.startsWith("+")) cc = `+${cc}`;
    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      mobile: { country_code: cc, number: data.mobile.number },
      password: data.password,
      confirmPassword: data.confirmPassword,
      is_email_verified: emailOtpVerified,
      is_mobile_verified: otpVerified,
      store_details: {
        ...data.store_details,
        country: countryObj?.name || data.store_details.country,
        state: stateObj?.name || data.store_details.state,
      },
      registration: data.registration,
      bank_details: data.bank_details,
      contacts: data.contacts,
      documents: {
        trade_license: { type: "Trade License", path: data.documents.trade_license },
        vat_certificate: { type: "VAT Certificate", path: data.documents.vat_certificate },
        emirates_id: { type: "Emirates ID", path: data.documents.emirates_id },
        bank_letter: { type: "Bank Letter/Cheque", path: data.documents.bank_letter },
        moa_document: { type: "MOA", path: data.documents.moa_document },
      },
      operations: {
        ...data.operations,
        avg_delivery_time_days: Number(data.operations.avg_delivery_time_days),
      },
      meta: { agreed_to_terms: data.meta.agreed_to_terms },
    };
    try {
      await apiService.post("/vendor/register", payload);
      setSuccess(true);
    } catch (err) {
      const res = err.response?.data;
      if (res?.errors?.length) {
        let step0Err = false;
        res.errors.forEach((e) => {
          const f = e.field === "mobile" || e.field === "mobile.number" ? "mobile.number" : e.field;
          setError(f, { type: "server", message: e.message });
          if (["email", "mobile", "mobile.number"].includes(f)) step0Err = true;
        });
        if (step0Err) setCurrentStep(0);
      } else if (res?.message) {
        const msg = res.message.toLowerCase();
        let set = false;
        if (msg.includes("email")) {
          setError("email", { type: "server", message: res.message });
          set = true;
        }
        if (msg.includes("mobile") || msg.includes("phone")) {
          setError("mobile.number", { type: "server", message: res.message });
          set = true;
        }
        if (set) setCurrentStep(0);
        else notify("error", "Registration Failed", res.message);
      } else notify("error", "Registration Failed", "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onError = (errs) => {
    if (errs.bank_details || errs.registration) {
      notify("error", "Fix Errors", "Check Business & Bank Details");
      setCurrentStep(2);
    } else if (errs.store_details) {
      notify("error", "Fix Errors", "Check Store Info");
      setCurrentStep(1);
    } else notify("error", "Fix Errors", "Please fill all required fields.");
  };

  const stateOptions = statesList.map((s) => ({ label: s.name, value: s.isoCode }));
  const cityOptions = citiesList.map((c) => ({ label: c.name, value: c.name }));
  const businessTypes = [
    { label: "Individual / Sole Proprietor", value: "Individual / Sole Proprietor" },
    { label: "Private Limited", value: "Private Limited" },
    { label: "Partnership", value: "Partnership" },
  ];

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-[#5C039B] flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-black/20" />
        {contextHolder}

        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center relative z-10 border border-gray-150 animate-zoom-in">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm shadow-emerald-500/10 animate-bounce">
            <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Registration Successful!</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            Your vendor account has been created and is currently under review. We will notify you or update your status within 24 to 48 hours.
          </p>
          <a
            href="/login"
            className="block w-full py-3.5 bg-gradient-to-r from-[var(--color-primary)] to-[#03A4F4] text-white font-bold rounded-xl shadow-lg shadow-[var(--color-primary)]/20 hover:brightness-105 transition-all text-sm select-none"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5C039B]/10 via-[#F2EBF7] to-[#03A4F4]/10 flex items-center justify-center p-4 md:p-8 font-sans">
      {contextHolder}

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden border border-gray-100/80">
        <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[650px] lg:h-[700px]">
          {/* ── Left Sidebar (Steps Only) ── */}
          <div className="bg-gradient-to-b from-[#5C039B] to-[#2E024F] text-white p-8 flex flex-col justify-center relative overflow-hidden select-none border-b lg:border-b-0 lg:border-r border-black/10">
            {/* Subtle dark tint cover */}
            <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none" />

            {/* Stepper Header */}
            <div className="relative z-10 mb-8">
              <h3 className="text-xl font-bold tracking-tight">Join as a Seller</h3>
              <p className="text-purple-200/80 text-xs mt-1">Grow your business on Xoto</p>
            </div>

            {/* Dynamic Stepper */}
            <div className="flex flex-col gap-5 relative z-10 pl-1 w-full animate-fade-in">
              {/* Stepper dynamic progress track line */}
              <div className="absolute left-[13px] top-4.5 bottom-4.5 w-0.5 bg-white/10 z-0 rounded-full">
                <div
                  className="w-full bg-[#64EF0A] transition-all duration-500 ease-out rounded-full shadow-[0_0_8px_rgba(100,239,10,0.5)]"
                  style={{ height: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                />
              </div>

              {STEPS.map((step, i) => {
                const isCompleted = currentStep > i;
                const isActive = currentStep === i;
                return (
                  <div key={i} className="flex items-center gap-3.5 group transition-all duration-300 relative z-10">
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-md ${
                          isCompleted
                            ? "bg-[#64EF0A] text-[#1F0135] shadow-[#64EF0A]/20"
                            : isActive
                            ? "bg-white text-[#5C039B] shadow-white/10 ring-2 ring-white/50 scale-105"
                            : "bg-white/5 text-white/50 border border-white/10"
                        }`}
                      >
                        {isCompleted ? (
                          <svg className="w-3.5 h-3.5 text-[#1F0135] animate-fade-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span>{i + 1}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 pt-0.5">
                      <h4
                        className={`text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                          isActive ? "text-white scale-[1.02] origin-left" : isCompleted ? "text-white/90" : "text-white/40"
                        }`}
                      >
                        {step.title}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Right Content Panel ── */}
          <div className="lg:col-span-3 p-6 md:p-10 flex flex-col h-full overflow-hidden">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight shrink-0">Seller Registration</h2>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mt-1.5 mb-6 shrink-0">
              Step {currentStep + 1} of {STEPS.length} — {STEPS[currentStep].title}
            </p>

            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="flex-1 flex flex-col min-h-0 overflow-hidden relative z-10 animate-fade-in"
            >
              {/* Scrollable Form Content */}
              <div className="flex-1 overflow-y-auto pr-2 py-1 space-y-6">
              
              {/* ── STEP 0: PERSONAL ── */}
              {currentStep === 0 && (
                <div className="flex flex-col gap-5 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <F label="First Name" required error={errors.first_name?.message}>
                      <Controller
                        name="first_name"
                        control={control}
                        rules={{ required: "Required" }}
                        render={({ field }) => (
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-primary)]/50">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <input {...field} className={ic(errors.first_name, true)} placeholder="John" />
                          </div>
                        )}
                      />
                    </F>
                    <F label="Last Name" required error={errors.last_name?.message}>
                      <Controller
                        name="last_name"
                        control={control}
                        rules={{ required: "Required" }}
                        render={({ field }) => (
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-primary)]/50">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <input {...field} className={ic(errors.last_name, true)} placeholder="Doe" />
                          </div>
                        )}
                      />
                    </F>
                  </div>

                  <F label="Email Address" required error={errors.email?.message}>
                    <div className="flex gap-2.5">
                      <Controller
                        name="email"
                        control={control}
                        rules={{
                          required: "Required",
                          pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                        }}
                        render={({ field }) => (
                          <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-primary)]/50">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <input
                              {...field}
                              type="email"
                              disabled={emailOtpVerified}
                              placeholder="john@example.com"
                              className={ic(errors.email, true)}
                              style={{
                                background: emailOtpVerified ? "#F0FDF4" : "",
                                borderColor: emailOtpVerified ? "#86EFAC" : "",
                              }}
                              onChange={(e) => {
                                field.onChange(e);
                                clearErrors("email");
                              }}
                            />
                          </div>
                        )}
                      />
                      <button
                        type="button"
                        disabled={emailOtpLoading}
                        onClick={
                          emailOtpVerified
                            ? () => {
                                setEmailOtpVerified(false);
                                setEmailOtpSent(false);
                                setEnteredEmailOtp("");
                              }
                            : handleSendEmailOtp
                        }
                        className={`px-5 h-[46px] rounded-xl text-xs font-bold transition-all select-none shadow-sm cursor-pointer ${
                          emailOtpVerified
                            ? "bg-gray-150 hover:bg-gray-200 text-gray-700"
                            : "bg-[var(--color-primary)] text-white hover:brightness-105 shadow-[var(--color-primary)]/10"
                        }`}
                      >
                        {emailOtpLoading ? <Spin /> : emailOtpVerified ? "Change" : "Send OTP"}
                      </button>
                    </div>
                    {emailOtpSent && !emailOtpVerified && (
                      <OtpBox
                        value={enteredEmailOtp}
                        onChange={setEnteredEmailOtp}
                        onVerify={handleVerifyEmailOtp}
                        loading={emailOtpLoading}
                        hint={`OTP sent to ${getValues("email")}`}
                      />
                    )}
                    {emailOtpVerified && <VerifiedBadge label="Email" />}
                  </F>

                  <F label="Mobile Number" required error={errors.mobile?.number?.message}>
                    <div className="flex gap-2.5">
                      <Controller
                        name="mobile.country_code"
                        control={control}
                        render={({ field }) => (
                          <PhoneCountrySelect
                            countries={phoneCountryOptions}
                            value={field.value}
                            onChange={(val) => {
                              field.onChange(val);
                              trigger("mobile.number");
                            }}
                            disabled={otpVerified || otpSent}
                          />
                        )}
                      />
                      <Controller
                        name="mobile.number"
                        control={control}
                        rules={{
                          required: "Required",
                          validate: (v) => {
                            if (!v) return "Required";
                            const cc = getValues("mobile.country_code");
                            const phone = parsePhoneNumberFromString(`+${cc}${v}`);
                            return (phone && phone.isValid()) || `Invalid number for +${cc}`;
                          },
                        }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="tel"
                            placeholder="501234567"
                            disabled={otpVerified || otpSent}
                            className={`flex-1 ${ic(errors.mobile?.number)}`}
                            style={{
                              background: otpVerified ? "#F0FDF4" : "",
                              borderColor: otpVerified ? "#86EFAC" : "",
                              opacity: otpVerified || otpSent ? 0.75 : 1,
                            }}
                            onChange={(e) => {
                              field.onChange(e.target.value.replace(/\D/g, ""));
                              clearErrors("mobile.number");
                              trigger("mobile.number");
                            }}
                          />
                        )}
                      />
                      {!otpVerified && !otpSent && (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={otpLoading || !watchMobileNumber || !!errors.mobile?.number}
                          className="px-5 h-[46px] bg-[var(--color-primary)] text-white rounded-xl text-xs font-bold transition-all select-none shadow-sm shadow-[var(--color-primary)]/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {otpLoading ? <Spin /> : "Send OTP"}
                        </button>
                      )}
                      {(otpSent || otpVerified) && (
                        <button
                          type="button"
                          onClick={() => {
                            setOtpSent(false);
                            setOtpVerified(false);
                            setEnteredOtp("");
                          }}
                          className="px-5 h-[46px] bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all select-none shadow-sm cursor-pointer"
                        >
                          Change
                        </button>
                      )}
                    </div>
                    {otpSent && (
                      <OtpBox
                        value={enteredOtp}
                        onChange={setEnteredOtp}
                        onVerify={handleVerifyOtp}
                        loading={otpLoading}
                        hint={`OTP sent to +${getValues("mobile.country_code")} ${watchMobileNumber}`}
                      />
                    )}
                    {otpVerified && <VerifiedBadge label="Mobile" />}
                  </F>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <F label="Password" required error={errors.password?.message}>
                      <Controller
                        name="password"
                        control={control}
                        rules={{
                          required: "Required",
                          minLength: { value: 6, message: "Min 6 characters" },
                        }}
                        render={({ field }) => (
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-primary)]/50">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                            <input
                              {...field}
                              type="password"
                              className={ic(errors.password, true)}
                              placeholder="••••••••"
                            />
                          </div>
                        )}
                      />
                    </F>
                    <F label="Confirm Password" required error={errors.confirmPassword?.message}>
                      <Controller
                        name="confirmPassword"
                        control={control}
                        rules={{ required: "Required" }}
                        render={({ field }) => (
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-primary)]/50">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                            <input
                              {...field}
                              type="password"
                              className={ic(errors.confirmPassword, true)}
                              placeholder="••••••••"
                            />
                          </div>
                        )}
                      />
                    </F>
                  </div>
                </div>
              )}

              {/* ── STEP 1: STORE ── */}
              {currentStep === 1 && (
                <div className="flex flex-col gap-5 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <F label="Store Name" required error={errors.store_details?.store_name?.message}>
                      <Controller
                        name="store_details.store_name"
                        control={control}
                        rules={{ required: "Required" }}
                        render={({ field }) => (
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-primary)]/50">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <input
                              {...field}
                              className={ic(errors.store_details?.store_name, true)}
                              placeholder="My Store"
                            />
                          </div>
                        )}
                      />
                    </F>
                    <F label="Business Type" required error={errors.store_details?.store_type?.message}>
                      <Controller
                        name="store_details.store_type"
                        control={control}
                        rules={{ required: "Required" }}
                        render={({ field }) => (
                          <SS
                            options={businessTypes}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select type"
                            error={errors.store_details?.store_type}
                          />
                        )}
                      />
                    </F>
                  </div>

                  <F label="Product Categories" required error={errors.store_details?.categories?.message}>
                    <Controller
                      name="store_details.categories"
                      control={control}
                      rules={{ required: "Required" }}
                      render={({ field }) => (
                        <MS
                          options={categories}
                          value={field.value || []}
                          onChange={field.onChange}
                          placeholder={loadingCats ? "Loading…" : "Select categories"}
                          error={errors.store_details?.categories}
                        />
                      )}
                    />
                  </F>

                  <F label="Store Address" required error={errors.store_details?.store_address?.message}>
                    <Controller
                      name="store_details.store_address"
                      control={control}
                      rules={{ required: "Required" }}
                      render={({ field }) => (
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-primary)]/50">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <input
                            {...field}
                            className={ic(errors.store_details?.store_address, true)}
                            placeholder="Building, Street, Area"
                          />
                        </div>
                      )}
                    />
                  </F>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <F label="Country" required error={errors.store_details?.country?.message}>
                      <Controller
                        name="store_details.country"
                        control={control}
                        rules={{ required: "Required" }}
                        render={({ field }) => (
                          <SS
                            options={countryOptions}
                            value={field.value}
                            onChange={(val) => {
                              field.onChange(val);
                              setValue("store_details.state", null);
                              setValue("store_details.city", null);
                            }}
                            placeholder="Country"
                            error={errors.store_details?.country}
                          />
                        )}
                      />
                    </F>
                    <F label="State / Emirate" required error={errors.store_details?.state?.message}>
                      <Controller
                        name="store_details.state"
                        control={control}
                        rules={{ required: "Required" }}
                        render={({ field }) => (
                          <SS
                            options={stateOptions}
                            value={field.value}
                            onChange={(val) => {
                              field.onChange(val);
                              setValue("store_details.city", null);
                            }}
                            placeholder="State"
                            error={errors.store_details?.state}
                          />
                        )}
                      />
                    </F>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <F label="City" required error={errors.store_details?.city?.message}>
                      <Controller
                        name="store_details.city"
                        control={control}
                        rules={{ required: "Required" }}
                        render={({ field }) => (
                          <SS
                            options={cityOptions}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="City"
                            error={errors.store_details?.city}
                          />
                        )}
                      />
                    </F>
                    <F label="PO Box / ZIP" required error={errors.store_details?.pincode?.message}>
                      <Controller
                        name="store_details.pincode"
                        control={control}
                        rules={{ required: "Required" }}
                        render={({ field }) => (
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-primary)]/50">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                              </svg>
                            </div>
                            <input
                              {...field}
                              className={ic(errors.store_details?.pincode, true)}
                              placeholder="12345"
                            />
                          </div>
                        )}
                      />
                    </F>
                  </div>
                </div>
              )}

              {/* ── STEP 2: BUSINESS & BANK ── */}
              {currentStep === 2 && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  {/* Business Registration */}
                  <div className="p-5 bg-gray-50/20 border border-gray-150 border-l-4 border-l-[#5C039B] rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-1.5 h-3.5 rounded-full bg-[var(--color-primary)]" />
                      <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider select-none">
                        Business Registration (UAE)
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <F label="Trade License No." required error={errors.registration?.trade_license_number?.message}>
                        <Controller
                          name="registration.trade_license_number"
                          control={control}
                          rules={{
                            required: "Required",
                            minLength: { value: 5, message: "Min 5 chars" },
                            pattern: { value: /^[A-Za-z0-9\-\/]+$/, message: "Letters, numbers, - / only" },
                          }}
                          render={({ field }) => (
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-primary)]/50">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <input
                                {...field}
                                className={ic(errors.registration?.trade_license_number, true)}
                                placeholder="CN-1234567"
                              />
                            </div>
                          )}
                        />
                      </F>
                      <F label="VAT / TRN Number" required error={errors.registration?.trn_number?.message}>
                        <Controller
                          name="registration.trn_number"
                          control={control}
                          rules={{
                            required: "Required",
                            pattern: { value: /^\d{15}$/, message: "Exactly 15 digits" },
                          }}
                          render={({ field }) => (
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-primary)]/50">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15l6-6m-5 5a1 1 0 11-2 0 1 1 0 012 0zM4 4h16v16H4V4z" />
                                </svg>
                              </div>
                              <input
                                {...field}
                                className={ic(errors.registration?.trn_number, true)}
                                placeholder="100234567890003"
                                maxLength={15}
                                onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                              />
                            </div>
                          )}
                        />
                      </F>
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="p-5 bg-gray-50/20 border border-gray-150 border-l-4 border-l-[#03A4F4] rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-1.5 h-3.5 rounded-full bg-[#03A4F4]" />
                      <p className="text-xs font-bold text-sky-705 uppercase tracking-wider select-none">
                        Bank Details (UAE)
                      </p>
                    </div>
                    <div className="flex flex-col gap-5">
                      <F label="Account Holder Name" required error={errors.bank_details?.account_holder_name?.message}>
                        <Controller
                          name="bank_details.account_holder_name"
                          control={control}
                          rules={{
                            required: "Required",
                            pattern: { value: /^[A-Za-z ]+$/, message: "Letters only" },
                          }}
                          render={({ field }) => (
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-primary)]/50">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <input
                                {...field}
                                className={ic(errors.bank_details?.account_holder_name, true)}
                                placeholder="John Doe"
                              />
                            </div>
                          )}
                        />
                      </F>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <F label="Bank Name" required error={errors.bank_details?.bank_name?.message}>
                          <Controller
                            name="bank_details.bank_name"
                            control={control}
                            rules={{
                              required: "Required",
                              pattern: { value: /^[A-Za-z ]+$/, message: "Letters only" },
                            }}
                            render={({ field }) => (
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-primary)]/50">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
                                  </svg>
                                </div>
                                <input
                                  {...field}
                                  className={ic(errors.bank_details?.bank_name, true)}
                                  placeholder="Emirates NBD"
                                />
                              </div>
                            )}
                          />
                        </F>
                        <F label="Account Number" required error={errors.bank_details?.bank_account_number?.message}>
                          <Controller
                            name="bank_details.bank_account_number"
                            control={control}
                            rules={{
                              required: "Required",
                              pattern: { value: /^\d{6,20}$/, message: "6–20 digits" },
                            }}
                            render={({ field }) => (
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-primary)]/50">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                  </svg>
                                </div>
                                <input
                                  {...field}
                                  className={ic(errors.bank_details?.bank_account_number, true)}
                                  placeholder="1234567890"
                                />
                              </div>
                            )}
                          />
                        </F>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <F label="IBAN" required error={errors.bank_details?.iban?.message}>
                          <Controller
                            name="bank_details.iban"
                            control={control}
                            rules={{
                              required: "Required",
                              pattern: { value: /^AE\d{21}$/, message: "UAE IBAN: AE + 21 digits" },
                            }}
                            render={({ field }) => (
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-primary)]/50">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                  </svg>
                                </div>
                                <input
                                  {...field}
                                  className={ic(errors.bank_details?.iban, true)}
                                  placeholder="AE070331234567890123456"
                                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                />
                              </div>
                            )}
                          />
                        </F>
                        <F label="SWIFT / BIC" error={errors.bank_details?.swift_code?.message}>
                          <Controller
                            name="bank_details.swift_code"
                            control={control}
                            rules={{
                              validate: (v) =>
                                !v || /^[A-Z0-9]{8,11}$/.test(v) || "8–11 alphanumeric",
                            }}
                            render={({ field }) => (
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-primary)]/50">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9" />
                                  </svg>
                                </div>
                                <input
                                  {...field}
                                  className={ic(errors.bank_details?.swift_code, true)}
                                  placeholder="EBILAEAD"
                                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                />
                              </div>
                            )}
                          />
                        </F>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 3: CONTACTS ── */}
              {currentStep === 3 && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  {/* Primary Contact */}
                  <div className="p-5 bg-gray-50/20 border border-gray-150 border-l-4 border-l-[#5C039B] rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-1.5 h-3.5 rounded-full bg-emerald-605" />
                      <p className="text-xs font-bold text-gray-850 uppercase tracking-wider select-none">
                        Primary Contact
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <F label="Full Name" required error={errors.contacts?.primary_contact?.name?.message}>
                        <Controller
                          name="contacts.primary_contact.name"
                          control={control}
                          rules={{ required: "Required" }}
                          render={({ field }) => (
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-primary)]/50">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <input
                                {...field}
                                className={ic(errors.contacts?.primary_contact?.name, true)}
                                placeholder="John Doe"
                              />
                            </div>
                          )}
                        />
                      </F>
                      <F label="Designation">
                        <Controller
                          name="contacts.primary_contact.designation"
                          control={control}
                          render={({ field }) => (
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-primary)]/50">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                                </svg>
                              </div>
                              <input {...field} className={ic(false, true)} placeholder="Owner" />
                            </div>
                          )}
                        />
                      </F>
                      <F label="Mobile" required error={errors.contacts?.primary_contact?.mobile?.message}>
                        <Controller
                          name="contacts.primary_contact.mobile"
                          control={control}
                          rules={{
                            required: "Required",
                            minLength: { value: 9, message: "Min 9 digits" },
                          }}
                          render={({ field }) => (
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-primary)]/50">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1" />
                                </svg>
                              </div>
                              <input
                                {...field}
                                className={ic(errors.contacts?.primary_contact?.mobile, true)}
                                placeholder="501234567"
                                maxLength={15}
                                onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                              />
                            </div>
                          )}
                        />
                      </F>
                      <F label="Email" required error={errors.contacts?.primary_contact?.email?.message}>
                        <Controller
                          name="contacts.primary_contact.email"
                          control={control}
                          rules={{
                            required: "Required",
                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                          }}
                          render={({ field }) => (
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-primary)]/50">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <input
                                {...field}
                                type="email"
                                className={ic(errors.contacts?.primary_contact?.email, true)}
                                placeholder="john@example.com"
                              />
                            </div>
                          )}
                        />
                      </F>
                    </div>
                  </div>

                  {/* Support Contact */}
                  <div className="p-5 bg-gray-50/20 border border-gray-150 border-l-4 border-l-gray-300 rounded-2xl animate-fade-in">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-1.5 h-3.5 rounded-full bg-gray-400" />
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider select-none">
                        Support Contact <span className="font-normal text-[11px] text-gray-400 lowercase italic ml-1">(Optional)</span>
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <F label="Full Name">
                        <Controller
                          name="contacts.support_contact.name"
                          control={control}
                          render={({ field }) => (
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-primary)]/50">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <input {...field} className={ic(false, true)} placeholder="Jane Doe" />
                            </div>
                          )}
                        />
                      </F>
                      <F label="Designation">
                        <Controller
                          name="contacts.support_contact.designation"
                          control={control}
                          render={({ field }) => (
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-primary)]/50">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                                </svg>
                              </div>
                              <input {...field} className={ic(false, true)} placeholder="Support Manager" />
                            </div>
                          )}
                        />
                      </F>
                      <F label="Mobile" error={errors.contacts?.support_contact?.mobile?.message}>
                        <Controller
                          name="contacts.support_contact.mobile"
                          control={control}
                          rules={{ minLength: { value: 9, message: "Min 9 digits" } }}
                          render={({ field }) => (
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-primary)]/50">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1" />
                                </svg>
                              </div>
                              <input
                                {...field}
                                className={ic(errors.contacts?.support_contact?.mobile, true)}
                                placeholder="501234567"
                                maxLength={15}
                                onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                              />
                            </div>
                          )}
                        />
                      </F>
                      <F label="Email" error={errors.contacts?.support_contact?.email?.message}>
                        <Controller
                          name="contacts.support_contact.email"
                          control={control}
                          rules={{ pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } }}
                          render={({ field }) => (
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-primary)]/50">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <input
                                {...field}
                                type="email"
                                className={ic(errors.contacts?.support_contact?.email, true)}
                                placeholder="support@example.com"
                              />
                            </div>
                          )}
                        />
                      </F>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 4: DOCUMENTS ── */}
              {currentStep === 4 && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      {
                        name: "documents.trade_license",
                        label: "Trade License Copy",
                        sub: "Mandatory",
                        req: true,
                      },
                      {
                        name: "documents.vat_certificate",
                        label: "VAT Certificate (TRN)",
                        sub: "Mandatory",
                        req: true,
                      },
                      {
                        name: "documents.emirates_id",
                        label: "Emirates ID",
                        sub: "Owner/Manager — Mandatory",
                        req: true,
                      },
                      {
                        name: "documents.bank_letter",
                        label: "Bank Confirmation Letter",
                        sub: "With IBAN — Optional",
                      },
                      {
                        name: "documents.moa_document",
                        label: "Memorandum of Association",
                        sub: "MOA — Optional",
                      },
                    ].map((doc) => (
                      <F
                        key={doc.name}
                        label={`${doc.label}${doc.req ? " *" : ""}`}
                        error={errors.documents?.[doc.name.split(".")[1]]?.message}
                      >
                        <Controller
                          name={doc.name}
                          control={control}
                          rules={{
                            validate: (v) =>
                              currentStep !== 4 || !doc.req || !!v || "Document is required",
                          }}
                          render={({ field }) => (
                            <FileUploader
                              value={field.value}
                              onChange={field.onChange}
                              label={doc.sub}
                            />
                          )}
                        />
                      </F>
                    ))}
                  </div>

                  <div className="mt-4 pt-6 border-t border-gray-150">
                    <Controller
                      name="meta.agreed_to_terms"
                      control={control}
                      rules={{ required: "You must agree" }}
                      render={({ field }) => (
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]/20 cursor-pointer flex-shrink-0 accent-[var(--color-primary)] shadow-sm"
                          />
                          <span className="text-xs text-gray-650 leading-relaxed font-semibold">
                            I agree to the{" "}
                            <a href="/terms" className="text-[var(--color-primary)] font-bold hover:underline">
                              Terms and Conditions
                            </a>{" "}
                            and{" "}
                            <a
                              href="/privacy"
                              className="text-[var(--color-primary)] font-bold hover:underline"
                            >
                              Privacy Policy
                            </a>
                          </span>
                        </label>
                      )}
                    />
                    {errors.meta?.agreed_to_terms && (
                      <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {errors.meta.agreed_to_terms.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              </div>

              {/* Action Buttons inline at bottom */}
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-150 shrink-0 select-none">
                <button
                  type="button"
                  onClick={() => {
                    if (currentStep === 0) window.history.back();
                    else setCurrentStep((p) => p - 1);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-gray-900 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-155 shadow-sm cursor-pointer select-none"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  {currentStep === 0 ? "Back" : "Previous"}
                </button>

                <div className="flex items-center gap-4">
                  {currentStep < STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/95 text-white rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-150 shadow-md shadow-[var(--color-primary)]/20 select-none cursor-pointer"
                    >
                      Continue
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[#03A4F4] hover:brightness-105 text-white rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-150 shadow-md shadow-[var(--color-primary)]/25 disabled:opacity-75 disabled:cursor-not-allowed select-none cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <Spin /> Submitting…
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Complete Registration
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerPage;
