import Head from 'next/head';
import dynamic from 'next/dynamic';

const ReferralPartnerRegister = dynamic(() => import('@/components/GridReferralPartner/ReferralPartnerRegister'), { ssr: false });

export default function ReferralPartnerRegisterPage() {
  return (
    <>
      <Head>
        <title>Referral Partner Register | Xoto</title>
        <meta name="description" content="Register as a referral partner on Xoto." />
      </Head>
      <ReferralPartnerRegister />
    </>
  );
}
