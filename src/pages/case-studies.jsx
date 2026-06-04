import Head from 'next/head';
import dynamic from 'next/dynamic';

const Casestudy = dynamic(() => import('@/components/homepage/Casestudy'), { ssr: false });

export default function CaseStudiesPage() {
  return (
    <>
      <Head>
        <title>Case Studies | Xoto</title>
        <meta name="description" content="Explore Xoto case studies and success stories." />
      </Head>
      <Casestudy />
    </>
  );
}
