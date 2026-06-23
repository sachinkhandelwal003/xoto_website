// /api/chat.js — GPT-4o with tool calling: properties, rentals, banks, bank products
const BACKEND = process.env.BACKEND_URL || 'http://localhost:5000'

// ── Tool definitions ─────────────────────────────────────────────────────────
const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'searchProperties',
      description: 'Search buy/sell/off-plan properties from the database with filters. Use this when user asks about buying a property, apartments for sale, villas, off-plan projects, etc.',
      parameters: {
        type: 'object',
        properties: {
          propertySubType: { type: 'string', enum: ['off_plan', 'secondary', 'commercial'], description: 'off_plan = under construction projects, secondary = ready homes' },
          unitType:        { type: 'string', description: 'apartment, villa, studio, penthouse, townhouse' },
          bedrooms:        { type: 'number', description: 'Number of bedrooms' },
          minPrice:        { type: 'number', description: 'Minimum price in AED' },
          maxPrice:        { type: 'number', description: 'Maximum price in AED' },
          city:            { type: 'string', description: 'Dubai, Abu Dhabi, Sharjah, etc.' },
          area:            { type: 'string', description: 'Downtown, Marina, Palm Jumeirah, etc.' },
          search:          { type: 'string', description: 'Keyword search' },
          limit:           { type: 'number', description: 'Max results (default 5)' }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'searchRentalProperties',
      description: 'Search rental properties from the database. Use when user asks about renting, monthly/yearly rent, rental apartments or villas.',
      parameters: {
        type: 'object',
        properties: {
          unitType:  { type: 'string', description: 'apartment, villa, studio, etc.' },
          bedrooms:  { type: 'number' },
          minPrice:  { type: 'number', description: 'Min rent in AED' },
          maxPrice:  { type: 'number', description: 'Max rent in AED' },
          city:      { type: 'string' },
          area:      { type: 'string' },
          limit:     { type: 'number', description: 'Max results (default 5)' }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'getBankProducts',
      description: 'Get available mortgage/bank products with interest rates. Use when user asks about home loans, mortgages, interest rates, bank offers, financing.',
      parameters: {
        type: 'object',
        properties: {
          featured: { type: 'boolean', description: 'true to get only featured/best products' }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'getBanks',
      description: 'Get list of all partner banks available. Use when user asks which banks are available or partner banks.',
      parameters: { type: 'object', properties: {} }
    }
  }
]

// ── Execute a tool call ───────────────────────────────────────────────────────
async function executeTool(name, args) {
  try {
    if (name === 'searchProperties') {
      const params = new URLSearchParams()
      if (args.propertySubType) params.set('propertySubType', args.propertySubType)
      if (args.unitType)        params.set('unitType', args.unitType)
      if (args.bedrooms)        params.set('bedrooms', args.bedrooms)
      if (args.minPrice)        params.set('minPrice', args.minPrice)
      if (args.maxPrice)        params.set('maxPrice', args.maxPrice)
      if (args.city)            params.set('city', args.city)
      if (args.area)            params.set('area', args.area)
      if (args.search)          params.set('search', args.search)
      params.set('limit', args.limit || 5)
      params.set('approvalStatus', 'approved')
      params.set('listingStatus', 'active')

      const r = await fetch(`${BACKEND}/properties/public?${params}`, { signal: AbortSignal.timeout(8000) })
      if (!r.ok) return { error: `Backend returned ${r.status}`, properties: [] }
      const data = await r.json()
      const props = (data.data || data.properties || []).slice(0, 5)
      return {
        count: props.length,
        properties: props.map(p => ({
          name:     p.projectName || p.propertyName || 'Property',
          type:     p.unitType,
          bedrooms: p.bedrooms,
          price:    p.price_min ? `AED ${(p.price_min/1000000).toFixed(2)}M` : (p.price ? `AED ${p.price.toLocaleString()}` : 'Price on request'),
          area:     p.locality || p.area || p.city,
          status:   p.projectStatus || p.propertySubType,
          overview: p.overview ? p.overview.slice(0, 120) : ''
        }))
      }
    }

    if (name === 'searchRentalProperties') {
      const params = new URLSearchParams()
      if (args.unitType)  params.set('unitType', args.unitType)
      if (args.bedrooms)  params.set('bedrooms', args.bedrooms)
      if (args.minPrice)  params.set('minPrice', args.minPrice)
      if (args.maxPrice)  params.set('maxPrice', args.maxPrice)
      if (args.city)      params.set('city', args.city)
      if (args.area)      params.set('area', args.area)
      params.set('limit', args.limit || 5)

      const r = await fetch(`${BACKEND}/rental/property/search?${params}`, { signal: AbortSignal.timeout(8000) })
      if (!r.ok) return { error: `Backend returned ${r.status}`, properties: [] }
      const data = await r.json()
      const props = (data.data || data.properties || []).slice(0, 5)
      return {
        count: props.length,
        properties: props.map(p => ({
          name:     p.propertyName || p.projectName || 'Rental Property',
          type:     p.unitType,
          bedrooms: p.bedrooms,
          rent:     p.rent ? `AED ${p.rent.toLocaleString()}/${p.rentalFrequency || 'year'}` : 'Price on request',
          area:     p.locality || p.area || p.city,
          overview: p.overview ? p.overview.slice(0, 120) : ''
        }))
      }
    }

    if (name === 'getBankProducts') {
      const url = args.featured
        ? `${BACKEND}/bank/products/featured`
        : `${BACKEND}/bank/products`
      const r = await fetch(url, { signal: AbortSignal.timeout(8000) })
      if (!r.ok) return { error: `Backend returned ${r.status}`, products: [] }
      const data = await r.json()
      const products = (data.data || data.products || []).slice(0, 5)
      return {
        count: products.length,
        products: products.map(p => ({
          bank:         p.bankName || p.bank?.name || 'Bank',
          product:      p.productName || p.name,
          interestRate: p.interestRate ? `${p.interestRate}%` : (p.rate ? `${p.rate}%` : 'N/A'),
          type:         p.rateType || p.type,
          maxLTV:       p.maxLTV ? `${p.maxLTV}%` : null,
          minSalary:    p.minSalary ? `AED ${p.minSalary.toLocaleString()}` : null,
          tenure:       p.maxTenure ? `Up to ${p.maxTenure} years` : null
        }))
      }
    }

    if (name === 'getBanks') {
      const r = await fetch(`${BACKEND}/bank`, { signal: AbortSignal.timeout(8000) })
      if (!r.ok) return { error: `Backend returned ${r.status}`, banks: [] }
      const data = await r.json()
      const banks = (data.data || data.banks || [])
      return {
        count: banks.length,
        banks: banks.map(b => ({
          name:    b.name || b.bankName,
          country: b.country,
          logo:    b.logo
        }))
      }
    }

    return { error: 'Unknown tool' }
  } catch (err) {
    return { error: err.message || 'Tool execution failed' }
  }
}

// ── Main handler ──────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { question, language = 'en', knowledgeBase = {} } = req.body
  if (!question) return res.status(400).json({ error: 'Question is required' })

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'OpenAI API key not configured' })

  const langNames = { en: 'English', es: 'Spanish', fr: 'French', de: 'German', ar: 'Arabic', hi: 'Hindi' }
  const langName  = langNames[language] || 'English'

  const kbContext = Object.entries(knowledgeBase).length > 0
    ? Object.entries(knowledgeBase).map(([k, v]) => `[${k}]: ${v}`).join('\n\n')
    : ''

  const systemPrompt = `You are XOBIA — the official AI assistant for XOTO, a PropTech company in UAE.

LANGUAGE RULE: Always respond in ${langName}.

KNOWLEDGE BASE (use this for company/product info):
${kbContext || 'Use your built-in Xoto knowledge.'}

TOOLS AVAILABLE:
- searchProperties: for buy/sell/off-plan property queries
- searchRentalProperties: for rent queries
- getBankProducts: for mortgage/interest rate queries
- getBanks: for listing partner banks

WHEN TO USE TOOLS: Use tools when the user asks about specific properties, prices, listings, or bank rates. Do NOT use tools for general questions already in the knowledge base.

VOICE RESPONSE STYLE:
- Keep responses SHORT — 2 to 4 sentences max. This is a voice assistant.
- When sharing property results, mention 2-3 highlights naturally.
- Format numbers naturally: "1.5 million dirhams" not "AED 1,500,000".
- Be warm, professional, and conversational.
- No bullet points or markdown — plain spoken sentences only.`

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user',   content: question }
  ]

  try {
    // ── Round 1: GPT decides if tool needed ─────────────────────────────────
    let response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4o', messages, tools: TOOLS, tool_choice: 'auto', max_tokens: 300, temperature: 0.4 })
    })

    if (!response.ok) return res.status(response.status).json({ error: `OpenAI error: ${response.status}` })

    let data     = await response.json()
    let message  = data.choices?.[0]?.message

    // ── Round 2: Execute tool calls if any ──────────────────────────────────
    if (message?.tool_calls?.length > 0) {
      messages.push(message)

      // Execute all tool calls in parallel
      const toolResults = await Promise.all(
        message.tool_calls.map(async (tc) => {
          let args = {}
          try { args = JSON.parse(tc.function.arguments || '{}') } catch {}
          const result = await executeTool(tc.function.name, args)
          return { tool_call_id: tc.id, role: 'tool', content: JSON.stringify(result) }
        })
      )

      messages.push(...toolResults)

      // Final GPT call with tool results
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-4o', messages, max_tokens: 300, temperature: 0.4 })
      })

      if (!response.ok) return res.status(response.status).json({ error: `OpenAI error: ${response.status}` })
      data    = await response.json()
      message = data.choices?.[0]?.message
    }

    const answer = message?.content?.trim() || 'Sorry, I could not generate a response.'
    return res.status(200).json({ answer })

  } catch (err) {
    console.error('Chat handler error:', err)
    return res.status(500).json({ error: err.message || 'Chat failed' })
  }
}
