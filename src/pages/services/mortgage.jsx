import Head from 'next/head';
import dynamic from 'next/dynamic';

const Services = dynamic(() => import('@/components/homepage/Services'), { ssr: false });

export default function MortgageServicesPage() {
  return (
    <>
      <Head>
        <title>Mortgage Services | Xoto</title>
        <meta name="description" content="Comprehensive mortgage services in UAE." />
      </Head>
      <Services />
    </>
  );
}
