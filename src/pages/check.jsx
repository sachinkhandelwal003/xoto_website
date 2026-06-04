import Head from 'next/head';
import dynamic from 'next/dynamic';

const Checker = dynamic(() => import('@/Checker'), { ssr: false });

export default function CheckPage() {
  return (
    <>
      <Head>
        <title>Check | Xoto</title>
        <meta name="description" content="Xoto check page." />
      </Head>
      <Checker />
    </>
  );
}
