import Head from 'next/head';
import dynamic from 'next/dynamic';

const DeveloperRegistration = dynamic(() => import('@/components/ecommerce/B2C/DeveloperRegistration'), { ssr: false });

export default function DeveloperRegistrationPage() {
  return (
    <>
      <Head>
        <title>Developer Registration | Xoto</title>
        <meta name="description" content="Register as a developer on Xoto." />
      </Head>
      <DeveloperRegistration />
    </>
  );
}
