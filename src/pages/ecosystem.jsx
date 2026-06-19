import Head from 'next/head';
import dynamic from 'next/dynamic';

const Ecosystem = dynamic(() => import('@/components/homepage/Ecosystem'), { ssr: false });

export default function EcosystemPage() {
  return (
    <>
      <Head>
        <title>Ecosystem | Xoto</title>
        <meta name="description" content="Explore the Xoto ecosystem." />
      </Head>
      <Ecosystem />
    </>
  );
}
