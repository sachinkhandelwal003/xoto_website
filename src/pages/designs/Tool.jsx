import Head from 'next/head';
import dynamic from 'next/dynamic';

const ToolPage = dynamic(async () => {
  const mod = await import('@/components/AI/Tool/AITool');
  const { DndProvider } = await import('react-dnd');
  const { HTML5Backend } = await import('react-dnd-html5-backend');
  const Wrapped = (props) => (
    <DndProvider backend={HTML5Backend}>
      <mod.default {...props} />
    </DndProvider>
  );
  return { default: Wrapped };
}, { ssr: false });

export default function DesignsToolPage() {
  return (
    <>
      <Head>
        <title>AI Design Tool | Xoto</title>
        <meta name="description" content="AI-powered design tool on Xoto." />
      </Head>
      <ToolPage />
    </>
  );
}
