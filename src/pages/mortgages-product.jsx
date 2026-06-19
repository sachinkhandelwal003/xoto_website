import Head from 'next/head';
import dynamic from 'next/dynamic';

const MortgagesProduct = dynamic(() => import('@/components/homepage/MortgagesProduct'), { ssr: false });

export default function MortgagesProductPage() {
  return (
    <>
      <Head>
        <title>Mortgage Products | Xoto</title>
        <meta name="description" content="Browse mortgage products available in UAE." />
      </Head>
      <MortgagesProduct />
    </>
  );
}
