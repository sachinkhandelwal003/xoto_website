import Head from 'next/head';
import dynamic from 'next/dynamic';

const Productdetails = dynamic(() => import('@/components/ecommerce/Productdetails'), { ssr: false });

export default function ProductDetailPage() {
  return (
    <>
      <Head>
        <title>Product | Xoto</title>
        <meta name="description" content="View product details on Xoto." />
      </Head>
      <Productdetails />
    </>
  );
}