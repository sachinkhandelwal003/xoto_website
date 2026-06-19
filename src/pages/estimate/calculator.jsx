import Head from 'next/head';
import dynamic from 'next/dynamic';

const Calculator = dynamic(() => import('@/components/homepage/AiPlanner/Calculator'), { ssr: false });

export default function EstimateCalculatorPage() {
  return (
    <>
      <Head>
        <title>Estimate Calculator | Xoto</title>
        <meta name="description" content="Estimate your project cost with Xoto calculator." />
      </Head>
      <Calculator />
    </>
  );
}
