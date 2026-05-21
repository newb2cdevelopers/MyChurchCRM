import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Navbar from '../navbar';
import Sidebar from '../sidebar';
import Header from '../header';
import BottomNav from '../bottomNav';
import RoutesCollection from '../../routes/mainRouter';

function Layout() {
  const { pathname } = useLocation();
  const { token } = useSelector(state => state.user);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isCompanyDirectoryRoute = pathname.startsWith('/company-directory');

  const isAuthRoute =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/recoveryPassword';

  if (isAuthRoute) {
    return <>{RoutesCollection}</>;
  }

  if (token) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
        <Box
          sx={{
            flexGrow: 1,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.default',
          }}
        >
          <Header />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: isCompanyDirectoryRoute ? 0 : { xs: 3, md: 6 },
              // Keep space for the mobile bottom nav; avoid extra padding on desktop.
              pb: isCompanyDirectoryRoute
                ? { xs: 12, md: 0 }
                : { xs: 12, md: 6 },
            }}
          >
            {RoutesCollection}
          </Box>

          <BottomNav onOpenMore={() => setMobileSidebarOpen(true)} />
        </Box>
      </Box>
    );
  }

  // Public directory experience when the user is not authenticated.
  if (isCompanyDirectoryRoute) {
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
