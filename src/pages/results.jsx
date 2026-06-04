import Head from 'next/head';
import dynamic from 'next/dynamic';

const ResultsPage = dynamic(() => import('@/component/Rent/ResultsPage'), { ssr: false });

export default function ResultsPageRoute() {
  return (
    <>
      <Head>
        <title>Results | Xoto</title>
        <meta name="description" content="View property search results on Xoto." />
      </Head>
      <ResultsPage />
    </>
  );
}
