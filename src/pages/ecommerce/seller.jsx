import Head from 'next/head';
import dynamic from 'next/dynamic';

const SellerPage = dynamic(() => import('@/components/ecommerce/B2C/SellerPage'), { ssr: false });

export default function SellerPageRoute() {
  return (
    <>
      <Head>
        <title>Seller | Xoto</title>
        <meta name="description" content="Sell on Xoto ecommerce platform." />
      </Head>
      <SellerPage />
    </>
  );
}
