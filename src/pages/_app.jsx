import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import '../i18n';
import '../components/CMS/styles/cms-tailwind.css';

import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import { useRouter } from 'next/router';
import Script from 'next/script';

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
  const router = useRouter();

  const pathname = router.asPath ? router.asPath.split('?')[0].split('#')[0] : '';
  let basename = '';
  if (pathname.startsWith('/dashboard/')) {
    const parts = pathname.split('/');
    if (parts[2]) {
      basename = `/dashboard/${parts[2]}`;
    }
  }

  useEffect(() => {
    store.dispatch(rehydrateAuthState());
  }, []);

  return (
    <Provider store={store}>
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
            <BrowserRouter key={basename} basename={basename || undefined}>
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
            </BrowserRouter>
          </PersistLogin>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}
