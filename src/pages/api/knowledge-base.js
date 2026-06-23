// /api/knowledge-base.js — Read & write knowledgeBase.json
import fs from 'fs'
import path from 'path'

const KB_PATH = path.join(process.cwd(), 'public', 'knowledgeBase.json')

function readKB() {
  try { return JSON.parse(fs.readFileSync(KB_PATH, 'utf-8')) } catch { return {} }
}

export default function handler(req, res) {
  // GET — return full KB or single language
  if (req.method === 'GET') {
    const kb = readKB()
    const { lang } = req.query
    return res.status(200).json(lang ? (kb[lang] || {}) : kb)
  }

  // POST — save entries for a language
  if (req.method === 'POST') {
    const { lang, entries } = req.body
    if (!lang || !entries) return res.status(400).json({ error: 'lang and entries required' })
    const kb = readKB()
    kb[lang] = { ...(kb[lang] || {}), ...entries }
    try {
      fs.writeFileSync(KB_PATH, JSON.stringify(kb, null, 2), 'utf-8')
      return res.status(200).json({ ok: true })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  // DELETE — remove a key from a language
  if (req.method === 'DELETE') {
    const { lang, key } = req.body
    if (!lang || !key) return res.status(400).json({ error: 'lang and key required' })
    const kb = readKB()
    if (kb[lang]) delete kb[lang][key]
    try {
      fs.writeFileSync(KB_PATH, JSON.stringify(kb, null, 2), 'utf-8')
      return res.status(200).json({ ok: true })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).end()
}
