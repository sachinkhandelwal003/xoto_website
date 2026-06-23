import Head from 'next/head'
import React, { useState, useEffect, useRef } from 'react'
import { propertyQA } from '@/answers'

const LANGUAGES = [
  { code: 'en', label: 'English',  flag: '🇬🇧', dir: 'ltr' },
  { code: 'es', label: 'Español',  flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', label: 'Deutsch',  flag: '🇩🇪', dir: 'ltr' },
  { code: 'ar', label: 'العربية', flag: '🇦🇪', dir: 'rtl' },
  { code: 'hi', label: 'हिन्दी',  flag: '🇮🇳', dir: 'ltr' },
]

const STORAGE_KEY = 'xoto_kb_overrides'

function loadOverrides() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}
function saveOverrides(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export default function KnowledgeBasePage() {
  const [activeTab, setActiveTab] = useState('kb') // 'kb' | 'scraper'
  const [lang, setLang]         = useState('en')
  const [overrides, setOverrides] = useState({})
  const [editKey, setEditKey]   = useState(null)
  const [editVal, setEditVal]   = useState('')
  const [newKey, setNewKey]     = useState('')
  const [newVal, setNewVal]     = useState('')
  const [search, setSearch]     = useState('')
  const [toast, setToast]       = useState('')
  const [showExport, setShowExport] = useState(false)
  const textareaRef = useRef(null)

  // Scraper state
  const [scrapeUrl, setScrapeUrl] = useState('')
  const [scrapeLoading, setScrapeLoading] = useState(false)
  const [scrapeResult, setScrapeResult] = useState(null)
  const [scrapeError, setScrapeError] = useState('')
  const [scrapeKey, setScrapeKey] = useState('')
  const [scrapeSelected, setScrapeSelected] = useState('')
  const [scraped, setScraped] = useState([]) // history of scraped pages

  useEffect(() => { setOverrides(loadOverrides()) }, [])

  // Merged entries: base answers + localStorage overrides
  const baseEntries = Object.entries(propertyQA[lang] || propertyQA['en'])
  const langOverrides = overrides[lang] || {}
  const allKeys = [...new Set([...baseEntries.map(([k]) => k), ...Object.keys(langOverrides)])]
  const entries = allKeys
    .map(k => ({ key: k, value: k in langOverrides ? langOverrides[k] : (propertyQA[lang]?.[k] ?? '') }))
    .filter(e => !search || e.key.toLowerCase().includes(search.toLowerCase()) || e.value.toLowerCase().includes(search.toLowerCase()))

  const currentDir = LANGUAGES.find(l => l.code === lang)?.dir || 'ltr'

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2500) }

  function startEdit(key, val) { setEditKey(key); setEditVal(val); setTimeout(() => textareaRef.current?.focus(), 50) }

  function saveEdit() {
    if (!editKey) return
    const updated = { ...overrides, [lang]: { ...(overrides[lang] || {}), [editKey]: editVal } }
    setOverrides(updated)
    saveOverrides(updated)
    setEditKey(null)
    showToast('Saved!')
  }

  function resetEntry(key) {
    const base = propertyQA[lang]?.[key]
    const updated = { ...overrides, [lang]: { ...(overrides[lang] || {}) } }
    if (base !== undefined) delete updated[lang][key]
    else delete updated[lang][key]
    setOverrides(updated)
    saveOverrides(updated)
    showToast('Reset to default')
  }

  function addEntry() {
    if (!newKey.trim() || !newVal.trim()) return
    const updated = { ...overrides, [lang]: { ...(overrides[lang] || {}), [newKey.trim()]: newVal.trim() } }
    setOverrides(updated)
    saveOverrides(updated)
    setNewKey(''); setNewVal('')
    showToast(`Added "${newKey.trim()}"`)
  }

  function deleteEntry(key) {
    const updated = { ...overrides, [lang]: { ...(overrides[lang] || {}) } }
    delete updated[lang][key]
    // Also remove from base by marking as empty (so it still shows deleted visually we just skip it)
    setOverrides(updated)
    saveOverrides(updated)
    showToast('Deleted')
  }

  function exportCode() {
    // Build the merged object for the current language
    const merged = {}
    allKeys.forEach(k => {
      const v = k in langOverrides ? langOverrides[k] : (propertyQA[lang]?.[k] ?? '')
      if (v) merged[k] = v
    })
    return JSON.stringify(merged, null, 2)
  }

  function copyExport() {
    navigator.clipboard.writeText(exportCode())
    showToast('Copied to clipboard!')
  }

  async function handleScrape() {
    if (!scrapeUrl.trim()) return
    setScrapeLoading(true)
    setScrapeError('')
    setScrapeResult(null)
    try {
      const res = await fetch('/api/scrape-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: scrapeUrl.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setScrapeError(data.error || 'Failed'); return }
      setScrapeResult(data)
      setScrapeSelected(data.text)
      setScrapeKey(data.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40))
      setScraped(prev => [data, ...prev.filter(p => p.url !== data.url)].slice(0, 20))
    } catch (e) {
      setScrapeError(e.message)
    } finally {
      setScrapeLoading(false)
    }
  }

  function saveScrapeToKB() {
    if (!scrapeKey.trim() || !scrapeSelected.trim()) return
    const updated = { ...overrides, [lang]: { ...(overrides[lang] || {}), [scrapeKey.trim()]: scrapeSelected.trim() } }
    setOverrides(updated)
    saveOverrides(updated)
    showToast(`Saved "${scrapeKey}" to ${lang.toUpperCase()} KB`)
    setScrapeKey('')
  }

  const isOverridden = (key) => lang in overrides && key in overrides[lang]

  return (
    <>
      <Head>
        <title>Knowledge Base — Xoto Admin</title>
      </Head>

      <div style={s.page}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Knowledge Base</h1>
            <p style={s.subtitle}>View and edit Q&amp;A entries per language. Changes are saved locally.</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={s.exportBtn} onClick={() => setShowExport(v => !v)}>
              {showExport ? 'Hide Export' : '⬆ Export JSON'}
            </button>
            <a href="/test" style={s.testLink}>🤖 Test Avatar</a>
          </div>
        </div>

        {/* Main Tabs */}
        <div style={s.mainTabs}>
          <button style={{ ...s.mainTab, ...(activeTab === 'kb' ? s.mainTabActive : {}) }} onClick={() => setActiveTab('kb')}>
            📚 Knowledge Base
          </button>
          <button style={{ ...s.mainTab, ...(activeTab === 'scraper' ? s.mainTabActive : {}) }} onClick={() => setActiveTab('scraper')}>
            🌐 Web Scraper
          </button>
        </div>

        {/* ── SCRAPER TAB ── */}
        {activeTab === 'scraper' && (
          <div>
            <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>
              Paste any URL — your website pages or external sites. The content will be extracted and you can save it into the Knowledge Base.
            </p>

            {/* URL input */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <input
                placeholder="https://example.com/about"
                value={scrapeUrl}
                onChange={e => setScrapeUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleScrape()}
                style={{ ...s.searchInput, flex: 1 }}
              />
              <button style={s.addBtn} onClick={handleScrape} disabled={scrapeLoading || !scrapeUrl.trim()}>
                {scrapeLoading ? 'Fetching...' : 'Fetch'}
              </button>
            </div>

            {scrapeError && <div style={s.errorBox}>{scrapeError}</div>}

            {scrapeResult && (
              <div style={s.scrapeCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{scrapeResult.title}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{scrapeResult.url}</div>
                  </div>
                  <span style={{ ...s.pill, background: 'rgba(56,189,248,0.1)', color: '#38bdf8' }}>
                    {scrapeResult.text.length} chars
                  </span>
                </div>

                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                  Extracted text — edit before saving:
                </label>
                <textarea
                  value={scrapeSelected}
                  onChange={e => setScrapeSelected(e.target.value)}
                  style={{ ...s.editTextarea, minHeight: 180 }}
                  rows={8}
                />

                <div style={{ display: 'flex', gap: 10, marginTop: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    placeholder="KB key (e.g. about_page)"
                    value={scrapeKey}
                    onChange={e => setScrapeKey(e.target.value)}
                    style={{ ...s.searchInput, width: 220, flex: 'none' }}
                  />
                  <select
                    value={lang}
                    onChange={e => setLang(e.target.value)}
                    style={s.select}
                  >
                    {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
                  </select>
                  <button style={s.saveBtn} onClick={saveScrapeToKB} disabled={!scrapeKey.trim() || !scrapeSelected.trim()}>
                    Save to KB
                  </button>
                </div>
              </div>
            )}

            {/* Scrape History */}
            {scraped.length > 1 && (
              <div style={{ marginTop: 28 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 12 }}>Previously fetched</div>
                {scraped.slice(1).map((item, i) => (
                  <div key={i} style={{ ...s.entry, cursor: 'pointer' }} onClick={() => { setScrapeResult(item); setScrapeSelected(item.text); setScrapeKey(item.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40)); setScrapeUrl(item.url) }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa' }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{item.url}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── KB TAB ── */}
        {activeTab === 'kb' && <>

        {/* Language Tabs */}
        <div style={s.langTabs}>
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              style={{ ...s.langTab, ...(lang === l.code ? s.langTabActive : {}) }}
              onClick={() => { setLang(l.code); setEditKey(null); setSearch('') }}
            >
              {l.flag} {l.label}
              {overrides[l.code] && Object.keys(overrides[l.code]).length > 0 &&
                <span style={s.badge}>{Object.keys(overrides[l.code]).length}</span>
              }
            </button>
          ))}
        </div>

        {/* Export Panel */}
        {showExport && (
          <div style={s.exportPanel}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: 13 }}>Exported JSON — {lang.toUpperCase()}</span>
              <button style={s.copyBtn} onClick={copyExport}>Copy</button>
            </div>
            <pre style={s.exportPre}>{exportCode()}</pre>
          </div>
        )}

        {/* Search + Add */}
        <div style={s.toolbar}>
          <input
            placeholder="Search key or answer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={s.searchInput}
          />
          <span style={s.entryCount}>{entries.length} entries</span>
        </div>

        {/* Add New Entry */}
        <div style={s.addRow}>
          <input
            placeholder="New key (e.g. visa)"
            value={newKey}
            onChange={e => setNewKey(e.target.value)}
            style={{ ...s.searchInput, width: 180 }}
          />
          <input
            placeholder="Answer text..."
            value={newVal}
            onChange={e => setNewVal(e.target.value)}
            style={{ ...s.searchInput, flex: 1 }}
            dir={currentDir}
          />
          <button style={s.addBtn} onClick={addEntry} disabled={!newKey.trim() || !newVal.trim()}>+ Add</button>
        </div>

        {/* Entries */}
        <div style={s.entries}>
          {entries.map(({ key, value }) => (
            <div key={key} style={{ ...s.entry, ...(isOverridden(key) ? s.entryModified : {}) }}>
              <div style={s.entryTop}>
                <span style={s.entryKey}>{key}</span>
                {isOverridden(key) && !propertyQA[lang]?.[key] && (
                  <span style={{ ...s.pill, background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>new</span>
                )}
                {isOverridden(key) && propertyQA[lang]?.[key] && (
                  <span style={{ ...s.pill, background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>edited</span>
                )}
                <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
                  {editKey !== key && (
                    <button style={s.iconBtn} onClick={() => startEdit(key, value)} title="Edit">✏️</button>
                  )}
                  {isOverridden(key) && propertyQA[lang]?.[key] && (
                    <button style={{ ...s.iconBtn, color: '#94a3b8' }} onClick={() => resetEntry(key)} title="Reset to default">↩</button>
                  )}
                  {(!propertyQA[lang]?.[key] || isOverridden(key)) && (
                    <button style={{ ...s.iconBtn, color: '#f87171' }} onClick={() => deleteEntry(key)} title="Delete">🗑</button>
                  )}
                </div>
              </div>

              {editKey === key ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <textarea
                    ref={textareaRef}
                    value={editVal}
                    onChange={e => setEditVal(e.target.value)}
                    style={{ ...s.editTextarea, direction: currentDir }}
                    rows={4}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={s.saveBtn} onClick={saveEdit}>Save</button>
                    <button style={s.cancelBtn} onClick={() => setEditKey(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <p style={{ ...s.entryVal, direction: currentDir }}>{value || <em style={{ color: '#475569' }}>— empty —</em>}</p>
              )}
            </div>
          ))}

          {entries.length === 0 && (
            <div style={s.emptyState}>No entries found{search ? ` for "${search}"` : ''}.</div>
          )}
        </div>

        </> /* end kb tab */}

        {/* Toast */}
        {toast && <div style={s.toast}>{toast}</div>}
      </div>
    </>
  )
}

const s = {
  mainTabs: {
    display: 'flex',
    gap: 8,
    marginBottom: 28,
  },
  mainTab: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#64748b',
    borderRadius: 8,
    padding: '9px 20px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  mainTabActive: {
    background: 'rgba(92,3,155,0.3)',
    border: '1px solid rgba(167,139,250,0.5)',
    color: '#c4b5fd',
  },
  errorBox: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#f87171',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 13,
    marginBottom: 16,
  },
  scrapeCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(167,139,250,0.2)',
    borderRadius: 12,
    padding: '18px',
    marginBottom: 20,
  },
  select: {
    background: '#130a24',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.15)',
    padding: '8px 12px',
    borderRadius: 8,
    fontSize: 13,
    cursor: 'pointer',
    outline: 'none',
  },
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top, #1b0a30 0%, #090514 100%)',
    color: '#e2e8f0',
    fontFamily: 'var(--font-sans), sans-serif',
    padding: '80px 24px 60px',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
    flexWrap: 'wrap',
    gap: 16,
  },
  title: { fontSize: 28, fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.5px' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 6 },
  exportBtn: {
    background: 'rgba(167,139,250,0.12)',
    border: '1px solid rgba(167,139,250,0.3)',
    color: '#a78bfa',
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  testLink: {
    background: '#5c039b',
    color: '#fff',
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 600,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  langTabs: {
    display: 'flex',
    gap: 8,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  langTab: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#94a3b8',
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    transition: 'all 0.2s',
  },
  langTabActive: {
    background: 'rgba(92,3,155,0.3)',
    border: '1px solid rgba(167,139,250,0.5)',
    color: '#c4b5fd',
  },
  badge: {
    background: '#5c039b',
    color: '#fff',
    borderRadius: 12,
    padding: '1px 7px',
    fontSize: 10,
    fontWeight: 700,
    minWidth: 18,
    textAlign: 'center',
  },
  exportPanel: {
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(167,139,250,0.2)',
    borderRadius: 12,
    padding: '16px',
    marginBottom: 20,
  },
  exportPre: {
    margin: 0,
    fontSize: 11,
    color: '#94a3b8',
    overflowX: 'auto',
    maxHeight: 240,
    overflowY: 'auto',
    lineHeight: 1.5,
  },
  copyBtn: {
    background: '#5c039b',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '4px 12px',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  searchInput: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: '9px 14px',
    color: '#f1f5f9',
    fontSize: 13,
    outline: 'none',
    flex: 1,
  },
  entryCount: { fontSize: 12, color: '#475569', whiteSpace: 'nowrap' },
  addRow: {
    display: 'flex',
    gap: 10,
    marginBottom: 20,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  addBtn: {
    background: '#5c039b',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '9px 20px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  entries: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  entry: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 10,
    padding: '14px 16px',
  },
  entryModified: {
    border: '1px solid rgba(167,139,250,0.2)',
    background: 'rgba(92,3,155,0.1)',
  },
  entryTop: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  entryKey: {
    fontSize: 12,
    fontWeight: 700,
    color: '#a78bfa',
    fontFamily: 'monospace',
    background: 'rgba(167,139,250,0.1)',
    padding: '2px 8px',
    borderRadius: 4,
  },
  pill: {
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iconBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: 15,
    padding: '2px 4px',
    borderRadius: 4,
    opacity: 0.75,
  },
  entryVal: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 1.6,
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  editTextarea: {
    width: '100%',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(167,139,250,0.4)',
    borderRadius: 8,
    color: '#f1f5f9',
    fontSize: 13,
    padding: '10px 12px',
    resize: 'vertical',
    outline: 'none',
    fontFamily: 'inherit',
    lineHeight: 1.6,
    boxSizing: 'border-box',
  },
  saveBtn: {
    background: '#5c039b',
    color: '#fff',
    border: 'none',
    borderRadius: 7,
    padding: '7px 18px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  },
  cancelBtn: {
    background: 'rgba(255,255,255,0.07)',
    color: '#94a3b8',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 7,
    padding: '7px 16px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    color: '#475569',
    padding: '48px 0',
    fontSize: 14,
  },
  toast: {
    position: 'fixed',
    bottom: 32,
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#5c039b',
    color: '#fff',
    padding: '10px 24px',
    borderRadius: 24,
    fontSize: 13,
    fontWeight: 700,
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    zIndex: 9999,
    pointerEvents: 'none',
  },
}
