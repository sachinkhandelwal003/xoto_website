import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Navbar from './navbar/index.jsx';
import Footer from './footer/footer';
import ScrollToTop from './ScrollToTop.js';
import FreelancerNavbar from './navbar/FreelancerNavbar.jsx';
import dynamic from 'next/dynamic';

const PopupManager = dynamic(() => import('./homepage/PopupManager'), { ssr: false });
const XobiaChatbot = dynamic(() => import('./homepage/XobiaChatbot'), { ssr: false });

const hideNavbarPaths = [
  '/login',
  '/quotation',
  '/freelancer/browse-category',
  '/freelancer/category',
  '/freelancer/free-listing',
  '/freelancer/create-business',
  '/designs/Tool',
  '/dashboard',
  '/customer/dashboard',
  '/admin/login',
  '/user/login',
  '/other/login',
  '/aiPlanner',
  '/aiPlanner/interior',
  '/proposal/view/link',
  '/aiPlanner/landscape',
  '/estimate/calculator',
  '/accountant/login',
  '/seller/registration',
  '/aiPlanner/enhance',
  '/aiPlanner/sky',
  '/aiPlanner/virtual',
];

const hideFooterPaths = [
  '/login',
  '/quotation',
  '/designs/Tool',
  '/dashboard',
  '/customer/dashboard',
  '/profile',
  '/admin/login',
  '/user/login',
  '/other/login',
  '/aiPlanner',
  '/aiPlanner/interior',
  '/aiPlanner/landscape',
  '/estimate/calculator',
  '/accountant/login',
  '/seller/registration',
  '/freelancer/registration',
  '/aiPlanner/enhance',
  '/aiPlanner/sky',
  '/aiPlanner/virtual',
];

const allowedChatbotPaths = [
  '/',
  '/mortgage/services',
  '/properties',
  '/services/interior',
  '/landscaping',
  '/ecommerce/b2c',
  '/Blogs',
  '/case-studies',
  '/training',
  '/ecosystem',
  '/aiPlanner',
  '/Property',
  '/ecommerce',
  '/about',
  '/contact',
  '/consultation',
  '/estimate/calculator/interior',
];

const freelancerNavbarPaths = [
  '/freelancer/browse-category',
  '/freelancer/free-listing',
  '/freelancer/category',
  '/freelancer/create-business',
];

export default function AppLayout({ children }) {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(window.location.pathname);

    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);

    const interval = setInterval(() => {
      if (window.location.pathname !== currentPath) {
        setCurrentPath(window.location.pathname);
      }
    }, 200);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
      clearInterval(interval);
    };
  }, [currentPath, router.events]);

  const pathname = (currentPath || router.asPath).split('?')[0].split('#')[0];
  const { user, token } = useSelector((s) => s.auth || {});

  const [loadChatbot, setLoadChatbot] = useState(false);

  useEffect(() => {
    // Delay chatbot load by 4.5 seconds to bypass initial critical rendering path
    const timer = setTimeout(() => {
      setLoadChatbot(true);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  const isDashboard = pathname.startsWith('/dashboard');

  const hideNavbar =
    hideNavbarPaths.some((p) => pathname === p || pathname.startsWith(p + '/')) ||
    (isDashboard && !user);

  const hideFooter = hideFooterPaths.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );

  const hidePopup =
    isDashboard ||
    pathname.includes('login') ||
    pathname.includes('register') ||
    pathname.startsWith('/proposal/view/link') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/seller/registration') ||
    pathname.startsWith('/freelancer/registration');

  const showFreelancerNavbar = freelancerNavbarPaths.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );

  const showChatbot = allowedChatbotPaths.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );

  return (
    <>
      <ScrollToTop />
      {!hideNavbar && <Navbar />}
      {showFreelancerNavbar && <FreelancerNavbar />}
      {!hidePopup && <PopupManager />}
      {children}
      {!hideFooter && <Footer />}
      {showChatbot && loadChatbot && <XobiaChatbot />}
    </>
  );
}
