import Head from 'next/head';
import dynamic from 'next/dynamic';

const CustomerLogin = dynamic(() => import('@/components/login/CustomerLogin'), { ssr: false });

export default function UserLoginPage() {
  return (
    <>
      <Head>
        <title>User Login | Xoto</title>
        <meta name="description" content="User sign in to Xoto." />
      </Head>
      <CustomerLogin />
    </>
  );
}
