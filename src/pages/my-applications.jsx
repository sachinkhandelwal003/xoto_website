import Head from 'next/head';
import dynamic from 'next/dynamic';

const MyApplications = dynamic(() => import('@/components/homepage/MyApplications'), { ssr: false });

export default function MyApplicationsPage() {
  return (
    <>
      <Head>
        <title>My Applications | Xoto</title>
        <meta name="description" content="View and manage your mortgage applications." />
      </Head>
      <MyApplications />
    </>
  );
}
