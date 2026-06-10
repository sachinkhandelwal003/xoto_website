"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { notification } from "antd";
import { Toaster, toast } from "react-hot-toast";
import { Country, State, City } from "country-state-city"; 
import { apiService } from "../../manageApi/utils/custom.apiservice";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import wave1 from "../../assets/img/wave/waveint2.png";
import wave2 from "../../assets/img/wave/wave2.png";
import GetPreApprovedModal from "../homepage/GetPreApprovedModal";

const dmSans = { fontFamily: "'DM Sans', sans-serif" };

// Phone Length Rules
const PHONE_LENGTH_RULES = {
  "971": 9, "91": 10, "966": 9, "1": 10, "44": 10, "61": 9,
};

// Transaction Type Mapping
const getTransactionType = (lookingFor) => {
  const mapping = {
    "residential": "Primary - Residential",
    "commercial": "Primary - Commercial",
    "equity": "Equity",
    "refinance": "Buyout",
    "buyoutEquity": "Buyout + Equity"
  };
  return mapping[lookingFor] || "Primary - Residential";
};

const getTimeline = (lookingFor) => {
  const mapping = {
    "residential": "Immediately",
    "commercial": "1-3 months",
    "equity": "1-3 months",
    "refinance": "1-3 months",
    "buyoutEquity": "1-3 months"
  };
  return mapping[lookingFor] || "3-6 months";
};

const getOccupation = (lookingFor) => {
  const mapping = {
    "residential": "Home Seeker",
    "commercial": "Commercial Investor",
    "equity": "Equity Investor",
    "refinance": "Homeowner",
    "buyoutEquity": "Property Investor"
  };
  return mapping[lookingFor] || "Investor";
};

// ─── Phone Country Select Component ───────────────────────────────────────
const PhoneCountrySelect = ({ countries, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);
  const inputRef = useRef(null);
  
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
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '0 10px',
          height: '48px',
          width: '100%',
          background: '#F9FAFB',
          border: '1px solid #D1D5DB',
          borderRadius: '12px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '14px',
          transition: 'all 0.2s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.background = '#FAF5FF'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.background = '#F9FAFB'; }}
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
                onClick={() => { onChange(c.iso); setOpen(false); setSearch(''); }}
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

// ─── Searchable Country Select Component ───────────────────────────────────────
const SearchableCountrySelect = ({ countries, value, onChange, placeholder = "Select", disabled = false }) => {
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
          height: '48px',
          width: '100%',
          background: disabled ? '#F3F4F6' : '#F9FAFB',
          border: '1px solid #D1D5DB',
          borderRadius: '12px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          fontSize: '14px',
          transition: 'all 0.2s',
          opacity: disabled ? 0.6 : 1,
        }}
        onMouseEnter={e => { if (!disabled) { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.background = '#FAF5FF'; } }}
        onMouseLeave={e => { if (!disabled) { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.background = '#F9FAFB'; } }}
      >
        {selected ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img 
              src={`https://flagcdn.com/w20/${selected.iso.toLowerCase()}.png`} 
              alt="" 
              style={{ width: 20, height: 15, borderRadius: 2, objectFit: 'cover' }}
              onError={(e) => { e.target.src = 'https://flagcdn.com/w20/un.png'; }}
            />
            <span style={{ fontWeight: 500, color: '#374151' }}>{selected.name}</span>
          </div>
        ) : (
          <span style={{ color: '#9CA3AF' }}>{placeholder}</span>
        )}
        <ChevronDown size={16} style={{ color: '#9CA3AF' }} />
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
          <div style={{ padding: 8, borderBottom: '1px solid #F3F4F6' }}>
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

// ─── State Select Component ────────────────────────────────────────────────
const StateSelectComponent = ({ states, value, onChange, disabled = false }) => {
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
          height: '48px',
          width: '100%',
          background: disabled ? '#F3F4F6' : '#F9FAFB',
          border: '1px solid #D1D5DB',
          borderRadius: '12px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          fontSize: '14px',
          transition: 'all 0.2s',
          opacity: disabled ? 0.6 : 1,
        }}
        onMouseEnter={e => { if (!disabled) { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.background = '#FAF5FF'; } }}
        onMouseLeave={e => { if (!disabled) { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.background = '#F9FAFB'; } }}
      >
        <span style={{ color: selected ? '#374151' : '#9CA3AF' }}>
          {selected ? selected.name : 'Select State'}
        </span>
        <ChevronDown size={16} style={{ color: '#9CA3AF' }} />
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
          <div style={{ padding: 8, borderBottom: '1px solid #F3F4F6' }}>
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
const CitySelectComponent = ({ cities, value, onChange, disabled = false }) => {
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
          height: '48px',
          width: '100%',
          background: disabled ? '#F3F4F6' : '#F9FAFB',
          border: '1px solid #D1D5DB',
          borderRadius: '12px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          fontSize: '14px',
          transition: 'all 0.2s',
          opacity: disabled ? 0.6 : 1,
        }}
        onMouseEnter={e => { if (!disabled) { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.background = '#FAF5FF'; } }}
        onMouseLeave={e => { if (!disabled) { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.background = '#F9FAFB'; } }}
      >
        <span style={{ color: selected ? '#374151' : '#9CA3AF' }}>
          {selected ? selected.name : 'Select City'}
        </span>
        <ChevronDown size={16} style={{ color: '#9CA3AF' }} />
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
          <div style={{ padding: 8, borderBottom: '1px solid #F3F4F6' }}>
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

