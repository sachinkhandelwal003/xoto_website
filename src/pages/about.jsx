import Head from 'next/head';
import dynamic from 'next/dynamic';

const About = dynamic(() => import('@/components/homepage/About'), { ssr: false });

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Xoto</title>
        <meta name="description" content="Learn more about Xoto - UAE's premier real estate platform." />
      </Head>
      <About />
    </>
  );
}
