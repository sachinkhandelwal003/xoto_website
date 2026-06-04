import Head from 'next/head';
import dynamic from 'next/dynamic';

const Registeration = dynamic(() => import('@/components/freelancers/Registeration'), { ssr: false });

export default function FreelancerRegistrationPage() {
  return (
    <>
      <Head>
        <title>Freelancer Registration | Xoto</title>
        <meta name="description" content="Register as a freelancer on Xoto." />
      </Head>
      <Registeration />
    </>
  );
}
