import Head from 'next/head';
import dynamic from 'next/dynamic';

const HeroRent = dynamic(() => import('@/component/Rent/HeroRent'), { ssr: false });

export default function RentSearchPage() {
  return (
    <>
      <Head>
        <title>Rent Search | Xoto</title>
        <meta name="description" content="Search rental properties in UAE on Xoto." />
      </Head>
      <HeroRent />
    </>
  );
}
