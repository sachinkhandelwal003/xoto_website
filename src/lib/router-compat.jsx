'use client';
/**
 * react-router-dom → Next.js Pages Router compatibility shim.
 * Webpack aliases all "react-router-dom" imports here.
 */

import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

// ─── Params context (for extracted :param values) ────────────────────────────
const ParamsContext = React.createContext({});

// ─── Path matching ────────────────────────────────────────────────────────────
function matchPath(pattern, currentPath) {
  if (!pattern && pattern !== '') return null;

  // Index / root route
  if (pattern === '/' || pattern === '') {
    return currentPath === '' || currentPath === '/' ? {} : null;
  }

  const patternParts = pattern.replace(/^\//, '').split('/');
  const pathParts = currentPath.replace(/^\//, '').split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

// ─── Flatten children (handles arrays from .map()) ───────────────────────────
function flattenRoutes(children) {
  const routes = [];
  React.Children.forEach(children, (child) => {
    if (!child) return;
    if (Array.isArray(child)) {
      routes.push(...flattenRoutes(child));
    } else if (React.isValidElement(child)) {
      routes.push(child);
    }
  });
  return routes;
}

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
    pathname: router.asPath.split('?')[0],
    search: router.asPath.includes('?') ? '?' + router.asPath.split('?')[1] : '',
    hash: '',
    state: null,
  };
}

export function useParams() {
  const router = useRouter();
  const ctxParams = React.useContext(ParamsContext);
  // Merge Next.js query params with extracted path params
  const { roleSlug, rest, ...queryRest } = router.query || {};
  return { ...queryRest, ...ctxParams };
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
  const rest = router.query?.rest;
  const currentPath = Array.isArray(rest) ? rest.join('/') : router.asPath.split('?')[0];
  const params = matchPath(path, currentPath);
  if (params !== null) {
    return { pathname: router.asPath, params };
  }
  return null;
}

// ─── Routes — matches current URL and renders the correct Route's element ────
export function Routes({ children }) {
  const router = useRouter();

  // Build current path from Next.js catch-all param
  const rest = router.query?.rest;
  const currentPath = Array.isArray(rest) ? rest.join('/') : '';

  const routes = flattenRoutes(children);

  for (const route of routes) {
    if (!React.isValidElement(route)) continue;
    const { path, element } = route.props;
    if (element === undefined) continue;

    const params = matchPath(path ?? '', currentPath);
    if (params !== null) {
      return (
        <ParamsContext.Provider value={params}>
          {element}
        </ParamsContext.Provider>
      );
    }
  }

  return null;
}

// ─── Route — no-op; Routes handles rendering ─────────────────────────────────
export function Route() {
  return null;
}

// ─── Misc no-ops ─────────────────────────────────────────────────────────────
export function BrowserRouter({ children }) {
  return <>{children}</>;
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

// ─── Default export ───────────────────────────────────────────────────────────
const ReactRouterDomCompat = {
  Link, NavLink, Navigate,
  BrowserRouter, Routes, Route, Switch, Outlet, ScrollRestoration,
  useNavigate, useLocation, useParams, useSearchParams, useMatch,
};

export default ReactRouterDomCompat;
