import { useState, useMemo, useRef, useEffect } from "react";
import { FiX } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { Country, State, City } from "country-state-city"; 
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { apiService } from "../../manageApi/utils/custom.apiservice";

// ─── Enhanced Country Select ───────────────────────────────────────
const CountrySelect = ({ countries, value, onChange, type = 'dial', placeholder = 'Select', disabled = false }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);
  const inputRef = useRef(null);
  
  const selected = countries.find(c => c.iso === value) || null;

  const filtered = search
    ? countries.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.code && c.code.includes(search.replace(/\D/g, '')))
      )
    : countries;

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSearch(''); } };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 30); }, [open]);

  const triggerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '0 12px',
    height: '46px',
    width: '100%',
    background: disabled ? '#F3F4F6' : '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
    opacity: disabled ? 0.6 : 1,
  };

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        onClick={() => !disabled && setOpen(o => !o)}
        style={triggerStyle}
        onMouseEnter={e => { if (!disabled) { e.currentTarget.style.borderColor = '#A855F7'; e.currentTarget.style.background = '#FAF5FF'; } }}
        onMouseLeave={e => { if (!disabled) { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#F9FAFB'; } }}
      >
        {selected ? (
          <>
            <img 
              src={`https://flagcdn.com/w20/${selected.iso.toLowerCase()}.png`} 
              alt="" 
              style={{ width: 20, height: 15, borderRadius: 2, objectFit: 'cover' }}
              onError={(e) => { e.target.src = 'https://flagcdn.com/w20/un.png'; }}
            />
            {type === 'dial' ? (
              <span style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>+{selected.code}</span>
            ) : (
              <span style={{ fontWeight: 500, fontSize: 13, color: '#374151', flex: 1, textAlign: 'left' }}>
                {selected.name}
              </span>
            )}
            <span style={{ color: '#9CA3AF', fontSize: 10, marginLeft: 'auto' }}>▼</span>
          </>
        ) : (
          <span style={{ color: '#9CA3AF', fontSize: 13, flex: 1, textAlign: 'left' }}>{placeholder}</span>
        )}
      </button>

      {open && !disabled && (
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
          <div style={{ padding: 10, borderBottom: '1px solid #F3F4F6' }}>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
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
              onFocus={e => e.target.style.borderColor = '#A855F7'}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>
          <div style={{ maxHeight: 240, overflowY: 'auto' }}>
            {filtered.slice(0, 100).map(c => (
              <button
                key={c.iso}
                type="button"
                onClick={() => { onChange(c.iso); setOpen(false); setSearch(''); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '10px 14px',
                  background: c.iso === value ? '#F3E8FF' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (c.iso !== value) e.currentTarget.style.background = '#FAF5FF'; }}
                onMouseLeave={e => { if (c.iso !== value) e.currentTarget.style.background = 'transparent'; }}
              >
                <img 
                  src={`https://flagcdn.com/w20/${c.iso.toLowerCase()}.png`} 
                  alt="" 
                  style={{ width: 20, height: 15, borderRadius: 2, objectFit: 'cover' }}
                  onError={(e) => { e.target.src = 'https://flagcdn.com/w20/un.png'; }}
                />
                <span style={{ fontSize: 13, fontWeight: 500, color: '#1F2937', flex: 1 }}>{c.name}</span>
                {type === 'dial' && c.code && (
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#8B5CF6' }}>+{c.code}</span>
                )}
              </button>
            ))}
            {filtered.length === 0 && (
              <p style={{ padding: '16px', fontSize: 12, color: '#9CA3AF', textAlign: 'center', margin: 0 }}>No results found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── State Select Component ────────────────────────────────────────────────
const StateSelect = ({ states, value, onChange, disabled = false, required = false }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);
  const inputRef = useRef(null);
  
  const selected = states.find(s => s.isoCode === value) || null;

  const filtered = search
    ? states.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    : states;

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSearch(''); } };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 30); }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        onClick={() => !disabled && setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: '0 12px',
          height: '46px',
          width: '100%',
          background: disabled ? '#F3F4F6' : '#F9FAFB',
          border: `1px solid ${required && !value && !disabled ? '#EF4444' : '#E5E7EB'}`,
          borderRadius: '12px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          transition: 'all 0.2s',
          opacity: disabled ? 0.6 : 1,
        }}
        onMouseEnter={e => { if (!disabled) { e.currentTarget.style.borderColor = '#A855F7'; e.currentTarget.style.background = '#FAF5FF'; } }}
        onMouseLeave={e => { if (!disabled) { e.currentTarget.style.borderColor = required && !value ? '#EF4444' : '#E5E7EB'; e.currentTarget.style.background = '#F9FAFB'; } }}
      >
        <span style={{ fontWeight: 500, fontSize: 13, color: selected ? '#374151' : '#9CA3AF', textAlign: 'left' }}>
          {selected ? selected.name : 'Select State / Region'}
          {required && <span style={{ color: '#EF4444', marginLeft: 4 }}>*</span>}
        </span>
        <span style={{ color: '#9CA3AF', fontSize: 10 }}>▼</span>
      </button>

      {open && !disabled && states.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 5px)',
          left: 0,
          width: '100%',
          background: '#fff',
          border: '1px solid #E5E7EB',
          borderRadius: 12,
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
          zIndex: 1000,
          overflow: 'hidden',
        }}>
          <div style={{ padding: 10, borderBottom: '1px solid #F3F4F6' }}>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search state..."
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
            {filtered.map(state => (
              <button
                key={state.isoCode}
                type="button"
                onClick={() => { onChange(state.isoCode); setOpen(false); setSearch(''); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '10px 14px',
                  background: state.isoCode === value ? '#F3E8FF' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#FAF5FF'}
                onMouseLeave={e => { if (state.isoCode !== value) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>{state.name}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p style={{ padding: '16px', fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>No states found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── City Select Component ────────────────────────────────────────────────
const CitySelect = ({ cities, value, onChange, disabled = false, required = false }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);
  const inputRef = useRef(null);
  
  const selected = cities.find(c => c.name === value) || null;

  const filtered = search
    ? cities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : cities;

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSearch(''); } };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 30); }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        onClick={() => !disabled && setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: '0 12px',
          height: '46px',
          width: '100%',
          background: disabled ? '#F3F4F6' : '#F9FAFB',
          border: `1px solid ${required && !value && !disabled ? '#EF4444' : '#E5E7EB'}`,
          borderRadius: '12px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          transition: 'all 0.2s',
          opacity: disabled ? 0.6 : 1,
        }}
        onMouseEnter={e => { if (!disabled) { e.currentTarget.style.borderColor = '#A855F7'; e.currentTarget.style.background = '#FAF5FF'; } }}
        onMouseLeave={e => { if (!disabled) { e.currentTarget.style.borderColor = required && !value ? '#EF4444' : '#E5E7EB'; e.currentTarget.style.background = '#F9FAFB'; } }}
      >
        <span style={{ fontWeight: 500, fontSize: 13, color: selected ? '#374151' : '#9CA3AF', textAlign: 'left' }}>
          {selected ? selected.name : 'Select City'}
          {required && <span style={{ color: '#EF4444', marginLeft: 4 }}>*</span>}
        </span>
        <span style={{ color: '#9CA3AF', fontSize: 10 }}>▼</span>
      </button>

      {open && !disabled && cities.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 5px)',
          left: 0,
          width: '100%',
          background: '#fff',
          border: '1px solid #E5E7EB',
          borderRadius: 12,
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
          zIndex: 1000,
          overflow: 'hidden',
        }}>
          <div style={{ padding: 10, borderBottom: '1px solid #F3F4F6' }}>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search city..."
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
            {filtered.map(city => (
              <button
                key={city.name}
                type="button"
                onClick={() => { onChange(city.name); setOpen(false); setSearch(''); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '10px 14px',
                  background: city.name === value ? '#F3E8FF' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#FAF5FF'}
                onMouseLeave={e => { if (city.name !== value) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>{city.name}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p style={{ padding: '16px', fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>No cities found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function GetPreApprovedModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    foundProperty: "No",
    contact: "WhatsApp",
    marketing: false,
    terms: false,
    phone_country_iso: "AE",
    location_country: null,
    state: null,
    city: null
  });

  const [countriesList] = useState(Country.getAllCountries());
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);

  const phoneCountryOptions = useMemo(() => {
    const priorityIsoCodes = ["AE", "IN", "SA", "US", "GB", "AU"];
    return Country.getAllCountries()
      .filter(c => c.phonecode)
      .map((country) => ({
        name: country.name,
        code: country.phonecode.replace(/[^0-9]/g, ''),
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

  const locationCountryOptions = useMemo(() => {
    return countriesList.map((country) => ({
      name: country.name,
      code: country.phonecode || '',
      iso: country.isoCode,
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [countriesList]);

  const selectedPhoneCountry = useMemo(() => {
    return phoneCountryOptions.find(c => c.iso === form.phone_country_iso) || phoneCountryOptions.find(c => c.iso === 'AE');
  }, [form.phone_country_iso, phoneCountryOptions]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handlePhoneCountryChange = (isoCode) => {
    setForm((prev) => ({ ...prev, phone_country_iso: isoCode, phone: "" }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setForm((prev) => ({ ...prev, phone: value }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
  };

  const handleLocationCountryChange = (isoCode) => {
    const updatedStates = State.getStatesOfCountry(isoCode);
    setStatesList(updatedStates);
    setCitiesList([]);
    setForm((prev) => ({ ...prev, location_country: isoCode, state: null, city: null }));
    if (errors.location_country) setErrors((prev) => ({ ...prev, location_country: "" }));
  };

  const handleLocationStateChange = (stateCode) => {
    const updatedCities = City.getCitiesOfState(form.location_country, stateCode);
    setCitiesList(updatedCities);
    setForm((prev) => ({ ...prev, state: stateCode, city: null }));
    if (errors.state) setErrors((prev) => ({ ...prev, state: "" }));
  };

  const handleLocationCityChange = (cityName) => {
    setForm((prev) => ({ ...prev, city: cityName }));
    if (errors.city) setErrors((prev) => ({ ...prev, city: "" }));
  };

  const validatePhone = (phone, dialCode) => {
    if (!phone) return 'Phone number is required';
    if (phone.length < 5) return 'Phone number too short';
    return '';
  };

  // ✅ CORRECT VALIDATION - Location required ONLY if property found
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Basic validations
    if (!form.name.trim()) { 
      newErrors.name = "Full Name is required"; 
      isValid = false; 
    }
    
    if (!form.email.trim()) { 
      newErrors.email = "Email is required"; 
      isValid = false; 
    } else if (!/\S+@\S+\.\S+/.test(form.email)) { 
      newErrors.email = "Invalid email format"; 
      isValid = false; 
    }

    const phoneErr = validatePhone(form.phone, selectedPhoneCountry.code);
    if (phoneErr) {
      newErrors.phone = phoneErr;
      isValid = false;
    }

    // ✅ CRITICAL: Location validation based on foundProperty
    if (form.foundProperty === "Yes") {
      // If they found a property, location is REQUIRED
      if (!form.location_country) { 
        newErrors.location_country = "Country is required when you've found a property"; 
        isValid = false; 
      }
      if (!form.state) { 
        newErrors.state = "State/Region is required when you've found a property"; 
        isValid = false; 
      }
      if (citiesList.length > 0 && !form.city) { 
        newErrors.city = "City is required when you've found a property"; 
        isValid = false; 
      }
    }
    // If foundProperty === "No", location is OPTIONAL - no validation needed

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const submittedEmails = JSON.parse(localStorage.getItem("submitted_leads") || "[]");
    if (submittedEmails.includes(form.email.toLowerCase().trim())) {
      toast.error("You have already submitted a request recently.");
      return;
    }

    setLoading(true);

    const nameParts = form.name.trim().split(/\s+/);
    const first_name = nameParts[0];
    const last_name = nameParts.length > 1 ? nameParts.slice(1).join(" ") : first_name;

    const selectedCountryData = Country.getCountryByCode(form.location_country);
    const countryName = selectedCountryData ? selectedCountryData.name : "";
    
    const selectedStateData = State.getStateByCodeAndCountry(form.state, form.location_country);
    const stateName = selectedStateData ? selectedStateData.name : form.state;

    // ✅ Build location string based on foundProperty
    const locationString = form.foundProperty === "Yes" && form.location_country
      ? `${form.city || ""}${form.city && stateName ? ", " : ""}${stateName || ""}${(form.city || stateName) && countryName ? ", " : ""}${countryName || ""}`.replace(/^, /, '').replace(/,,/g, ',').trim()
      : "Not specified (browsing)";

    const payload = {
      customerInfo: {
        firstName: first_name,
        lastName: last_name,
        email: form.email.toLowerCase().trim(),
        countryCode: `+${selectedPhoneCountry.code}`,
        mobileNumber: form.phone,
        gender: "Not specified",
        nationality: countryName || "Not specified",
        maritalStatus: "Not specified",
        occupation: form.foundProperty === "Yes" ? "Home Seeker" : "Browsing",
      },
      propertyDetails: {
        propertyFound: form.foundProperty === "Yes",
        propertyType: form.foundProperty === "Yes" ? "Ready" : "Off-plan",
        propertySubtype: "Apartment",
        propertyValue: null,
        downPaymentAmount: null,
        loanAmountRequired: null,
        propertyAddress: {
          building: null,
          area: form.foundProperty === "Yes" ? stateName : null,
          city: form.foundProperty === "Yes" ? (form.city || stateName) : null,
        },
        isOffPlan: form.foundProperty === "No",
        completionDate: null,
      },
      loanRequirements: {
        timeline: form.foundProperty === "Yes" ? "Immediately" : "3-6 months",
        preferredTenureYears: 25,
        preferredInterestRateType: "Fixed",
        preferredBanks: [],
        feeFinancingPreference: true,
        lifeInsurancePreference: true,
        propertyInsurancePreference: true,
        specialRequirements: null,
      },
      notesToXoto: `Pre-Approval Lead from Website.
Contact Preference: ${form.contact}
Found Property: ${form.foundProperty}
Property Location: ${locationString}
Marketing Consent: ${form.marketing ? "Yes" : "No"}
Terms Accepted: Yes`,
      terms_accepted: form.terms,
      marketing_consent: form.marketing,
      preferred_contact: form.contact.toLowerCase(),
    };

    try {
      const response = await apiService.post('/vault/lead/website', payload);

      const msg = response?.message || "Thank you! Our advisor will contact you within 24 hours.";
      toast.success(msg);
      if (response.success || response.status === 200 || response.status === 201) {
        const updatedEmails = [...submittedEmails, form.email.toLowerCase().trim()];
        localStorage.setItem("submitted_leads", JSON.stringify(updatedEmails));
        setForm({
          name: "", phone: "", email: "", foundProperty: "No", contact: "WhatsApp",
          marketing: false, terms: false, phone_country_iso: "AE",
          location_country: null, state: null, city: null
        });
        setTimeout(() => onClose(), 1500);
      }
    } catch (error) {
      console.error("API Error:", error);
      const msg = error.response?.data?.message || "Submission failed. Check internet connection.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const isLocationRequired = form.foundProperty === "Yes";

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm overflow-y-auto">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="flex min-h-screen items-start justify-center pt-24 pb-8 px-4">
        <div className="relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden text-black max-h-[85vh]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f4f1ff] via-white to-[#e9fbff]" />
          
          <div className="relative bg-white rounded-3xl px-5 py-6 sm:px-6 sm:py-8 md:px-8 md:py-8 overflow-y-auto max-h-[85vh]">
            <button onClick={onClose} className="absolute right-4 top-4 sm:right-6 sm:top-6 p-2 rounded-full hover:bg-gray-100 transition">
              <FiX className="text-xl" />
            </button>

            <h2 className="text-xl sm:text-2xl font-bold text-left mb-6 sm:mb-8">Let's get started</h2>

            <div className="space-y-5 sm:space-y-6 text-sm">
              
              {/* Name & Phone Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-left mb-1 font-medium">Full Name <span className="text-red-500">*</span></label>
                  <input
                    value={form.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="E.g.: John Doe"
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-purple-500 transition-all ${errors.name ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-left mb-1 font-medium">Phone number <span className="text-red-500">*</span></label>
                  <div className="flex gap-2 items-start">
                    <div className="w-[110px]">
                      <CountrySelect
                        countries={phoneCountryOptions}
                        value={form.phone_country_iso}
                        onChange={handlePhoneCountryChange}
                        type="dial"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        value={form.phone}
                        onChange={handlePhoneChange}
                        onBlur={() => {
                          const err = validatePhone(form.phone, selectedPhoneCountry.code);
                          if (err) setErrors(prev => ({ ...prev, phone: err }));
                        }}
                        placeholder="Mobile Number"
                        className={`w-full px-4 py-3 h-[46px] rounded-xl border outline-none focus:ring-2 focus:ring-purple-500 transition-all ${errors.phone ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"}`}
                        inputMode="numeric"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-left mb-1 font-medium">Email <span className="text-red-500">*</span></label>
                <input
                  value={form.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="E.g.: john@gmail.com"
                  className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-purple-500 transition-all ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Found Property - MOVED BEFORE LOCATION */}
              <div>
                <label className="block text-left mb-2 font-medium">Have you found a property?</label>
                <div className="flex gap-6">
                  {["Yes", "No"].map((v) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        checked={form.foundProperty === v} 
                        onChange={() => {
                          setForm({ ...form, foundProperty: v });
                          // Clear location errors when switching to "No"
                          if (v === "No") {
                            setErrors(prev => ({ ...prev, location_country: "", state: "", city: "" }));
                          }
                        }} 
                        className="w-4 h-4 accent-purple-600"
                      /> 
                      <span className="text-sm">{v}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* PROPERTY LOCATION - Conditional Required */}
              <div>
                <label className="block text-left mb-2 font-medium">
                  Property Location 
                  {isLocationRequired && <span className="text-red-500 ml-1">*</span>}
                  {!isLocationRequired && (
                    <span className="text-gray-400 text-xs ml-2 font-normal">(Optional - only if you've found a property)</span>
                  )}
                </label>
                <div className="space-y-4">
                  <div>
                    <CountrySelect
                      countries={locationCountryOptions}
                      value={form.location_country}
                      onChange={handleLocationCountryChange}
                      type="country"
                      placeholder="Select Country"
                    />
                    {errors.location_country && <p className="text-red-500 text-xs mt-1">{errors.location_country}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <StateSelect
                        states={statesList}
                        value={form.state}
                        onChange={handleLocationStateChange}
                        disabled={!statesList.length}
                        required={isLocationRequired && !!form.location_country}
                      />
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>

                    <div>
                      <CitySelect
                        cities={citiesList}
                        value={form.city}
                        onChange={handleLocationCityChange}
                        disabled={!citiesList.length}
                        required={isLocationRequired && !!form.state}
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Preference */}
              <div>
                <label className="block text-left mb-2 font-medium">How do you prefer to be contacted?</label>
                <div className="flex gap-6 flex-wrap">
                  {["Call", "WhatsApp", "Email"].map((v) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="contact_pref"
                        checked={form.contact === v} 
                        onChange={() => setForm({...form, contact: v})}
                        className="w-4 h-4 accent-purple-600"
                      /> 
                      <span className="text-sm">{v}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Marketing Consent */}
              {/* <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={form.marketing} 
                  onChange={(e) => setForm({ ...form, marketing: e.target.checked })} 
                  className="w-4 h-4 mt-0.5 accent-purple-600"
                />
                <span className="text-sm text-gray-600">I wish to receive marketing communications</span>
              </label> */}

              {/* Terms Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  required 
                  checked={form.terms} 
                  onChange={(e) => setForm({ ...form, terms: e.target.checked })} 
                  className="w-4 h-4 mt-0.5 accent-purple-600"
                />
                <span className="text-sm text-gray-600">
                  I accept the <span className="underline text-purple-600 cursor-pointer">Terms</span> & <span className="underline text-purple-600 cursor-pointer">Privacy Policy</span> <span className="text-red-500">*</span>
                </span>
              </label>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading || !form.terms}
                className="w-full mt-4 bg-[#5C039B] hover:bg-purple-800 disabled:bg-gray-400 text-white py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}