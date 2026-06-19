import Head from 'next/head';
import dynamic from 'next/dynamic';

// Dynamically import the talking avatar component with SSR disabled
const TestAvatar = dynamic(() => import('@/components/TestAvatar'), { ssr: false });

export default function TestPage() {
  return (
    <>
      <Head>
        <title>Xoto Talking Avatar Test</title>
        <meta name="description" content="Interact with the 3D Xoto AI property consultant avatar in real-time." />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div style={{ backgroundColor: '#090514', minHeight: '100vh', paddingTop: '80px' }}>
        <TestAvatar />
      </div>
    </>
  );
}
