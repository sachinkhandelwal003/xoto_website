import Head from 'next/head';
import dynamic from 'next/dynamic';

const Herobuy = dynamic(() => import('@/component/Buy/Herobuy'), { ssr: false });

export default function BuySearchPage() {
  return (
    <>
      <Head>
        <title>Buy Search | Xoto</title>
        <meta name="description" content="Search properties to buy in UAE on Xoto." />
      </Head>
      <Herobuy />
    </>
  );
}
