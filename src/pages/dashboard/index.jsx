import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

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

export default function DashboardRootPage() {
  const { user, token, rehydrated } = useSelector((s) => s.auth || {});
  const router = useRouter();

  useEffect(() => {
    if (!rehydrated) return;

    if (!user || !token) {
      router.replace('/login');
      return;
    }

    const roleCode = user?.role?.code?.toString() || user?.role?.toString();
    const userRoleSlug = roleSlugMap[roleCode] || 'superadmin';
    router.replace(`/dashboard/${userRoleSlug}`);
  }, [user, token, rehydrated, router]);

  if (!rehydrated) {
  return null;
}

  return null;
}
