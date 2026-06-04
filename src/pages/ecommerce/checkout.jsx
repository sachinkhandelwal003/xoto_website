import Head from 'next/head';
import dynamic from 'next/dynamic';

const CheckoutPage = dynamic(() => import('@/components/ecommerce/B2C/products/CheckoutPage'), { ssr: false });

export default function CheckoutPageRoute() {
  return (
    <>
      <Head>
        <title>Checkout | Xoto</title>
        <meta name="description" content="Complete your purchase on Xoto." />
      </Head>
      <CheckoutPage />
    </>
  );
}
