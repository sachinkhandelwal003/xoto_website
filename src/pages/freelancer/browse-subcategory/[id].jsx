import Head from 'next/head';
import dynamic from 'next/dynamic';

const Browsecategory = dynamic(() => import('@/components/freelancers/Browsecategory'), { ssr: false });

export default function BrowseCategoryPage() {
  return (
    <>
      <Head>
        <title>Browse Category | Xoto</title>
        <meta name="description" content="Browse freelancer categories on Xoto." />
      </Head>
      <Browsecategory />
    </>
  );
}