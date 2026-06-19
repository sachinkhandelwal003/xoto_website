import Head from 'next/head';
import dynamic from 'next/dynamic';

const ProductFilterPage = dynamic(() => import('@/components/ecommerce/ProductFilterPage'), { ssr: false });

export default function FilterProductsPage() {
  return (
    <>
      <Head>
        <title>Filter Products | Xoto</title>
        <meta name="description" content="Filter and search products on Xoto." />
      </Head>
      <ProductFilterPage />
    </>
  );
}
