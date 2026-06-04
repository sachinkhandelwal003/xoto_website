import Head from 'next/head';
import dynamic from 'next/dynamic';

const B2BHome = dynamic(() => import('@/components/ecommerce/B2B/Home'), { ssr: false });

export default function B2BStorePage() {
  return (
    <>
      <Head>
        <title>B2B Store | Xoto</title>
        <meta name="description" content="Xoto B2B ecommerce store." />
      </Head>
      <B2BHome />
    </>
  );
}
