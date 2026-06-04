import Head from 'next/head';
import dynamic from 'next/dynamic';

const Interior = dynamic(() => import('@/components/homepage/Interior/Interior'), { ssr: false });

export default function AIInteriorPage() {
  return (
    <>
      <Head>
        <title>AI Interior | Xoto</title>
        <meta name="description" content="AI-powered interior design on Xoto." />
      </Head>
      <Interior />
    </>
  );
}
