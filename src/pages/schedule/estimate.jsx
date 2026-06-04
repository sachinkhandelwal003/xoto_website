import Head from 'next/head';
import dynamic from 'next/dynamic';

const MainCalculatorPage = dynamic(() => import('@/components/homepage/AiPlanner/MainCalculatorPage'), { ssr: false });

export default function ScheduleEstimatePage() {
  return (
    <>
      <Head>
        <title>Schedule Estimate | Xoto</title>
        <meta name="description" content="Schedule an estimate with Xoto." />
      </Head>
      <MainCalculatorPage />
    </>
  );
}
