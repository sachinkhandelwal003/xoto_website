import Head from 'next/head';
import dynamic from 'next/dynamic';

const AIPlannerDemoPage = dynamic(() => import('@/components/homepage/AiPlanner/AIPlannerDemoPage'), { ssr: false });

export default function AIPlannerDemo() {
  return (
    <>
      <Head>
        <title>AI Planner Demo | Xoto</title>
        <meta name="description" content="Try the AI Planner demo." />
      </Head>
      <AIPlannerDemoPage />
    </>
  );
}
