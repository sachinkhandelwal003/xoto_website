import Head from 'next/head';
import dynamic from 'next/dynamic';

const Trainning = dynamic(() => import('@/components/homepage/Trainning'), { ssr: false });

export default function TrainingPage() {
  return (
    <>
      <Head>
        <title>Training | Xoto</title>
        <meta name="description" content="Professional training programs offered by Xoto." />
      </Head>
      <Trainning />
    </>
  );
}
