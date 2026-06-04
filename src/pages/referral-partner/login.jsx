import Head from 'next/head';
import dynamic from 'next/dynamic';

const ReferralPartnerLogin = dynamic(() => import('@/components/GridReferralPartner/ReferralPartnerLogin'), { ssr: false });

export default function ReferralPartnerLoginPage() {
  return (
    <>
      <Head>
        <title>Referral Partner Login | Xoto</title>
        <meta name="description" content="Referral partner sign in to Xoto." />
      </Head>
      <ReferralPartnerLogin />
    </>
  );
}
