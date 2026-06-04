import Head from 'next/head';
import Home from '@/components/homepage/Home';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Xoto | Smart Real Estate, Mortgage &amp; Interior Platform - UAE</title>
        <meta name="description" content="Xoto is UAE's premier platform for real estate, mortgage services, interior design, landscaping, and AI-powered property tools." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Xoto | UAE Real Estate &amp; Mortgage Platform" />
        <meta property="og:description" content="UAE's premier platform for real estate, mortgage, interior design and AI-powered tools." />
        <meta property="og:image" content="https://xoto.ae/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Home />
    </>
  );
}
