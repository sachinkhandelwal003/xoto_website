import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Automatic cleanup of conflicting superadmin route file
const conflictingFile = path.resolve(__dirname, 'src/pages/dashboard/superadmin/[[...rest]].jsx');
if (fs.existsSync(conflictingFile)) {
  try {
    fs.unlinkSync(conflictingFile);
    const parentDir = path.dirname(conflictingFile);
    if (fs.readdirSync(parentDir).length === 0) {
      fs.rmdirSync(parentDir);
    }
  } catch (e) {
    console.warn('Could not clean up conflicting superadmin route:', e);
  }
}


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,

  // Allow images from any domain (mirrors the existing setup)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  webpack(config) {
    // 1. Redirect react-router-dom to our Next.js compatibility shim
    config.resolve.alias['react-router-dom'] = path.resolve(
      __dirname,
      'src/lib/router-compat.jsx'
    );

    // 2. Replace next-image-loader with asset/resource so image imports
    //    return plain URL strings (Vite behaviour), not StaticImageData objects.
    //    Without this, <img src={importedPng} /> renders src="[object Object]".
    function fixImageRules(rules) {
      return rules.map(rule => {
        // Recurse into oneOf blocks
        if (Array.isArray(rule.oneOf)) {
          return { ...rule, oneOf: fixImageRules(rule.oneOf) };
        }

        // Detect the next-image-loader
        const loaderStr =
          (typeof rule.loader === 'string' && rule.loader) ||
          (rule.use && typeof rule.use === 'object' && !Array.isArray(rule.use) && rule.use.loader) ||
          (Array.isArray(rule.use) && rule.use[0] &&
            (typeof rule.use[0] === 'string' ? rule.use[0] : rule.use[0].loader)) || '';

        if (loaderStr.includes('next-image-loader')) {
          return {
            test: /\.(png|jpg|jpeg|gif|webp|avif|bmp|ico)$/i,
            type: 'asset/resource',
            generator: { filename: 'static/media/[name].[hash][ext]' },
          };
        }

        return rule;
      });
    }

    config.module.rules = fixImageRules(config.module.rules);

    return config;
  },

  // Transpile packages that ship ESM-only
  transpilePackages: ['swiper', 'ssr-window', 'dom7', 'react-dnd', 'react-dnd-html5-backend', 'react-router-dom', 'react-router'],

  // Production optimizations
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
};

export default nextConfig;
