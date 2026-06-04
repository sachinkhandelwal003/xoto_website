import Head from 'next/head';
import dynamic from 'next/dynamic';

const B2CHome = dynamic(() => import('@/components/ecommerce/B2C/Home'), { ssr: false });

export default function B2CStorePage() {
  return (
    <>
      <Head>
        <title>B2C Store | Xoto</title>
        <meta name="description" content="Shop on Xoto B2C store." />
      </Head>
      <B2CHome />
    </>
  );
}
