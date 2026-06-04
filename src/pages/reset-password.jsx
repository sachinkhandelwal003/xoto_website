import Head from 'next/head';
import dynamic from 'next/dynamic';

const ResetPassword = dynamic(() => import('@/components/CMS/pages/reset-password'), { ssr: false });

export default function ResetPasswordPage() {
  return (
    <>
      <Head>
        <title>Reset Password | Xoto</title>
        <meta name="description" content="Set a new password for your Xoto account." />
      </Head>
      <ResetPassword />
    </>
  );
}
