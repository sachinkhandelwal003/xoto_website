import Head from 'next/head';
import dynamic from 'next/dynamic';

const EmployeeLogin = dynamic(() => import('@/components/ecommerce/vault/EmployeeLogin'), { ssr: false });

export default function VaultLoginPage() {
  return (
    <>
      <Head>
        <title>Vault Login | Xoto</title>
        <meta name="description" content="Vault employee login on Xoto." />
      </Head>
      <EmployeeLogin />
    </>
  );
}
