import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import i18n from '../i18n';
import '../components/CMS/styles/cms-tailwind.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import { useRouter } from 'next/router';
import Script from 'next/script';
import Head from 'next/head';

import { store } from '../manageApi/store/store.jsx';
import { rehydrateAuthState } from '../manageApi/store/authSlice.jsx';
import { AuthProvider } from '../manageApi/context/AuthContext';
import PersistLogin from '../manageApi/context/PersistLogin';
import { FreelancerProvider } from '../context/FreelancerContext';

import { BlogProvider } from '../context/BlogContext';
import { ProductProvider } from '../context/ProductContext';
import { AuthProvider as ProfileAuthProvider } from '../context/ProfileContext';
import { CmsProvider } from '../components/CMS/contexts/CmsContext';
import AppLayout from '../components/AppLayout';

const SafeBrowserRouter = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  const path = window.location.pathname;
  const isDashboard = path.startsWith('/dashboard');

  if (isDashboard) {
    return (
      <BrowserRouter>
        {children}
      </BrowserRouter>
    );
  }

  return <>{children}</>;
};

import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 5 * 60 * 1000 },
    mutations: { retry: 1 },
  },
});

export default function App({ Component, pageProps }) {
  useEffect(() => {
    store.dispatch(rehydrateAuthState());

    // Perform client-side language detection after hydration completes
    if (typeof window !== 'undefined') {
      try {
        const storedLang = localStorage.getItem('i18nextLng');
        const browserLang = (window.navigator.language || window.navigator.userLanguage || 'en').split('-')[0];
        const detectedLang = storedLang || browserLang || 'en';
        if (i18n && i18n.language !== detectedLang) {
          i18n.changeLanguage(detectedLang);
        }
      } catch (err) {
        console.error('Failed to restore language client-side:', err);
      }
    }
  }, []);

  return (
    <Provider store={store}>
      <Head>
        <title>Xoto</title>
        <meta name="application-name" content="Xoto" />
        <meta name="description" content="Xoto is UAE's premier platform for real estate, mortgage services, interior design, landscaping, and AI-powered property tools." />
        <meta property="og:site_name" content="Xoto" />
      </Head>
      {/* Google tag (gtag.js) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-7CWRVTXE0J"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-7CWRVTXE0J');
        `}
      </Script>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PersistLogin>
            <SafeBrowserRouter>
              <ProfileAuthProvider>
                <CmsProvider>
                  <BlogProvider>
                    <FreelancerProvider>
                      <ProductProvider>
                        <div className={`${dmSans.variable} font-sans`}>
                          <AppLayout>
                            <Component {...pageProps} />
                          </AppLayout>
                        </div>
                        <ToastContainer position="top-right" autoClose={3000} />
                      </ProductProvider>
                    </FreelancerProvider>
                  </BlogProvider>
                </CmsProvider>
              </ProfileAuthProvider>
            </SafeBrowserRouter>
          </PersistLogin>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}
