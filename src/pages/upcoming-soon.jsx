import Head from 'next/head';
import dynamic from 'next/dynamic';

const Upcoming = dynamic(() => import('@/components/footer/Upcoming'), { ssr: false });

export default function UpcomingSoonPage() {
  return (
    <>
      <Head>
        <title>Coming Soon | Xoto</title>
        <meta name="description" content="Coming soon on Xoto." />
      </Head>
      <Upcoming />
    </>
  );
}
