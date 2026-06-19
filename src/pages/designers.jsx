import Head from 'next/head';
import dynamic from 'next/dynamic';

const Designers = dynamic(() => import('@/components/Designers/Designers'), { ssr: false });

export default function DesignersPage() {
  return (
    <>
      <Head>
        <title>Designers | Xoto</title>
        <meta name="description" content="Find professional designers on Xoto." />
      </Head>
      <Designers />
    </>
  );
}
