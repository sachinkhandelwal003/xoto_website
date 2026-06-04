import Head from 'next/head';
import dynamic from 'next/dynamic';

const AgentRegistration = dynamic(() => import('@/components/ecommerce/B2C/AgentRegistration'), { ssr: false });

export default function AgentRegistrationPage() {
  return (
    <>
      <Head>
        <title>Agent Registration | Xoto</title>
        <meta name="description" content="Register as an agent on Xoto." />
      </Head>
      <AgentRegistration />
    </>
  );
}
