import Head from 'next/head';
import dynamic from 'next/dynamic';

const ProductRequirementsEdit = dynamic(() => import('@/components/homepage/ProductRequirementsEdit'), { ssr: false });

export default function ProductRequirementsEditPage() {
  return (
    <>
      <Head>
        <title>Edit Requirements | Xoto</title>
        <meta name="description" content="Edit your product requirements." />
      </Head>
      <ProductRequirementsEdit />
    </>
  );
}
