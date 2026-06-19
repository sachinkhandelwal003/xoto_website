import Head from 'next/head';
import dynamic from 'next/dynamic';

const Login = dynamic(() => import('@/components/login/index.jsx'), { ssr: false });

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login | Xoto</title>
        <meta name="description" content="Sign in to your Xoto account." />
      </Head>
      <Login />
    </>
  );
}
