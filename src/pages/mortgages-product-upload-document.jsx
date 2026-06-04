import Head from 'next/head';
import dynamic from 'next/dynamic';

const UploadDocuments = dynamic(() => import('@/components/homepage/UploadDocuments'), { ssr: false });

export default function UploadDocumentPage() {
  return (
    <>
      <Head>
        <title>Upload Documents | Xoto</title>
        <meta name="description" content="Upload documents for your mortgage application." />
      </Head>
      <UploadDocuments />
    </>
  );
}
