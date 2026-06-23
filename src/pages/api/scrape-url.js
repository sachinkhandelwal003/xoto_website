// API: fetch a URL and return its text content (strips HTML)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { url } = req.body
  if (!url || !url.startsWith('http')) return res.status(400).json({ error: 'Invalid URL' })

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; XotoBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(12000),
    })

    if (!response.ok) return res.status(502).json({ error: `Remote server returned ${response.status}` })

    const html = await response.text()

    // Strip scripts, styles, nav, footer, header tags
    let text = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s{2,}/g, ' ')
      .trim()

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : url

    // Limit content length
    if (text.length > 8000) text = text.slice(0, 8000) + '...'

    return res.status(200).json({ title, text, url })
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Fetch failed' })
  }
}
