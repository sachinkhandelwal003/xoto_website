import Head from 'next/head';
import dynamic from 'next/dynamic';

const OtherLogin = dynamic(() => import('@/components/login/OtherLogin'), { ssr: false });

export default function OtherLoginPage() {
  return (
    <>
      <Head>
        <title>Login | Xoto</title>
        <meta name="description" content="Sign in to your Xoto account." />
      </Head>
      <OtherLogin />
    </>
  );
}