export default function Sixth() {
  const { t } = useTranslation("mort6");
  const [api, contextHolder] = notification.useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "971",
    dialIso: "AE",
    phone: "",
    lookingFor: "",
    budget: "",
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

  const locationCountryOptions = useMemo(() => {
    return countriesList.map((country) => ({
      name: country.name,
      code: country.phonecode || '',
      iso: country.isoCode,
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [countriesList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCountryCodeChange = (isoCode) => {
    const selected = phoneCountryOptions.find(c => c.iso === isoCode);
    setFormData((prev) => ({ ...prev, countryCode: selected?.code || "971", dialIso: isoCode, phone: "" }));
  };

  const handlePhoneChange = (e) => {
    setFormData((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, "") }));
  };

  const handleLocationCountryChange = (isoCode) => {
    const updatedStates = State.getStatesOfCountry(isoCode);
    setStatesList(updatedStates);
    setCitiesList([]);
    setFormData((prev) => ({ ...prev, location_country: isoCode, state: null, city: null }));
  };

  const handleLocationStateChange = (stateCode) => {
    const updatedCities = City.getCitiesOfState(formData.location_country, stateCode);
    setCitiesList(updatedCities);
    setFormData((prev) => ({ ...prev, state: stateCode, city: null }));
  };

  const handleLocationCityChange = (cityName) => {
    setFormData((prev) => ({ ...prev, city: cityName }));
  };

  const openNotification = (type, title, description) => {
    api[type]({ message: title, description, placement: "topRight" });
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
    if (!formData.phone.trim()) {
      openNotification("error", "Validation Error", "Phone number is required");
      return false;
    }
    const parsed = parsePhoneNumberFromString(`+${formData.countryCode}${formData.phone}`);
    if (!parsed || !parsed.isValid()) {
      openNotification("error", "Validation Error", `Invalid phone number for +${formData.countryCode}`);
      return false;
    }
    if (!formData.lookingFor) {
      openNotification("error", "Validation Error", "Please select what you are looking for");
      return false;
    }
    if (!formData.location_country) {
      openNotification("error", "Validation Error", "Please select a country");
      return false;
    }
    if (!formData.state) {
      openNotification("error", "Validation Error", "Please select a state");
      return false;
    }
    if (citiesList.length > 0 && !formData.city) {
      openNotification("error", "Validation Error", "Please select a city");
      return false;
    }
    return true;
  };

  const parseBudget = (budgetStr) => {
    if (!budgetStr) return null;
    const numericValue = budgetStr.replace(/[^0-9]/g, '');
    return numericValue ? parseInt(numericValue) : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const selectedCountry = locationCountryOptions.find(c => c.iso === formData.location_country);
    const countryName = selectedCountry ? selectedCountry.name : "";
    
    const selectedState = statesList.find(s => s.isoCode === formData.state);
    const stateName = selectedState ? selectedState.name : formData.state;

    const transactionType = getTransactionType(formData.lookingFor);
    const timeline = getTimeline(formData.lookingFor);
    const occupation = getOccupation(formData.lookingFor);
    const budgetValue = parseBudget(formData.budget);

    const payload = {
      customerInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email.toLowerCase().trim(),
        countryCode: `+${formData.countryCode}`,
        mobileNumber: formData.phone,
        gender: null,
        nationality: countryName || "Not specified",
        maritalStatus: null,
        occupation: occupation,
        monthlySalary: null,
      },
      propertyDetails: {
        transactionType: transactionType,
        propertyFound: false,
        approxPropertyValue: null,
        propertyType: "Off-plan",
        propertySubtype: "Apartment",
        propertyValue: budgetValue,
        downPaymentAmount: null,
        loanAmountRequired: null,
        propertyAddress: {
          building: null,
          area: stateName,
          city: formData.city || "",
        },
        isOffPlan: true,
        completionDate: null,
      },
      loanRequirements: {
        timeline: timeline,
        preferredTenureYears: 25,
        preferredInterestRateType: "Fixed",
        preferredBanks: [],
        feeFinancingPreference: true,
        lifeInsurancePreference: true,
        propertyInsurancePreference: true,
        specialRequirements: `Looking For: ${formData.lookingFor}`,
      },
      notesToXoto: `Mortgage Inquiry from Website Form.
Looking For: ${formData.lookingFor}
Transaction Type: ${transactionType}
Budget: ${formData.budget}
Location: ${formData.city || ""}, ${stateName}, ${countryName}`,
    };

    try {
      const res = await apiService.post("/vault/lead/website", payload);

      const msg = res?.message || "Inquiry Submitted Successfully!";
      toast.success(msg);
      if (res?.success || res?.status === 200 || res?.status === 201) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          countryCode: "971",
          dialIso: "AE",
          phone: "",
          lookingFor: "",
          budget: "",
          location_country: null,
          state: null,
          city: null,
        });
        setStatesList([]);
        setCitiesList([]);
      }
    } catch (err) {
      console.error("API Error:", err);
      toast.error(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {contextHolder}

      <div className="relative min-h-screen bg-gradient-to-br from-[#F8F4FF] via-[#F4EEFF] to-[#E9F1FF] overflow-hidden" style={dmSans}>
        
        <img src={wave2} className="absolute top-15 w-full -translate-y-2/3 opacity-90" alt="" />
        <img src={wave1} className="absolute bottom-0 w-full translate-y-2/4 opacity-90" alt="" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-10 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* LEFT CONTENT */}
          <div className="w-full lg:max-w-[600px] text-center lg:text-left space-y-6 mx-auto lg:mx-0 lg:ms-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] leading-tight">
              {t("hero.title")}
            </h1>

            <p className="text-base sm:text-lg text-[#5A7BA1] leading-tight max-w-[360px] mx-auto lg:mx-0">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2 items-center lg:items-start justify-center lg:justify-start">
              <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto px-8 py-4 border-2 border-[#5C039B] text-[#5C039B] rounded-xl font-semibold text-base hover:bg-[#5C039B] hover:text-white transition">
                {t("hero.primaryCta")}
              </button>

              <button onClick={() => window.open("https://wa.me/971500888690", "_blank")} className="w-full sm:w-auto px-8 py-4 border-2 border-[#5C039B] text-[#5C039B] rounded-xl font-semibold text-base hover:bg-[#5C039B] hover:text-white transition">
                {t("hero.secondaryCta")}
              </button>
            </div>
          </div>

          {/* FORM */}
          <div className="bg-white rounded-3xl shadow-2xl p-5 md:p-8 space-y-5 w-full">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2">{t("form.heading")}</h3>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">

              {/* FIRST / LAST NAME */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="w-full">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">{t("form.firstName")} *</label>
                  <input 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange}
                    placeholder="First Name"
                    className="w-full h-12 px-4 text-sm md:text-base border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 transition"
                    required
                  />
                </div>

                <div className="w-full">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">{t("form.lastName")} *</label>
                  <input 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="w-full h-12 px-4 text-sm md:text-base border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 transition"
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="w-full">
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">{t("form.email")} *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full h-12 px-4 text-sm md:text-base border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 transition"
                  required
                />
              </div>

              {/* PHONE */}
              <div className="w-full">
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <div className="flex gap-2 items-center">
                  {/* Country code picker — auto-sized to content */}
                  <div className="flex-shrink-0" style={{ width: 'auto', minWidth: 110 }}>
                    <PhoneCountrySelect
                      countries={phoneCountryOptions}
                      value={formData.dialIso}
                      onChange={handleCountryCodeChange}
                    />
                  </div>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="Phone number"
                    inputMode="numeric"
                    className="flex-1 h-12 px-4 text-sm md:text-base border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Looking For & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="relative w-full">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">I am Looking to *</label>
                  <div className="relative">
                    <select 
                      name="lookingFor" 
                      value={formData.lookingFor} 
                      onChange={handleChange}
                      className="w-full h-12 px-4 text-sm md:text-base border border-gray-300 rounded-xl appearance-none pr-10 outline-none focus:ring-2 focus:ring-purple-500 transition"
                      required
                    >
                      <option value="">Select Option</option>
                      <option value="residential">🏠 Residential Mortgage Solutions</option>
                      <option value="commercial">🏢 Commercial Mortgage Solutions</option>
                      <option value="equity">💰 Pure Equity</option>
                      <option value="refinance">🔄 Buyout (Refinance)</option>
                      <option value="buyoutEquity">➕ Buyout + Equity</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <SearchableCountrySelect
                    countries={locationCountryOptions}
                    value={formData.location_country}
                    onChange={handleLocationCountryChange}
                    placeholder="Select Country"
                  />
                </div>
              </div>

              {/* State & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="w-full">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">State *</label>
                  <StateSelectComponent
                    states={statesList}
                    value={formData.state}
                    onChange={handleLocationStateChange}
                    disabled={!statesList.length}
                  />
                </div>

                <div className="w-full">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">{t("form.city")} *</label>
                  <CitySelectComponent
                    cities={citiesList}
                    value={formData.city}
                    onChange={handleLocationCityChange}
                    disabled={!citiesList.length}
                  />
                </div>
              </div>

              {/* BUDGET */}
              <div className="w-full">
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">{t("form.budget")}</label>
                <input 
                  name="budget" 
                  value={formData.budget} 
                  onChange={handleChange}
                  placeholder="e.g., 1,500,000 AED"
                  className="w-full h-12 px-4 text-sm md:text-base border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full h-12 md:h-14 text-sm md:text-lg bg-[#5C039B] hover:bg-[#5B21B6] text-white rounded-xl font-semibold shadow-lg transition flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : t("form.submit")}
              </button>
            </form>
          </div>

        </div>
      </div>

      <GetPreApprovedModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}