import Head from 'next/head';
import dynamic from 'next/dynamic';

const Finicial = dynamic(() => import('@/components/footer/Finicial'), { ssr: false });

export default function FinanceSoonPage() {
  return (
    <>
      <Head>
        <title>Finance | Xoto</title>
        <meta name="description" content="Finance solutions coming soon on Xoto." />
      </Head>
      <Finicial />
    </>
  );
}
