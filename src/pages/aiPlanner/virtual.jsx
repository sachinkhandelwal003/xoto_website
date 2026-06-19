import Head from 'next/head';
import dynamic from 'next/dynamic';

const VirtualStaging = dynamic(() => import('@/components/homepage/AiPlanner/Virtualstaggig'), { ssr: false });

export default function VirtualStagingPage() {
  return (
    <>
      <Head>
        <title>Virtual Staging | Xoto</title>
        <meta name="description" content="AI virtual staging for your property." />
      </Head>
      <VirtualStaging />
    </>
  );
}
