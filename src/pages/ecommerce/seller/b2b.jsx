import Head from 'next/head';
import dynamic from 'next/dynamic';

const Sellerb2b = dynamic(() => import('@/components/ecommerce/B2C/Sellerb2b'), { ssr: false });

export default function SellerB2BPage() {
  return (
    <>
      <Head>
        <title>B2B Seller | Xoto</title>
        <meta name="description" content="B2B seller portal on Xoto." />
      </Head>
      <Sellerb2b />
    </>
  );
}
