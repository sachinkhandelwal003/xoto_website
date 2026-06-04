import Head from 'next/head';
import dynamic from 'next/dynamic';

const AdminLogin = dynamic(() => import('@/components/login/AdminLogin'), { ssr: false });

export default function AdminLoginPage() {
  return (
    <>
      <Head>
        <title>Admin Login | Xoto</title>
        <meta name="description" content="Admin sign in to Xoto." />
      </Head>
      <AdminLogin />
    </>
  );
}
