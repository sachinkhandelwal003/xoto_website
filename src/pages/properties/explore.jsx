import React, { useState, useEffect, useMemo } from "react";
import img4 from "../../assets/img/IMG9.png";
import toast, { Toaster } from "react-hot-toast";
import { Country } from "country-state-city";
import { apiService } from "../../manageApi/utils/custom.apiservice";
import { parsePhoneNumberFromString, validatePhoneNumberLength } from "libphonenumber-js";
import bedicon from "../../assets/img/buy/icon-bed.png";
import tubicon from "../../assets/img/buy/icon-tub.png";
import layouticon from "../../assets/img/buy/icon-layout.png";

const FALLBACK_IMAGE = "/assets/img/fallback-property.jpg";

const PHONE_LENGTH_RULES = {
  "971": 9, "91": 10, "966": 9, "1": 10, "44": 10, "61": 9,
};

const validatePhone = (countryCode, mobile) => {
  if (!mobile) return "Mobile is required";
  const fullNumber = `+${countryCode}${mobile}`;
  const phoneNumber = parsePhoneNumberFromString(fullNumber);
  if (!phoneNumber) return "Invalid mobile number";
  const lengthError = validatePhoneNumberLength(phoneNumber.nationalNumber, phoneNumber.country);
  if (lengthError === "TOO_SHORT") return "Number is too short";
  if (lengthError === "TOO_LONG") return "Number is too long";
  if (!phoneNumber.isValid()) return "Invalid mobile number for selected country";
  if (phoneNumber.getType() === "FIXED_LINE") return "Landline numbers are not allowed";
  if (countryCode === "971" && !/^(50|52|54|55|56|58)/.test(mobile)) return "Invalid UAE mobile prefix";
  return "";
};

// ── Tag color ─────────────────────────────────────────────────────────────────
const tagStyle = (tag) => {
  const t = (tag || "").toLowerCase();
  if (t === "rent") return { bg: "#e0f2fe", color: "#0369a1" };
  if (t === "sell" || t === "secondary") return { bg: "#ede9fe", color: "#5C039B" };
  return { bg: "#f0fdf4", color: "#166534" };
};

