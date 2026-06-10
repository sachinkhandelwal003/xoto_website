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

const roleSlugMap = {
  0: "superadmin",
  1: "admin",
  2: "customer",
  5: "vendor-b2c",
  6: "vendor-b2b",
  7: "freelancer",
  11: "accountant",
  12: "supervisor",
  15: "agency",
  16: "agent",
  17: "developer",
  18: "vault-admin",
  22: "vaultagent",
  26: "vault-advisor",
  23: "vault-ops",
  25: "gridreferralpartner",
  21: "vaultpartner",
  24: "GridAdvisor"
};

export default function DashboardPage() {
  const { user, token, rehydrated } = useSelector((s) => s.auth || {});
  const router = useRouter();

  useEffect(() => {
    if (!rehydrated) return;

    if (!user || !token) {
      router.replace('/login');
      return;
    }

    const roleCode = user?.role?.code?.toString() || user?.role?.toString();
    const userRoleSlug = roleSlugMap[roleCode] || 'dashboard';
    
    if (router.query.roleSlug && router.query.roleSlug !== userRoleSlug) {
      router.replace(`/dashboard/${userRoleSlug}`);
    }
  }, [user, token, rehydrated, router.query.roleSlug]);

  if (!rehydrated) {
    return <DashboardLoader />;
  }

  if (!user || !token) return null;

  const roleCode = user?.role?.code?.toString() || user?.role?.toString();
  const userRoleSlug = roleSlugMap[roleCode] || 'dashboard';
  if (router.query.roleSlug && router.query.roleSlug !== userRoleSlug) return null;

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
