// Main backend — no /api suffix (backend routes handle their own prefix)
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://xotobackend.kotiboxglobaltech.site';

// Site API — includes /api (xoto.ae direct API calls)
const SITE_API_URL = process.env.NEXT_PUBLIC_SITE_API_URL || 'https://xoto.ae/api';

// Upload endpoint — full URL ready to use
const UPLOAD_URL = process.env.NEXT_PUBLIC_UPLOAD_URL || 'https://xoto.ae/api/upload';

// Ecommerce / Vendor API — includes /api
const ECOMMERCE_URL = process.env.NEXT_PUBLIC_ECOMMERCE_URL || 'https://kotiboxglobaltech.online/api';

// Frontend site URL
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://xoto.ae';

// Socket server URL
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://xoto.ae';

export { BACKEND_URL, SITE_API_URL, UPLOAD_URL, ECOMMERCE_URL, SITE_URL, SOCKET_URL };
