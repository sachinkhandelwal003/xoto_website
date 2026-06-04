import Head from 'next/head';
import dynamic from 'next/dynamic';

const ProposalLink = dynamic(() => import('@/components/ecommerce/vault/proposal/ProposalLink'), { ssr: false });

export default function ProposalLinkPage() {
  return (
    <>
      <Head>
        <title>Proposal | Xoto</title>
        <meta name="description" content="View your Xoto proposal." />
      </Head>
      <ProposalLink />
    </>
  );
}