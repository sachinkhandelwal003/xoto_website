import React, { useState, useEffect, useMemo } from "react";
import {
  X, User, Mail, Phone, Globe, Briefcase, MapPin,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useRouter } from "next/router";
import { notification, Select } from "antd"; // Antd Select
import { Country, State, City } from "country-state-city"; // Location Package
import { apiService } from "../../manageApi/utils/custom.apiservice";
import {
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
} from "libphonenumber-js";

import { useTranslation } from "react-i18next";
import "swiper/css";
import "swiper/css/navigation";

// Assets
import waveint4 from "../../assets/img/wave/waveint.png";
import bedicon from "../../assets/img/buy/icon-bed.png";
import tubicon from "../../assets/img/buy/icon-tub.png";
import layouticon from "../../assets/img/buy/icon-layout.png";
import favroiteicon from "../../assets/img/buy/Frame 1618873262.png";

const { Option } = Select;

// 1. Strict Phone Length Rules
const PHONE_LENGTH_RULES = {
  "971": 9, "91": 10, "966": 9, "1": 10, "44": 10, "61": 9,
};

const validatePhone = (countryCode, mobile) => {
  if (!mobile) return "Mobile is required";

  const fullNumber = `+${countryCode}${mobile}`;
  const phoneNumber = parsePhoneNumberFromString(fullNumber);

  if (!phoneNumber) {
    return "Invalid mobile number";
  }

  // Length validation (proper way)
  const lengthError = validatePhoneNumberLength(
    phoneNumber.nationalNumber,
    phoneNumber.country
  );

  if (lengthError === "TOO_SHORT") return "Number is too short";
  if (lengthError === "TOO_LONG") return "Number is too long";

  // Structural validation
  if (!phoneNumber.isValid()) {
    return "Invalid mobile number for selected country";
  }

  // Block landlines
  if (phoneNumber.getType() === "FIXED_LINE") {
    return "Landline numbers are not allowed";
  }

  // UAE-specific rule (real one)
  if (countryCode === "971" && !/^(50|52|54|55|56|58)/.test(mobile)) {
    return "Invalid UAE mobile prefix";
  }

  return ""; // ✅ valid
};


const OurProperty = () => {
  const { t } = useTranslation("buy5");
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [api, contextHolder] = notification.useNotification();
  const [selectedProperty, setSelectedProperty] = useState(null);

  // 2. Form State (Added location fields)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    country_code: "971", 
    mobile: "",
    occupation: "",
    // Location Fields
    location_country: null,
    state: null,
    city: null,
    preferred_contact: "whatsapp",
  });

  const [errors, setErrors] = useState({});

  // 3. Location Data States
  const [countriesList] = useState(Country.getAllCountries());
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);

  // 4. Memoized Phone Country Codes
  const phoneCountryOptions = useMemo(() => {
    const priorityIsoCodes = ["AE", "IN", "SA", "US", "GB", "AU"];
    return Country.getAllCountries().map((country) => ({
      name: country.name, code: country.phonecode, iso: country.isoCode,
    })).sort((a, b) => {
      const aPriority = priorityIsoCodes.includes(a.iso);
      const bPriority = priorityIsoCodes.includes(b.iso);
      if (aPriority && !bPriority) return -1;
      if (!aPriority && bPriority) return 1;
      return a.name.localeCompare(b.name);
    });
  }, []);

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  const filteredCountries = useMemo(() => {
    if (!countrySearch) return phoneCountryOptions;
    const q = countrySearch.toLowerCase();
    return phoneCountryOptions.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.includes(q)
    );
  }, [countrySearch, phoneCountryOptions]);

  const selectedCountry = useMemo(
    () => phoneCountryOptions.find((c) => c.code === formData.country_code),
    [formData.country_code, phoneCountryOptions]
  );

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setFetchLoading(true);
const res = await apiService.get("/properties/public?limit=3",);

