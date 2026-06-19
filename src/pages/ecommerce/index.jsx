import Head from 'next/head';
import dynamic from 'next/dynamic';

const EcommerceIndex = dynamic(() => import('@/components/ecommerce/Index'), { ssr: false });

export default function EcommercePage() {
  return (
    <>
      <Head>
        <title>Ecommerce | Xoto</title>
        <meta name="description" content="Shop on Xoto ecommerce platform." />
      </Head>
      <EcommerceIndex />
    </>
  );
}
