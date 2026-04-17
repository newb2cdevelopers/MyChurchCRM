import { useLocation } from 'react-router-dom';
import Navbar from '../navbar';
import RoutesCollection from '../../routes/mainRouter';

function Layout() {
  const { pathname } = useLocation();

  const isCompanyDirectoryIndexRoute = pathname === '/company-directory';
  const isCompanyDirectoryDetailRoute =
    pathname.startsWith('/company-directory/') &&
    pathname !== '/company-directory/new';

  if (isCompanyDirectoryIndexRoute || isCompanyDirectoryDetailRoute) {
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
