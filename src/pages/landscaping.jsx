import Head from 'next/head';
import dynamic from 'next/dynamic';

const Landscaping = dynamic(() => import('@/components/homepage/Landspackng'), { ssr: false });

export default function LandscapingPage() {
  return (
    <>
      <Head>
        <title>Landscaping | Xoto</title>
        <meta name="description" content="Professional landscaping services in UAE." />
      </Head>
      <Landscaping />
    </>
  );
}
