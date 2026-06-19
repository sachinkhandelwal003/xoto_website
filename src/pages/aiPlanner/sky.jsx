import Head from 'next/head';
import dynamic from 'next/dynamic';

const SkyReplacement = dynamic(() => import('@/components/homepage/AiPlanner/SkyReplacement'), { ssr: false });

export default function SkyReplacementPage() {
  return (
    <>
      <Head>
        <title>Sky Replacement | Xoto</title>
        <meta name="description" content="AI-powered sky replacement for property images." />
      </Head>
      <SkyReplacement />
    </>
  );
}
