import Head from 'next/head';
import dynamic from 'next/dynamic';

const VaultRegister = dynamic(() => import('@/components/ecommerce/B2C/VaultRegister'), { ssr: false });

export default function VaultRegisterPage() {
  return (
    <>
      <Head>
        <title>Vault Register | Xoto</title>
        <meta name="description" content="Register for Xoto Vault." />
      </Head>
      <VaultRegister />
    </>
  );
}