if (res && Array.isArray(res.data)) {

  const list = res.data;

  const limited = list.slice(0, 3); // ✅ only 3

const transformedProperties = limited.map((item) => ({
  id: item._id,
  image: item.photos?.[0] || item.mainLogo,
  title: item.propertyName,
  price: item.price
    ? `${item.currency || "AED"} ${Number(item.price).toLocaleString()}`
    : "Price on Request",
  location: item.area && item.city ? `${item.area}, ${item.city}` : "Dubai, UAE",

  bedrooms: item.bedrooms || 0,
  bedroomType: item.bedroomType || "", // ✅ add this

  bathrooms: item.bathrooms || 0,
  area: item.builtUpArea
    ? `${item.builtUpArea} ${item.builtUpAreaUnit || "sqft"}`
    : "N/A",

  tag: item.propertyType === "rent" ? "Rent" : "Sell",
  liked: false,
}));

  setProperties(transformedProperties);
}
      } catch (err) {
        console.error("❌ Error fetching marketplace properties:", err);
        openNotification("error", "Failed to Load Properties", "Please try again later.");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchProperties();
  }, []);


useEffect(() => {
  document.body.style.overflow = openModal ? "hidden" : "auto";
  return () => { document.body.style.overflow = "auto"; };
}, [openModal]);

useEffect(() => {
  if (!dropdownOpen) return;
  const handler = (e) => {
    if (!e.target.closest(".cc-dropdown-wrap")) setDropdownOpen(false);
  };
  document.addEventListener("mousedown", handler);
  return () => document.removeEventListener("mousedown", handler);
}, [dropdownOpen]);


  // --- HANDLERS ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCountryCodeChange = (value) => {
    const limit = PHONE_LENGTH_RULES[value] || 15;
    setFormData((prev) => ({ ...prev, country_code: value, mobile: prev.mobile.slice(0, limit) }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    const maxLength = PHONE_LENGTH_RULES[formData.country_code] || 15;
    const validatedValue = value.slice(0, maxLength);
    const phoneObj = parsePhoneNumberFromString(
  `+${formData.country_code}${formData.mobile}`
);

    setFormData((prev) => ({ ...prev, mobile: validatedValue }));
    if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: "" }));
  };

  // Location Handlers
  const handleLocationCountryChange = (isoCode) => {
    const updatedStates = State.getStatesOfCountry(isoCode);
    setStatesList(updatedStates);
    setCitiesList([]);
    setFormData((prev) => ({ ...prev, location_country: isoCode, state: null, city: null }));
    if (errors.location_country) setErrors((prev) => ({ ...prev, location_country: "" }));
  };

  const handleLocationStateChange = (stateCode) => {
    const updatedCities = City.getCitiesOfState(formData.location_country, stateCode);
    setCitiesList(updatedCities);
    setFormData((prev) => ({ ...prev, state: stateCode, city: null }));
    if (errors.state) setErrors((prev) => ({ ...prev, state: "" }));
  };

  const handleLocationCityChange = (cityName) => {
    setFormData((prev) => ({ ...prev, city: cityName }));
    if (errors.city) setErrors((prev) => ({ ...prev, city: "" }));
  };

  const openNotification = (type, title, description) => {
    api[type]({ message: title, description: description, placement: "topRight" });
  };

  // --- VALIDATION & SUBMIT ---

  const validateForm = () => {
  let newErrors = {};
  let isValid = true;

  if (!formData.first_name.trim()) { newErrors.first_name = "Required"; isValid = false; }
  if (!formData.last_name.trim()) { newErrors.last_name = "Required"; isValid = false; }
  if (!formData.email.trim()) { newErrors.email = "Required"; isValid = false; }
  else if (!/\S+@\S+\.\S+/.test(formData.email)) { newErrors.email = "Invalid email"; isValid = false; }

  const phoneError = validatePhone(formData.country_code, formData.mobile);
  if (phoneError) { newErrors.mobile = phoneError; isValid = false; }

  setErrors(newErrors);
  return isValid;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  setLoading(true);

  const payload = {
    enquiry_type: "sell",
    property_id: selectedProperty?.id,
    first_name: formData.first_name.trim(),
    last_name: formData.last_name.trim(),
    phone_number: formData.mobile,
    country_code: `+${formData.country_code}`,
    email: formData.email.toLowerCase().trim(),
  };

  try {
    const res = await apiService.post("/gridlead/website-lead", payload);
    if (res.success) {
      openNotification("success", "Request Submitted", t("toast.success"));
      setOpenModal(false);
      setFormData({
        first_name: "", last_name: "", email: "",
        country_code: "971", mobile: "",
        occupation: "", location_country: null, state: null, city: null,
        preferred_contact: "whatsapp",
      });
      setErrors({});
      setSelectedProperty(null);
    }
  } catch (err) {
    openNotification("error", "Submission Failed", err.response?.data?.message || t("toast.error"));
  } finally {
    setLoading(false);
  }
};

