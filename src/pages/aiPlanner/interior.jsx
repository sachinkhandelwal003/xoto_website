import Head from 'next/head';
import dynamic from 'next/dynamic';

const InteriorPlanner = dynamic(() => import('@/components/homepage/AiPlanner/InteriorPlanner'), { ssr: false });

export default function InteriorPlannerPage() {
  return (
    <>
      <Head>
        <title>Interior Planner | Xoto</title>
        <meta name="description" content="AI-powered interior planning tool." />
      </Head>
      <InteriorPlanner />
    </>
  );
}
