import Head from 'next/head';
import dynamic from 'next/dynamic';

const Completeproductview = dynamic(() => import('@/components/Completeproductview'), { ssr: false });

export default function ProjectViewPage() {
  return (
    <>
      <Head>
        <title>Project View | Xoto</title>
        <meta name="description" content="View project details on Xoto." />
      </Head>
      <Completeproductview />
    </>
  );
}
