import Head from 'next/head';
import dynamic from 'next/dynamic';

const PaymentSuccess = dynamic(() => import('@/components/ecommerce/B2C/products/PaymentSuccess'), { ssr: false });

export default function PaymentSuccessPage() {
  return (
    <>
      <Head>
        <title>Payment Success | Xoto</title>
        <meta name="description" content="Your payment was successful." />
      </Head>
      <PaymentSuccess />
    </>
  );
}
