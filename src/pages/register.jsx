import Head from 'next/head';
import dynamic from 'next/dynamic';

const RegisterNowPage = dynamic(() => import('@/components/RegisterNowPage'), { ssr: false });

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Register | Xoto</title>
        <meta name="description" content="Register on Xoto platform." />
      </Head>
      <RegisterNowPage />
    </>
  );
}
