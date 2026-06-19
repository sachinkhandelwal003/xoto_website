import Head from 'next/head';
import dynamic from 'next/dynamic';

const Mortgage = dynamic(() => import('@/components/homepage/Mortgage'), { ssr: false });

export default function MortgagesPage() {
  return (
    <>
      <Head>
        <title>Mortgages | Xoto</title>
        <meta name="description" content="Find the best mortgage options in UAE with Xoto." />
      </Head>
      <Mortgage />
    </>
  );
}
