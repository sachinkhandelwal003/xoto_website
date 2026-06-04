import Head from 'next/head';
import dynamic from 'next/dynamic';

const CartPage = dynamic(() => import('@/components/ecommerce/B2C/products/CartPage'), { ssr: false });

export default function CartPageRoute() {
  return (
    <>
      <Head>
        <title>Cart | Xoto</title>
        <meta name="description" content="Your shopping cart on Xoto." />
      </Head>
      <CartPage />
    </>
  );
}
