import Head from 'next/head';
import dynamic from 'next/dynamic';

const PrivacyPolicy = dynamic(() => import('@/components/homepage/PrivacyPolicy'), { ssr: false });

export default function PrivacyPolicyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Xoto</title>
        <meta name="description" content="Read Xoto privacy policy." />
      </Head>
      <PrivacyPolicy />
    </>
  );
}
