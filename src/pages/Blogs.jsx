import Head from 'next/head';
import dynamic from 'next/dynamic';

const Page3 = dynamic(() => import('@/components/homepage/Page3'), { ssr: false });

export default function BlogsPage() {
  return (
    <>
      <Head>
        <title>Blogs | Xoto</title>
        <meta name="description" content="Read the latest Xoto blogs." />
      </Head>
      <Page3 />
    </>
  );
}
