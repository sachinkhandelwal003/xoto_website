import Head from 'next/head';
import dynamic from 'next/dynamic';

const RegistrationAgency = dynamic(() => import('@/components/ecommerce/B2C/RegistrationAgency'), { ssr: false });

export default function AgencyRegistrationPage() {
  return (
    <>
      <Head>
        <title>Agency Registration | Xoto</title>
        <meta name="description" content="Register your agency on Xoto." />
      </Head>
      <RegistrationAgency />
    </>
  );
}
