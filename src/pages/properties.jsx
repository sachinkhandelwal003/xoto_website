import Head from 'next/head';
import dynamic from 'next/dynamic';

const Page2 = dynamic(() => import('@/components/homepage/Page2'), { ssr: false });

export default function PropertiesPage() {
  return (
    <>
      <Head>
        <title>Properties | Xoto</title>
        <meta name="description" content="Browse all properties available on Xoto." />
      </Head>
      <Page2 />
    </>
  );
}
