'use client';
/**
 * react-router-dom → Next.js Pages Router compatibility shim.
 * Webpack aliases all "react-router-dom" imports here.
 * Zero changes needed in existing components.
 */

import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

// ─── Link ────────────────────────────────────────────────────────────────────
export function Link({ to, href, children, className, style, onClick, replace: replaceFlag, ...rest }) {
  const destination = to || href || '/';
  return (
    <NextLink href={destination} replace={replaceFlag} className={className} style={style} onClick={onClick} {...rest}>
      {children}
    </NextLink>
  );
}

// ─── NavLink ─────────────────────────────────────────────────────────────────
export function NavLink({ to, href, children, className, activeClassName, style, ...rest }) {
  const router = useRouter();
  const destination = to || href || '/';
  const isActive = router.pathname === destination || router.asPath === destination;

  let resolvedClassName = className;
  if (typeof className === 'function') {
    resolvedClassName = className({ isActive });
  } else if (isActive && activeClassName) {
    resolvedClassName = [className, activeClassName].filter(Boolean).join(' ');
  }

  return (
    <NextLink href={destination} className={resolvedClassName} style={style} {...rest}>
      {children}
    </NextLink>
  );
}

// ─── Navigate ────────────────────────────────────────────────────────────────
export function Navigate({ to, replace: replaceFlag }) {
  const router = useRouter();
  React.useEffect(() => {
    if (replaceFlag) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, []);
  return null;
}

// ─── Hooks ───────────────────────────────────────────────────────────────────
export function useNavigate() {
  const router = useRouter();
  return React.useCallback(
    (to, options = {}) => {
      if (options.replace) {
        router.replace(to);
      } else {
        router.push(to);
      }
    },
    [router]
  );
}

export function useLocation() {
  const router = useRouter();
  return {
    pathname: router.pathname,
    search: router.asPath.includes('?') ? '?' + router.asPath.split('?')[1] : '',
    hash: '',
    state: null,
  };
}

export function useParams() {
  const router = useRouter();
  return router.query || {};
}

export function useSearchParams() {
  const router = useRouter();
  if (typeof window === 'undefined') return [new URLSearchParams(), () => {}];
  const params = new URLSearchParams(router.asPath.split('?')[1] || '');
  return [params, () => {}];
}

export function useMatch(pattern) {
  const router = useRouter();
  if (!pattern) return null;
  const path = typeof pattern === 'string' ? pattern : pattern.path;
  if (router.pathname === path) {
    return { pathname: router.pathname, params: router.query };
  }
  return null;
}

// ─── Route / Routes / BrowserRouter (no-ops in Next.js) ──────────────────────
export function BrowserRouter({ children }) {
  return <>{children}</>;
}

export function Routes({ children }) {
  return <>{children}</>;
}

export function Route() {
  return null;
}

export function Switch({ children }) {
  return <>{children}</>;
}

export function Outlet() {
  return null;
}

export function ScrollRestoration() {
  return null;
}

// ─── Default export (some components do: import RRD from "react-router-dom") ─
const ReactRouterDomCompat = {
  Link,
  NavLink,
  Navigate,
  BrowserRouter,
  Routes,
  Route,
  Switch,
  Outlet,
  ScrollRestoration,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
  useMatch,
};

export default ReactRouterDomCompat;
