import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import DashboardLoader from '@/components/CMS/components/layout/DashboardLoader';

const CmsApp = dynamic(() => import('@/components/CMS/CmsApp'), {
  ssr: false,
  loading: () => <DashboardLoader />
});

export default function SuperAdminDashboardPage() {
  const { user, token, rehydrated } = useSelector((s) => s.auth || {});
  const router = useRouter();

  useEffect(() => {
    if (!rehydrated) return;

    if (!user || !token) {
      router.replace('/login');
      return;
    }

    const roleCode = user?.role?.code?.toString() || user?.role?.toString();
    if (roleCode !== '0') {
      router.replace('/login');
    }
  }, [user, token, rehydrated, router]);

  if (!rehydrated) {
    return <DashboardLoader />;
  }

  if (!user || !token) return null;

  const roleCode = user?.role?.code?.toString() || user?.role?.toString();
  if (roleCode !== '0') return null;

  return (
    <>
      <Head>
        <title>SuperAdmin Dashboard | Xoto</title>
        <meta name="description" content="Xoto SuperAdmin dashboard." />
      </Head>
      <CmsApp />
    </>
  );
}
