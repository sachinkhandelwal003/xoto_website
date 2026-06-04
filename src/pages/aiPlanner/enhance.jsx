import Head from 'next/head';
import dynamic from 'next/dynamic';

const ImageEnhancer = dynamic(() => import('@/components/homepage/AiPlanner/ImageEnhancer'), { ssr: false });

export default function ImageEnhancerPage() {
  return (
    <>
      <Head>
        <title>Image Enhancer | Xoto</title>
        <meta name="description" content="Enhance your property images with AI." />
      </Head>
      <ImageEnhancer />
    </>
  );
}
