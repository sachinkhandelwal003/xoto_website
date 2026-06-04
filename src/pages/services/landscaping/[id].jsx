import Head from 'next/head';
import dynamic from 'next/dynamic';

const Category = dynamic(() => import('@/components/freelancers/Category'), { ssr: false });

export default function LandscapingCategoryPage() {
  return (
    <>
      <Head>
        <title>Landscaping | Xoto</title>
        <meta name="description" content="Landscaping services category on Xoto." />
      </Head>
      <Category />
    </>
  );
}