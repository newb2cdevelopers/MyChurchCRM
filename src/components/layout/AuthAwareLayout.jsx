import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Sidebar from '../sidebar';
import Header from '../header';
import BottomNav from '../bottomNav';

function AuthAwareLayout() {
  const { pathname } = useLocation();
  const { token } = useSelector(state => state.user);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isCompanyDirectory = pathname.startsWith('/company-directory');

  if (!token) {
    return <Outlet />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
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
            maxWidth: '100%',
            overflowX: 'hidden',
            p: isCompanyDirectory ? 0 : { xs: 3, md: 6 },
            pb: isCompanyDirectory ? { xs: 12, md: 0 } : { xs: 12, md: 6 },
          }}
        >
          <Outlet />
        </Box>
        <BottomNav onOpenMore={() => setMobileOpen(true)} />
      </Box>
    </Box>
  );
}

export default AuthAwareLayout;
