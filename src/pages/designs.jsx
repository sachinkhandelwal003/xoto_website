import Head from 'next/head';
import dynamic from 'next/dynamic';

const Designs = dynamic(() => import('@/components/AI/Designs'), { ssr: false });

export default function DesignsPage() {
  return (
    <>
      <Head>
        <title>Designs | Xoto</title>
        <meta name="description" content="Explore AI-powered design tools on Xoto." />
      </Head>
      <Designs />
    </>
  );
}
