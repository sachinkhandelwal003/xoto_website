import Head from 'next/head';
import dynamic from 'next/dynamic';

const Quotation = dynamic(() => import('@/components/quotation/Quotation'), { ssr: false });

export default function QuotationPage() {
  return (
    <>
      <Head>
        <title>Quotation | Xoto</title>
        <meta name="description" content="Get a quotation from Xoto." />
      </Head>
      <Quotation />
    </>
  );
}
