import Head from 'next/head';
import dynamic from 'next/dynamic';

const Social = dynamic(() => import('@/components/social/Index'), { ssr: false });

export default function SocialPage() {
  return (
    <>
      <Head>
        <title>Social | Xoto</title>
        <meta name="description" content="Xoto social community." />
      </Head>
      <Social />
    </>
  );
}
