import Head from 'next/head';
import dynamic from 'next/dynamic';

const Yniterior = dynamic(() => import('@/components/homepage/Yniterior'), { ssr: false });

export default function InteriorServicesPage() {
  return (
    <>
      <Head>
        <title>Interior Services | Xoto</title>
        <meta name="description" content="Professional interior design services in UAE." />
      </Head>
      <Yniterior />
    </>
  );
}