const Page2 = () => {
  const [properties, setProperties] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [errors, setErrors] = useState({});

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  const [formData, setFormData] = useState({
    first_name: "", last_name: "", email: "", country_code: "971", mobile: "",
  });

  const phoneCountryOptions = useMemo(() => {
    const priorityIsoCodes = ["AE", "IN", "SA", "US", "GB", "AU"];
    return Country.getAllCountries().map((c) => ({
      name: c.name, code: c.phonecode, iso: c.isoCode,
    })).sort((a, b) => {
      const ap = priorityIsoCodes.includes(a.iso);
      const bp = priorityIsoCodes.includes(b.iso);
      if (ap && !bp) return -1; if (!ap && bp) return 1;
      return a.name.localeCompare(b.name);
    });
  }, []);

  const filteredCountries = useMemo(() =>
    phoneCountryOptions.filter((c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.includes(countrySearch)
    ), [phoneCountryOptions, countrySearch]);

  const selectedCountry = phoneCountryOptions.find((c) => c.code === formData.country_code);

  // ── Fetch properties ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProperties = async () => {
      setLoadingProperties(true);
      try {
        const response = await apiService.get(
          `/properties/public?page=1&limit=30&search=${searchTerm}`
        );
        setProperties(response.data);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoadingProperties(false);
      }
    };
    const t = setTimeout(fetchProperties, 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // ── Close dropdown on outside click ──────────────────────────────────────
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e) => {
      if (!e.target.closest(".cc-dropdown-wrap")) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  // ── Scroll lock ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = isModalOpen ? "hidden" : "auto";
      return () => { document.body.style.overflow = "auto"; };
    }
  }, [isModalOpen]);

  const handleLoadMore = () =>
    setVisibleCount((prev) => Math.min(properties.length, prev + 3));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCountryCodeSelect = (code) => {
    const limit = PHONE_LENGTH_RULES[code] || 15;
    setFormData((prev) => ({ ...prev, country_code: code, mobile: prev.mobile.slice(0, limit) }));
    setDropdownOpen(false);
    setCountrySearch("");
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    const maxLength = PHONE_LENGTH_RULES[formData.country_code] || 15;
    setFormData((prev) => ({ ...prev, mobile: value.slice(0, maxLength) }));
    if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = "Required";
    if (!formData.last_name.trim()) newErrors.last_name = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    const phoneErr = validatePhone(formData.country_code, formData.mobile);
    if (phoneErr) newErrors.mobile = phoneErr;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) { toast.error("Please fill all fields correctly."); return; }
    setFormLoading(true);
    const payload = {
      enquiry_type: "Sell",
      property_id: selectedProperty?._id || selectedProperty?.id || undefined,
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      phone_number: formData.mobile,
      country_code: `+${formData.country_code}`,
      email: formData.email.toLowerCase().trim(),
    };
    try {
      const res = await apiService.post("/gridlead/website-lead", payload);
      if (res.success) {
        toast.success("Request submitted! Our team will contact you shortly.");
        setIsModalOpen(false);
        setFormData({ first_name: "", last_name: "", email: "", country_code: "971", mobile: "" });
        setErrors({});
        setSelectedProperty(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const displayedProperties = properties.slice(0, visibleCount);

  return (
    <div className="w-full font-dm">
      <Toaster position="top-center" />

      {/* ── HERO ── */}
      <section
        className="relative bg-cover bg-center min-h-[620px] flex items-center justify-center text-white"
        style={{ backgroundImage: `url(${img4})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold">XOTO Properties</h1>
          <p className="mt-4 text-base sm:text-lg leading-relaxed">
            Get in touch with our luxury real estate experts.<br />
            We're here to help you with all your property needs.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-70 h-10 bg-[var(--color-body)] z-[5] clip-left-shape" />
        <div className="absolute bottom-0 right-0 w-70 h-10 bg-[var(--color-body)] z-[5] clip-right-shape" />
        <style>{`
          .clip-left-shape { clip-path: polygon(0 0, 55% 0, 100% 100%, 0% 100%); }
          .clip-right-shape { clip-path: polygon(47% 0, 100% 0, 100% 100%, 0% 100%); }
        `}</style>
      </section>

      {/* ── PROPERTIES SECTION ── */}
      <section className="py-16 bg-[var(--color-body)] flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl text-black font-semibold mb-10">
          Our Properties
        </h2>

        {/* Search */}
        <div className="w-[90%] md:w-[50%] mb-10 flex items-center bg-white border-2 border-gray-200 rounded-full px-5 py-2 shadow-sm focus-within:border-[#5C039B] transition-all">
          <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="#5C039B" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or location..."
            className="w-full outline-none text-gray-700 bg-transparent text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Loading */}
        {loadingProperties ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C039B] mx-auto" />
            <p className="mt-4 text-gray-500 text-sm">Searching properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-400 font-medium">No properties found matching "{searchTerm}"</p>
            <button onClick={() => setSearchTerm("")} className="mt-3 text-[#5C039B] underline text-sm font-semibold">
              View All Properties
            </button>
          </div>
        ) : (
          /* ── CARDS GRID ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-[92%] sm:w-[90%] md:w-[85%]">
            {displayedProperties.map((property) => (
              <PropertyCardP2
                key={property._id}
                property={property}
                onShowDetails={() => { setSelectedProperty(property); setIsModalOpen(true); }}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {visibleCount < properties.length && !loadingProperties && (
          <button
            onClick={handleLoadMore}
            className="mt-12 px-10 py-3 rounded-full bg-[#5C039B] text-white font-semibold text-sm hover:bg-[#4b0281] transition"
          >
            Load More
          </button>
        )}
      </section>

      {/* ── MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-[540px] bg-white shadow-2xl flex flex-col" style={{ borderRadius: "14px" }}>

            {/* Close */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 z-20 bg-red-500 text-white w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
              style={{ borderRadius: "6px" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="p-7 pb-5 text-center shrink-0" style={{ background: "#5C039B", borderRadius: "14px 14px 0 0" }}>
              <h2 className="text-xl font-bold text-white mb-1">We are Here To Help You</h2>
              <p className="text-purple-200 text-sm">
                Fill in your contact details, our expert advisor will get in touch with you.
              </p>
            </div>

            {/* Form */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-3">

                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className={`enq-input-wrap ${errors.first_name ? "enq-error" : ""}`}>
                      <svg className="enq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" className="enq-input" />
                    </div>
                    {errors.first_name && <p className="enq-err-msg">{errors.first_name}</p>}
                  </div>
                  <div>
                    <div className={`enq-input-wrap ${errors.last_name ? "enq-error" : ""}`}>
                      <svg className="enq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" className="enq-input" />
                    </div>
                    {errors.last_name && <p className="enq-err-msg">{errors.last_name}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <div className={`enq-input-wrap ${errors.email ? "enq-error" : ""}`}>
                    <svg className="enq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="enq-input" />
                  </div>
                  {errors.email && <p className="enq-err-msg">{errors.email}</p>}
                </div>

                {/* Phone — flag dropdown + number input */}
                <div>
                  <div className={`flex ${errors.mobile ? "enq-phone-error" : ""}`} style={{ border: "1.5px solid #ddd" }}>
                    {/* Country Code Dropdown */}
                    <div className="cc-dropdown-wrap relative flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen((v) => !v)}
                        className="h-[46px] flex items-center gap-1.5 px-3 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors border-r border-gray-200"
                        style={{ minWidth: "90px" }}
                      >
                        {selectedCountry && (
                          <img src={`https://flagcdn.com/w20/${selectedCountry.iso.toLowerCase()}.png`} alt="" className="w-5 h-3 object-cover flex-shrink-0" />
                        )}
                        <span className="text-[13px] font-semibold">+{formData.country_code}</span>
                        <svg className="w-3 h-3 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Dropdown panel */}
                      {dropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-[260px] bg-white border border-gray-200 shadow-2xl z-[9999] overflow-hidden" style={{ borderRadius: "8px" }}>
                          <div className="p-2 border-b border-gray-100">
                            <input
                              autoFocus type="text" placeholder="Search country..."
                              value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)}
                              className="w-full px-3 py-1.5 text-sm border border-gray-200 outline-none"
                              style={{ borderRadius: "2px" }}
                            />
                          </div>
                          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                            {filteredCountries.map((c) => (
                              <button key={c.iso} type="button" onClick={() => handleCountryCodeSelect(c.code)}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-purple-50 transition-colors text-left"
                              >
                                <img src={`https://flagcdn.com/w20/${c.iso.toLowerCase()}.png`} alt="" className="w-5 h-3 object-cover flex-shrink-0" />
                                <span className="truncate text-gray-700">{c.name}</span>
                                <span className="ml-auto text-gray-400 text-xs flex-shrink-0">+{c.code}</span>
                              </button>
                            ))}
                            {filteredCountries.length === 0 && (
                              <p className="text-center text-gray-400 text-xs py-4">No results</p>
                            )}
                        </div>
                      </div>
                    )}
                  </div>

                    {/* Number input */}
                    <input
                      name="mobile" type="text" inputMode="numeric"
                      value={formData.mobile} onChange={handlePhoneChange}
                      placeholder="Mobile Number"
                      className="flex-1 h-[46px] px-3 text-sm outline-none bg-white text-gray-800"
                      style={{ minWidth: 0 }}
                    />
                  </div>
                  {errors.mobile && <p className="enq-err-msg">{errors.mobile}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full py-3.5 text-white font-bold text-[15px] transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
                  style={{ background: "#5C039B", borderRadius: "8px" }}
                >
                  {formLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Submitting...
                    </>
                  ) : "Submit Enquiry"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .enq-input-wrap {
          display: flex; align-items: center;
          border: 1.5px solid #ddd;
          background: white; height: 46px;
          transition: border-color 0.2s;
        }
        .enq-input-wrap:focus-within { border-color: #5C039B; }
        .enq-error { border-color: #f87171 !important; background: #fff5f5; }
        .enq-phone-error { border-color: #f87171 !important; }
        .enq-icon {
          width: 16px; height: 16px; flex-shrink: 0;
          color: #5C039B; margin-left: 12px; margin-right: 8px;
        }
        .enq-input {
          flex: 1; height: 100%; border: none; outline: none;
          font-size: 13px; color: #1a1a2e; background: transparent;
          padding-right: 12px;
        }
        .enq-input::placeholder { color: #aaa; }
        .enq-err-msg { color: #ef4444; font-size: 10px; margin-top: 3px; }
        .enq-scrollbar::-webkit-scrollbar { width: 4px; }
        .enq-scrollbar::-webkit-scrollbar-track { background: #f3e8ff; }
        .enq-scrollbar::-webkit-scrollbar-thumb { background: #5C039B; }
      `}</style>
    </div>
  );
};

function PropertyCardP2({ property, onShowDetails }) {
  const [isFavourited, setIsFavourited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const saved = JSON.parse(localStorage.getItem("customer_favourites") || "[]");
    if (saved.includes(property._id)) setIsFavourited(true);
  }, [property._id]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = imageModalOpen ? "hidden" : "auto";
      return () => { document.body.style.overflow = "auto"; };
    }
  }, [imageModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && imageModalOpen) setImageModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [imageModalOpen]);

  const handleFavouriteClick = async (e) => {
    e.stopPropagation();
    if (!localStorage.getItem("token")) { window.location.href = "/user/login"; return; }
    if (favLoading) return;
    setFavLoading(true);
    try {
      const res = await apiService.post("/properties/favourites/toggle", { property_id: property._id });
      if (res.success) {
        setIsFavourited(res.isFavourited);
        const saved = JSON.parse(localStorage.getItem("customer_favourites") || "[]");
        const updated = res.isFavourited
          ? [...new Set([...saved, property._id])]
          : saved.filter((id) => id !== property._id);
        localStorage.setItem("customer_favourites", JSON.stringify(updated));
      }
    } catch (err) { console.error("Favourite toggle failed:", err); }
    finally { setFavLoading(false); }
  };

  const tag = property.transactionType || property.propertySubType || "Sell";
  const { bg, color } = tagStyle(tag);
  const imgSrc = property.photos?.[0] || property.photos?.interior?.[0]
    || property.photos?.other?.[0] || property.mainLogo || FALLBACK_IMAGE;

  return (
    <>
      <div
        className="bg-white rounded-[20px] overflow-hidden transition-all duration-300 hover:-translate-y-1"
        style={{ boxShadow: "0 4px 24px rgba(92,3,155,0.10)", border: "1px solid #f0ebff" }}
      >
        <div className="relative overflow-hidden" style={{ height: "220px" }}>
          <img
            src={imgSrc}
            alt={property.propertyName}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 cursor-pointer"
            onError={(e) => (e.target.src = FALLBACK_IMAGE)}
            onClick={() => setImageModalOpen(true)}
          />
          {/* Tag */}
          <span style={{
            position: "absolute", top: "12px", left: "12px",
            background: bg, color, fontSize: "11px", fontWeight: 700,
            padding: "3px 10px", borderRadius: "5px",
            textTransform: "capitalize", letterSpacing: "0.03em",
          }}>
            {tag.replace("_", " ")}
          </span>

          {/* Heart button */}
          <button
            onClick={handleFavouriteClick}
            disabled={favLoading}
            style={{
              position: "absolute", top: "12px", right: "12px",
              background: "white", borderRadius: "8px",
              width: "32px", height: "32px",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              border: "none", cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {favLoading ? (
              <div className="w-4 h-4 border-2 border-[#5C039B] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                width="15" height="15" viewBox="0 0 24 24"
                fill={isFavourited ? "#5C039B" : "none"}
                stroke="#5C039B" strokeWidth="2"
                style={{ transition: "fill 0.2s" }}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            )}
          </button>
        </div>

        {/* Card body */}
        <div className="p-5">
          <h3 className="text-[15px] font-semibold text-[#1a1a2e] mb-1 truncate">
            {property.propertyName || "Luxury Property"}
          </h3>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[#5C039B] font-bold text-[17px]">
              {property.currency || "AED"} {Number(property.price)?.toLocaleString() || "—"}
            </p>
            <span style={{ background: "#f3e8ff", color: "#5C039B", fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "20px" }}>
              {property.area || "Dubai"}
            </span>
          </div>
          <div style={{ height: "1px", background: "#f3f4f6", marginBottom: "14px" }} />
          <div className="flex items-center gap-4 mb-5 text-[12px] text-gray-500">
            {property.bedroomType === "studio" ? (
              <div className="flex items-center gap-1">
                <img src={bedicon} alt="" className="w-[14px] h-[14px]" />
                <span className="font-semibold text-[#5C039B]">Studio</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1">
                  <img src={bedicon} alt="" className="w-[14px] h-[14px]" />
                  <span>{property.bedrooms || 0} <span className="text-gray-400">Bedrooms</span></span>
                </div>
                <div className="flex items-center gap-1">
                  <img src={tubicon} alt="" className="w-[14px] h-[14px]" />
                  <span>{property.bathrooms || 0} <span className="text-gray-400">Bathroom</span></span>
                </div>
              </>
            )}
            <div className="flex items-center gap-1">
              <img src={layouticon} alt="" className="w-[14px] h-[14px]" />
              <span>{property.builtUpArea_max || "—"} <span className="text-gray-400">{property.builtUpAreaUnit}</span></span>
            </div>
          </div>
          <button
            onClick={onShowDetails}
            className="w-full py-[13px] rounded-[30px] font-semibold text-[14px] text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
            style={{ background: "#5C039B" }}
          >
            Show Details
          </button>
        </div>
      </div>

      {imageModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setImageModalOpen(false)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setImageModalOpen(false)}
              style={{
                position: "absolute", top: "-16px", right: "-16px", zIndex: 20,
                background: "linear-gradient(135deg, #ef4444, #ec4899)",
                color: "white", width: "36px", height: "36px",
                borderRadius: "50%", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Full image */}
            <img
              src={imgSrc}
              alt={property.propertyName}
              style={{
                maxWidth: "90vw", maxHeight: "85vh",
                objectFit: "contain", borderRadius: "12px",
                boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
              }}
              onError={(e) => (e.target.src = FALLBACK_IMAGE)}
            />

            {/* Property name caption */}
            <p style={{
              textAlign: "center", color: "rgba(255,255,255,0.75)",
              fontSize: "13px", marginTop: "10px",
            }}>
              {property.propertyName}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Page2;
