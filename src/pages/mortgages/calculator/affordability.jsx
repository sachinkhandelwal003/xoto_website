import Head from 'next/head';
import dynamic from 'next/dynamic';

const MortgageAffordabilityCalculatorPage = dynamic(() => import('@/components/homepage/MortgageAffordabilityCalculatorPage'), { ssr: false });

export default function AffordabilityCalculatorPage() {
  return (
    <>
      <Head>
        <title>Mortgage Affordability Calculator | Xoto</title>
        <meta name="description" content="Calculate your mortgage affordability with Xoto." />
      </Head>
      <MortgageAffordabilityCalculatorPage />
    </>
  );
}
