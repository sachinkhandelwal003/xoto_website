import Head from 'next/head';
import dynamic from 'next/dynamic';

const MortgageCalculator = dynamic(() => import('@/components/homepage/MortgageCalculator'), { ssr: false });

export default function MortgageEmiCalculatorPage() {
  return (
    <>
      <Head>
        <title>EMI Calculator | Xoto</title>
        <meta name="description" content="Calculate your EMI payments with Xoto." />
      </Head>
      <MortgageCalculator initialTab="mortgage" />
    </>
  );
}
