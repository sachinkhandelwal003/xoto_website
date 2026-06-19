import Head from 'next/head';
import dynamic from 'next/dynamic';

const AITools = dynamic(() => import('@/components/homepage/AiPlanner/AITools'), { ssr: false });

export default function AIPlannerPage() {
  return (
    <>
      <Head>
        <title>AI Planner | Xoto</title>
        <meta name="description" content="AI-powered planning tools for interior, landscape and more." />
      </Head>
      <AITools />
    </>
  );
}
