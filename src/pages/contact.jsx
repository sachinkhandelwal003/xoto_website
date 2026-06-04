import Head from 'next/head';
import dynamic from 'next/dynamic';

const Page = dynamic(() => import('@/components/homepage/Page'), { ssr: false });

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact | Xoto</title>
        <meta name="description" content="Get in touch with Xoto team." />
      </Head>
      <Page />
    </>
  );
}