// ── OurProperty se PEHLE paste karo ──────────────────────────────────────────

const FALLBACK_IMAGE = "https://via.placeholder.com/400x300?text=No+Image";

function PropertyCard({ property, onShowDetails }) {
  const [isFavourited, setIsFavourited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // localStorage se check karo on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const saved = JSON.parse(localStorage.getItem("customer_favourites") || "[]");
    if (saved.includes(property.id)) setIsFavourited(true);
  }, [property.id]);

  const handleFavouriteClick = async (e) => {
    e.stopPropagation();
    if (!localStorage.getItem("token")) { window.location.href = "/user/login"; return; }
    if (favLoading) return;
    setFavLoading(true);
    try {
      const res = await apiService.post("/properties/favourites/toggle", { property_id: property.id });
      if (res.success) {
        setIsFavourited(res.isFavourited);
        const saved = JSON.parse(localStorage.getItem("customer_favourites") || "[]");
        const updated = res.isFavourited
          ? [...new Set([...saved, property.id])]
          : saved.filter((id) => id !== property.id);
        localStorage.setItem("customer_favourites", JSON.stringify(updated));
      }
    } catch (err) { console.error("Favourite toggle failed:", err); }
    finally { setFavLoading(false); }
  };

  return (
    <div className="w-full max-w-[393px] mx-auto h-[519px] bg-white rounded-[24px] shadow-[0px_20px_40px_rgba(0,0,0,0.12)] overflow-hidden relative transition-transform duration-300 hover:scale-[1.02]">
      <div className="h-[240px] relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
          onError={(e) => (e.target.src = FALLBACK_IMAGE)}
        />
        <span className={`absolute top-4 left-4 text-xs font-medium px-3 py-1 rounded-md ${property.tag === "Sell" ? "bg-[#E8F0FF] text-[#2563EB]" : "bg-[#E9FFF3] text-[#16A34A]"}`}>
          {property.tag}
        </span>

        {/* ── Heart button — fav API wala ── */}
        <button
          onClick={handleFavouriteClick}
          disabled={favLoading}
          className="absolute top-4 right-4 w-9 h-9 rounded-md bg-white flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200 active:scale-95"
          style={{ border: "none", cursor: "pointer" }}
        >
          {favLoading ? (
            <div className="w-4 h-4 border-2 border-[#5C039B] border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg
              width="16" height="16" viewBox="0 0 24 24"
              fill={isFavourited ? "#5C039B" : "none"}
              stroke="#5C039B" strokeWidth="2"
              style={{ transition: "fill 0.2s" }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          )}
        </button>
      </div>

      <div className="p-6">
        <h3 className="font-medium text-[16px] leading-[24px] text-[rgba(0,0,0,0.6)] font-dm">
          {property.title}
        </h3>
        <div className="flex items-start justify-between">
          <p className="text-[20px] leading-[28px] font-bold text-[#0F172A] font-dm">{property.price}</p>
          <span className="px-3 py-[2px] text-[12px] leading-[18px] rounded-full bg-[#E8F0FF] text-[#2563EB] mt-[2px] font-dm truncate max-w-[120px]">
            {property.location}
          </span>
        </div>
        <div className="mt-6 flex justify-between">
          <div className="w-1/3 text-center">
            <div className="flex items-center justify-center gap-2">
              <img src={bedicon} alt="bed" className="w-5 h-5" />
              <span className="text-[16px] font-medium text-[#0F172A] font-dm">{property.bedrooms}</span>
            </div>
            <span className="mt-1 block text-[14px] md:text-[16px] leading-[18px] text-[rgba(0,0,0,0.6)] font-dm">{property.bedroomType}</span>
          </div>
          {/* <div className="w-1/3 text-center">
            <div className="flex items-center justify-center gap-2">
              <img src={tubicon} alt="bath" className="w-5 h-5" />
              <span className="text-[16px] font-medium text-[#0F172A] font-dm">{property.bathrooms}</span>
            </div>
            <span className="mt-1 block text-[14px] md:text-[16px] leading-[18px] text-[rgba(0,0,0,0.6)] font-dm">Bathroom</span>
          </div> */}
          <div className="w-1/3 text-center">
            <div className="flex items-center justify-center gap-2">
              <img src={layouticon} alt="area" className="w-5 h-5" />
              <span className="text-[16px] font-medium text-[#0F172A] font-dm">{property.area}</span>
            </div>
            <span className="mt-1 block text-[14px] md:text-[16px] leading-[18px] text-[rgba(0,0,0,0.6)] font-dm">Living Area</span>
          </div>
        </div>
        <button
          onClick={onShowDetails}
          className="w-full mt-8 h-[48px] rounded-lg bg-[#5C039B] text-white text-[16px] font-medium transition-transform hover:scale-[1.02] active:scale-95"
        >
          Send Enquiry
        </button>
      </div>
    </div>
  );
}

  return (
    <>
      {contextHolder}
      <section className="relative pt-10 pb-20 md:pb-40 bg-[var(--color-body)] overflow-hidden z-20 font-dm">
        <img 
          src={waveint4} 
          alt="" 
          className="absolute -bottom-[150px] md:-bottom-[350px] left-0 w-full object-cover pointer-events-none" 
        />
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-center card-heading-1 mb-10 md:mb-16 text-3xl md:text-5xl">
            {t("heading.title")}
          </h2>

          {fetchLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#5C039B]"></div>
            </div>
          ) : properties.length === 0 ? (
            <p className="text-center text-gray-500 py-10 text-xl">
              No properties available at the moment.
            </p>
          ) : (
            <>
              {/* Mobile Swiper */}
              <div className="block md:hidden">
                <Swiper
                  modules={[Navigation, Autoplay]}
                  slidesPerView={1}
                  spaceBetween={20}
                  autoplay={{ delay: 3500 }}
                  loop
                >
                  {properties.map((p) => (
  <SwiperSlide key={p.id}>
    <PropertyCard
      property={p}
      onShowDetails={() => { setSelectedProperty(p); setOpenModal(true); }}
    />
  </SwiperSlide>
))}
                </Swiper>
              </div>

              {/* Desktop Grid */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 justify-items-center">
               {properties.map((p) => (
  <PropertyCard
    key={p.id}
    property={p}
    onShowDetails={() => { setSelectedProperty(p); setOpenModal(true); }}
  />
))}
              </div>
            </>
          )}

          <div className="flex justify-center mt-12 md:mt-16 relative z-20">
            <button
              onClick={() => router.push("/properties/explore")}
              className="bg-[#5C039B] text-white px-8 md:px-10 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all hover:bg-[#4b0281]"
            >
              {t("actions.viewMore")}
            </button>
          </div>
        </div>
      </section>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-[540px] bg-white shadow-2xl flex flex-col" style={{ borderRadius: "14px" }}>

            {/* Close */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-3 right-3 z-20 bg-red-500 text-white w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
              style={{ borderRadius: "6px" }}
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="p-7 pb-5 text-center shrink-0" style={{ background: "#5C039B", borderRadius: "14px 14px 0 0" }}>
              <h3 className="text-xl font-bold text-white mb-1">{t("modal.title")}</h3>
              <p className="text-purple-200 text-sm">{t("modal.subtitle")}</p>
            </div>

            {/* Form */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-3">

                {/* Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className={`b5-input-wrap ${errors.first_name ? "b5-error" : ""}`}>
                      <svg className="b5-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder={t("form.firstName")} className="b5-input" />
                    </div>
                    {errors.first_name && <p className="b5-err-msg">{errors.first_name}</p>}
                  </div>
                  <div>
                    <div className={`b5-input-wrap ${errors.last_name ? "b5-error" : ""}`}>
                      <svg className="b5-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder={t("form.lastName")} className="b5-input" />
                    </div>
                    {errors.last_name && <p className="b5-err-msg">{errors.last_name}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <div className={`b5-input-wrap ${errors.email ? "b5-error" : ""}`}>
                    <svg className="b5-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder={t("form.email")} className="b5-input" />
                  </div>
                  {errors.email && <p className="b5-err-msg">{errors.email}</p>}
                </div>

                {/* Phone — flag dropdown + number input */}
                <div>
                  <div className={`flex ${errors.mobile ? "b5-phone-error" : ""}`} style={{ border: "1.5px solid #ddd" }}>
                    <div className="cc-dropdown-wrap relative flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen((v) => !v)}
                        className="h-[46px] flex items-center gap-1.5 px-3 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors border-r border-gray-200"
                        style={{ minWidth: "90px" }}
                      >
                        {selectedCountry && <img src={`https://flagcdn.com/w20/${selectedCountry.iso.toLowerCase()}.png`} alt="" className="w-5 h-3 object-cover flex-shrink-0" />}
                        <span className="text-[13px] font-semibold">+{formData.country_code}</span>
                        <svg className="w-3 h-3 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      {dropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-[260px] bg-white border border-gray-200 shadow-2xl z-[9999] overflow-hidden" style={{ borderRadius: "8px" }}>
                          <div className="p-2 border-b border-gray-100">
                            <input autoFocus type="text" placeholder="Search country..." value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-200 outline-none" style={{ borderRadius: "4px" }} />
                          </div>
                          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                            {filteredCountries.map((c) => (
                              <button key={c.iso} type="button"
                                onClick={() => { setFormData((prev) => ({ ...prev, country_code: c.code, mobile: prev.mobile.slice(0, PHONE_LENGTH_RULES[c.code] || 15) })); setDropdownOpen(false); setCountrySearch(""); }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-purple-50 transition-colors text-left"
                              >
                                <img src={`https://flagcdn.com/w20/${c.iso.toLowerCase()}.png`} alt="" className="w-5 h-3 object-cover flex-shrink-0" />
                                <span className="truncate text-gray-700">{c.name}</span>
                                <span className="ml-auto text-gray-400 text-xs flex-shrink-0">+{c.code}</span>
                              </button>
                            ))}
                            {filteredCountries.length === 0 && <p className="text-center text-gray-400 text-xs py-4">No results</p>}
                          </div>
                        </div>
                      )}
                    </div>
                    <input name="mobile" type="text" inputMode="numeric" value={formData.mobile} onChange={handlePhoneChange} placeholder="Mobile Number" className="flex-1 h-[46px] px-3 text-sm outline-none bg-white text-gray-800" style={{ minWidth: 0 }} />
                  </div>
                  {errors.mobile && <p className="b5-err-msg">{errors.mobile}</p>}
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 text-white font-bold text-[15px] transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
                  style={{ background: "#5C039B", borderRadius: "8px" }}
                >
                  {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : t("actions.submit")}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .b5-input-wrap { display:flex; align-items:center; border:1.5px solid #ddd; background:white; height:46px; transition:border-color 0.2s; }
        .b5-input-wrap:focus-within { border-color: #5C039B; }
        .b5-error { border-color: #f87171 !important; background: #fff5f5; }
        .b5-phone-error { border-color: #f87171 !important; }
        .b5-icon { width:16px; height:16px; flex-shrink:0; color:#5C039B; margin-left:12px; margin-right:8px; }
        .b5-input { flex:1; height:100%; border:none; outline:none; font-size:13px; color:#1a1a2e; background:transparent; padding-right:12px; }
        .b5-input::placeholder { color: #aaa; }
        .b5-err-msg { color:#ef4444; font-size:10px; margin-top:3px; }
        .font-dm { font-family: 'DM Sans', sans-serif; }
      `}</style>
    </>
  );
};

export default OurProperty;