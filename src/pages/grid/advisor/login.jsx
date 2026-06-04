import Head from 'next/head';
import dynamic from 'next/dynamic';

const AdvisorLogin = dynamic(() => import('@/components/Grid/AdvisorGrid/AdvisorLogin'), { ssr: false });

export default function AdvisorLoginPage() {
  return (
    <>
      <Head>
        <title>Advisor Login | Xoto</title>
        <meta name="description" content="Advisor sign in to Xoto Grid." />
      </Head>
      <AdvisorLogin />
    </>
  );
}
