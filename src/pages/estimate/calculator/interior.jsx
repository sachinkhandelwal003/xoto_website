import Head from 'next/head';
import dynamic from 'next/dynamic';

const InteriorCalculator = dynamic(() => import('@/components/homepage/AiPlanner/InteriorCalculator'), { ssr: false });

export default function InteriorCalculatorPage() {
  return (
    <>
      <Head>
        <title>Interior Calculator | Xoto</title>
        <meta name="description" content="Calculate interior design costs with Xoto." />
      </Head>
      <InteriorCalculator />
    </>
  );
}
