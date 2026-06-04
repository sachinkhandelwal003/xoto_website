import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const CmsApp = dynamic(() => import('@/components/CMS/CmsApp'), { ssr: false });

export default function DashboardPage() {
  const { user, token } = useSelector((s) => s.auth || {});
  const router = useRouter();

  useEffect(() => {
    if (!user || !token) {
      router.replace('/login');
    }
  }, [user, token]);

  if (!user || !token) return null;
  return (
    <>
      <Head>
        <title>Dashboard | Xoto</title>
        <meta name="description" content="Xoto dashboard." />
      </Head>
      <CmsApp />
    </>
  );
}