import Head from 'next/head';
import dynamic from 'next/dynamic';

const ForgotPassword = dynamic(() => import('@/components/CMS/pages/forgot-password'), { ssr: false });

export default function ForgotPasswordPage() {
  return (
    <>
      <Head>
        <title>Forgot Password | Xoto</title>
        <meta name="description" content="Reset your Xoto password." />
      </Head>
      <ForgotPassword />
    </>
  );
}
