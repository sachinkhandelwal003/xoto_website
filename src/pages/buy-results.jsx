import Head from 'next/head';
import dynamic from 'next/dynamic';

const Buyresultspage = dynamic(() => import('@/component/Buy/Buyresultspage'), { ssr: false });

export default function BuyResultsPage() {
  return (
    <>
      <Head>
        <title>Buy Results | Xoto</title>
        <meta name="description" content="View buy property results on Xoto." />
      </Head>
      <Buyresultspage />
    </>
  );
}
