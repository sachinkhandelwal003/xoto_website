import Head from 'next/head';
import dynamic from 'next/dynamic';

const Buy = dynamic(() => import('@/components/homepage/Buy'), { ssr: false });

export default function PropertyPage() {
  return (
    <>
      <Head>
        <title>Properties | Xoto</title>
        <meta name="description" content="Browse properties available in UAE on Xoto." />
      </Head>
      <Buy />
    </>
  );
}
