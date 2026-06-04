import Head from 'next/head';
import dynamic from 'next/dynamic';

const Consult = dynamic(() => import('@/components/consultation/Consult'), { ssr: false });

export default function ConsultationPage() {
  return (
    <>
      <Head>
        <title>Consultation | Xoto</title>
        <meta name="description" content="Book a consultation with Xoto experts." />
      </Head>
      <Consult />
    </>
  );
}
