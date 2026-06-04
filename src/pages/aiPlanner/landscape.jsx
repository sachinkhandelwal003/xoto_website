import Head from 'next/head';
import dynamic from 'next/dynamic';

const AIPlanner = dynamic(() => import('@/components/homepage/AiPlanner/AIPlanner'), { ssr: false });

export default function AILandscapePage() {
  return (
    <>
      <Head>
        <title>AI Landscape | Xoto</title>
        <meta name="description" content="AI landscape planning tool." />
      </Head>
      <AIPlanner />
    </>
  );
}
