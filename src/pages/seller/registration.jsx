import Head from 'next/head';
import dynamic from 'next/dynamic';

const SellerPage = dynamic(() => import('@/components/ecommerce/B2C/SellerPage'), { ssr: false });

export default function SellerRegistrationPage() {
  return (
    <>
      <Head>
        <title>Vendor Registration | Xoto</title>
        <meta name="description" content="Register as a vendor on Xoto ecommerce platform." />
      </Head>
      <SellerPage />
    </>
  );
}
