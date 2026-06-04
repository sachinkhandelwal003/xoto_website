import Head from 'next/head';
import dynamic from 'next/dynamic';

const MortgageCalculator = dynamic(() => import('@/components/homepage/MortgageCalculator'), { ssr: false });

export default function MortgageCalculatorPage() {
  return (
    <>
      <Head>
        <title>Mortgage Calculator | Xoto</title>
        <meta name="description" content="Calculate your mortgage payments with Xoto." />
      </Head>
      <MortgageCalculator />
    </>
  );
}
