import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { setSelectedModule } from '../../features/navigation/navigationSlice';
import * as authService from '../../services/authService';
import { renderAppIcon } from '../../utils/iconResolver';

const SIDEBAR_WIDTH = 260;

function SidebarItem({ label, icon, selected, onClick }) {
  return (
    <ListItem disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton
        onClick={onClick}
        selected={selected}
        sx={{
          borderRadius: 1,
          py: 1,
          borderLeft: selected ? '4px solid' : '4px solid transparent',
          borderLeftColor: selected ? 'primary.main' : 'transparent',
          bgcolor: selected
            ? theme => alpha(theme.palette.primary.main, 0.1)
            : 'transparent',
          '&:hover': {
            bgcolor: selected
              ? theme => alpha(theme.palette.primary.main, 0.12)
              : theme => alpha(theme.palette.primary.main, 0.06),
          },
          '& .MuiListItemIcon-root': {
            color: selected ? 'primary.main' : 'text.secondary',
          },
          '& .MuiListItemText-root .MuiTypography-root': {
            color: selected ? 'primary.main' : 'text.primary',
            fontWeight: selected ? 600 : 500,
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
        <ListItemText
          primary={label}
          primaryTypographyProps={{
            variant: 'subtitle2',
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

function SidebarContent({ onItemClick }) {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roles } = useSelector(state => state.user);
  const { selectedModuleName } = useSelector(state => state.navigation);

  const closeIfNeeded = () => {
    if (onItemClick) onItemClick();
  };

  const clearSelectedModule = () => {
    dispatch(
      setSelectedModule({ selectedModuleName: '', selectedModuleRoutes: [] }),
    );
  };

  const handleGoInicio = () => {
    clearSelectedModule();
    navigate('/dashboard');
    closeIfNeeded();
  };

  const getModuleSlug = role => {
    const route = role.accesses?.[0]?.module?.route;
    if (route && route !== 'test') return route;
    return role.module.toLowerCase().replace(/\s+/g, '-');
  };

  const handleSelectModule = role => {
    dispatch(
      setSelectedModule({
        selectedModuleName: role.module,
        selectedModuleRoutes: role.accesses || [],
      }),
    );
    navigate(`/module/${getModuleSlug(role)}`);
    closeIfNeeded();
  };

  const handleCompanyDirectory = () => {
    clearSelectedModule();
    navigate('/company-directory');
    closeIfNeeded();
  };

  const handleLogout = async () => {
    await authService.logout(dispatch, navigate);
    clearSelectedModule();
    closeIfNeeded();
  };

  const isInicioActive = pathname === '/dashboard';

  // Highlight module while in /modules, or when visiting one of its sub-routes.
  const activeModuleFromPath =
    roles?.find(r =>
      r.accesses?.some(
        a => pathname === a.route || pathname.startsWith(`${a.route}/`),
      ),
    )?.module || '';
  const activeModule =
    activeModuleFromPath ||
    (pathname.startsWith('/modules') ? selectedModuleName : '');

  const isCompanyDirectoryActive = pathname.startsWith('/company-directory');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 2,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            letterSpacing: '-0.02em',
            color: 'primary.main',
            fontWeight: 600,
          }}
        >
          SISTEMA DE GESTION MI IGLESIA
        </Typography>
      </Box>

      <List sx={{ flex: 1, px: 1.5, py: 1.5 }}>
        <SidebarItem
          label="Inicio"
          icon={<DashboardIcon />}
          selected={isInicioActive}
          onClick={handleGoInicio}
        />

        {(roles || []).map(role => (
          <SidebarItem
            key={role.module}
            label={role.module}
            icon={renderAppIcon(role?.accesses?.[0]?.module?.icon, {
              fontSize: 20,
            })}
            selected={activeModule === role.module}
            onClick={() => handleSelectModule(role)}
          />
        ))}

        <SidebarItem
          label="Directorio Empresas"
          icon={<BusinessIcon />}
          selected={isCompanyDirectoryActive}
          onClick={handleCompanyDirectory}
        />
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
          py: 0.75,
            '&:hover': {
              bgcolor: theme => alpha(theme.palette.primary.main, 0.06),
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText
            primary="Cerrar Sesion"
            primaryTypographyProps={{
              variant: 'subtitle2',
              color: 'text.primary',
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
}

function Sidebar({ mobileOpen, onMobileClose }) {
  return (
    <Box
      component="nav"
      sx={{ width: { md: SIDEBAR_WIDTH }, flexShrink: { md: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: SIDEBAR_WIDTH,
          },
        }}
      >
        <SidebarContent onItemClick={onMobileClose} />
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: SIDEBAR_WIDTH,
            borderRight: '1px solid',
            borderColor: theme => alpha(theme.palette.divider, 0.3),
          },
        }}
        open
      >
        <SidebarContent />
      </Drawer>
    </Box>
  );
}

export default Sidebar;
