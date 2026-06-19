import Head from 'next/head';
import dynamic from 'next/dynamic';

const WaitingApproval = dynamic(() => import('@/components/ecommerce/B2C/WaitingApproval'), { ssr: false });

export default function WaitingApprovalPage() {
  return (
    <>
      <Head>
        <title>Waiting Approval | Xoto</title>
        <meta name="description" content="Your account is pending approval." />
      </Head>
      <WaitingApproval />
    </>
  );
}
