import { useLocation } from 'react-router-dom';
import Navbar from '../navbar';
import RoutesCollection from '../../routes/mainRouter';

function Layout() {
  const { pathname } = useLocation();

  const isCompanyDirectoryIndexRoute = pathname === '/company-directory';
  const isCompanyDirectoryDetailRoute =
    /^\/company-directory\/[^/]+$/.test(pathname) &&
    pathname !== '/company-directory/new' &&
    pathname !== '/company-directory/internal';

  const isAuthRoute =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/recoveryPassword';

  if (
    isCompanyDirectoryIndexRoute ||
    isCompanyDirectoryDetailRoute ||
    isAuthRoute
  ) {
    return <>{RoutesCollection}</>;
  }

  return (
    <>
      <Navbar />
      <div className="main">{RoutesCollection}</div>
    </>
  );
}

export default Layout;
