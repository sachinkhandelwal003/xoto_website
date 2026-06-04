import Head from 'next/head';
import dynamic from 'next/dynamic';

const MortgageEligibilityCalculatorPage = dynamic(() => import('@/components/homepage/MortgageEligibilityCalculatorPage'), { ssr: false });

export default function EligibilityCalculatorPage() {
  return (
    <>
      <Head>
        <title>Mortgage Eligibility Calculator | Xoto</title>
        <meta name="description" content="Calculate your mortgage eligibility with Xoto." />
      </Head>
      <MortgageEligibilityCalculatorPage />
    </>
  );
}
