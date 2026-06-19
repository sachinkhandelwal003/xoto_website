import Head from 'next/head';
import dynamic from 'next/dynamic';

const Ai = dynamic(() => import('@/components/AII/Ai'), { ssr: false });

export default function BlogPage() {
  return (
    <>
      <Head>
        <title>Blog | Xoto</title>
        <meta name="description" content="Read the latest from Xoto blog." />
      </Head>
      <Ai />
    </>
  );
}
