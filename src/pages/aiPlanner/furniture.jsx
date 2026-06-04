import Head from 'next/head';
import dynamic from 'next/dynamic';

const ComingSoon = dynamic(() => import('@/components/homepage/AiPlanner/ComingSoon'), { ssr: false });

export default function FurniturePage() {
  return (
    <>
      <Head>
        <title>Coming Soon | Xoto</title>
        <meta name="description" content="AI furniture planning - coming soon." />
      </Head>
      <ComingSoon />
    </>
  );
}
