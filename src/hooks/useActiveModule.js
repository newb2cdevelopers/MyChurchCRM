import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Resolves a module name from its slug inside `/module/:slug`.
export function getModuleSlug(role) {
  const route = role?.accesses?.[0]?.module?.route;

  if (route && route !== 'test') return route;

  return role?.module?.toLowerCase().replace(/\s+/g, '-') || '';
}

/**
 * Returns the name of the module currently active, or '' when the user is
 * outside the module area.
 *
 * Resolution order:
 *   1. Slug in the current URL (`/module/community` → "community"). This keeps
 *      the highlight correct after a reload or a direct URL visit, when Redux
 *      has no `selectedModuleName` yet.
 *   2. The functionality route in the URL, for legacy paths that still use
 *      their own routing (e.g. `/members`).
 *   3. `selectedModuleName` from Redux, as a fallback while the URL is being
 *      updated after a click.
 */
export function useActiveModule() {
  const { pathname } = useLocation();
  const { roles } = useSelector(state => state.user);
  const { selectedModuleName } = useSelector(state => state.navigation);
  const safeRoles = roles || [];

  const slug = pathname.match(/^\/module\/([^/]+)/)?.[1] || '';

  const moduleFromSlug = slug
    ? safeRoles.find(r => getModuleSlug(r) === slug)?.module || ''
    : '';

  const moduleFromRoute = safeRoles.find(r =>
    r.accesses?.some(
      a => pathname === a.route || pathname.startsWith(`${a.route}/`),
    ),
  )?.module;

  return (
    moduleFromSlug ||
    moduleFromRoute ||
    (pathname.startsWith('/module/') ? selectedModuleName : '')
  );
}

export default useActiveModule;
