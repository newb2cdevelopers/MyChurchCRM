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
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ flexShrink: 0 }}>
          <Header />
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: isCompanyDirectory ? 0 : { xs: 2, md: 2.5 },
            pb: isCompanyDirectory ? { xs: 12, md: 0 } : { xs: 12, md: 2 },
          }}
        >
          <Outlet />
        </Box>
        <Box sx={{ flexShrink: 0 }}>
          <BottomNav onOpenMore={() => setMobileOpen(true)} />
        </Box>
      </Box>
    </Box>
  );
}

export default AuthAwareLayout;
