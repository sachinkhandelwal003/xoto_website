import Head from 'next/head';
import Ai1 from '@/components/AII/Ai1';
import Ai2 from '@/components/AII/Ai2';
import Ai3 from '@/components/AII/Ai3';

export default function BlogPostPage({ blog, slug }) {
  const currentUrl = `https://xoto.ae/blog/${slug}`;
  const pageTitle = `${blog.title} | Xoto Blog`;
  const pageDesc = blog.subHeading || blog.excerpt || "Read this article on Xoto.";
  
  let pageImage = blog.featuredImage || blog.coverImage || "https://xoto.ae/logoNew.png";
  if (pageImage && !pageImage.startsWith('http://') && !pageImage.startsWith('https://')) {
    const separator = pageImage.startsWith('/') ? '' : '/';
    pageImage = `https://xotobackend.kotiboxglobaltech.site${separator}${pageImage}`;
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={pageImage} />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={currentUrl} />
        <meta property="twitter:title" content={blog.title} />
        <meta property="twitter:description" content={pageDesc} />
        <meta property="twitter:image" content={pageImage} />
      </Head>
      <div className="w-full animate-fadeIn relative">
        <Ai1 blog={blog} />
        <Ai2 blog={blog} />
        <Ai3 blog={blog} />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { slug } = context.params;
  try {
    const res = await fetch('https://xotobackend.kotiboxglobaltech.site/blogs/get-all-blogs?isPublished=true&limit=100');
    const result = await res.json();
    
    let blogs = [];
    if (Array.isArray(result)) blogs = result;
    else if (result?.data && Array.isArray(result.data)) blogs = result.data;
    else if (result?.data?.data && Array.isArray(result.data.data)) blogs = result.data.data;
    else if (result?.blogs && Array.isArray(result.blogs)) blogs = result.blogs;
    
    const summaryBlog = blogs.find((b) => b.slug === slug);

    if (!summaryBlog) {
      return {
        notFound: true,
      };
    }

    const blogId = summaryBlog._id || summaryBlog.id;
    const detailRes = await fetch(`https://xotobackend.kotiboxglobaltech.site/blogs/get-blog-by-id?id=${blogId}`);
    const detailResult = await detailRes.json();

    const blog = detailResult.data || detailResult.blog || detailResult;

    if (!blog) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        blog,
        slug,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      notFound: true,
    };
  }
}
