import Head from 'next/head';
import dynamic from 'next/dynamic';

const HowItWorks = dynamic(() => import('@/components/How-it-works/Index'), { ssr: false });

export default function HowItWorksPage() {
  return (
    <>
      <Head>
        <title>How It Works | Xoto</title>
        <meta name="description" content="Learn how Xoto works." />
      </Head>
      <HowItWorks />
    </>
  );
}
