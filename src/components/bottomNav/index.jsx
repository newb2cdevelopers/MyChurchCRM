import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { setSelectedModule } from '../../features/navigation/navigationSlice';
import { renderAppIcon } from '../../utils/iconResolver';

const QUICK_MODULE_PRIORITY = [
  'Aforo',
  'Fortalecimiento',
  'Administrar Usuarios',
  'Administrar Grupos Familiares',
];

const QUICK_MODULE_LABELS = {
  Fortalecimiento: 'Fortalec.',
  'Administrar Usuarios': 'Usuarios',
  'Administrar Grupos Familiares': 'Grupos',
};

function pickQuickModules(roles) {
  const safeRoles = roles || [];
  const picked = [];
  const used = new Set();

  QUICK_MODULE_PRIORITY.forEach(moduleName => {
    const match = safeRoles.find(r => r?.module === moduleName);
    if (match && !used.has(match.module) && picked.length < 2) {
      picked.push(match);
      used.add(match.module);
    }
  });

  // Fill remaining slots (if any) with the backend order.
  safeRoles.forEach(r => {
    if (picked.length >= 2) return;
    if (!r?.module || used.has(r.module)) return;
    picked.push(r);
    used.add(r.module);
  });

  return picked;
}

function getQuickLabel(moduleName) {
  return QUICK_MODULE_LABELS[moduleName] || moduleName;
}

function BottomNavItem({ icon, label, active, onClick }) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        borderRadius: 1,
        py: 1,
        overflow: 'hidden',
        color: active ? 'primary.main' : 'text.secondary',
        bgcolor: active
          ? theme => alpha(theme.palette.primary.main, 0.1)
          : 'transparent',
        '&:hover': {
          bgcolor: theme =>
            alpha(theme.palette.primary.main, active ? 0.12 : 0.06),
        },
      }}
    >
      {icon}
      <Typography
        variant="overline"
        sx={{
          lineHeight: 1,
          fontWeight: active ? 600 : 500,
          color: 'inherit',
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        noWrap
      >
        {label}
      </Typography>
    </ButtonBase>
  );
}

function BottomNav({ onOpenMore }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { roles } = useSelector(state => state.user);
  const { selectedModuleName } = useSelector(state => state.navigation);

  const quickModules = pickQuickModules(roles);

  const isInicioActive = pathname === '/dashboard';
  const activeModuleFromPath =
    roles?.find(r =>
      r.accesses?.some(
        a => pathname === a.route || pathname.startsWith(`${a.route}/`),
      ),
    )?.module || '';
  const activeModule =
    activeModuleFromPath ||
    (pathname.startsWith('/modules') ? selectedModuleName : '');

  const handleInicio = () => {
    dispatch(
      setSelectedModule({ selectedModuleName: '', selectedModuleRoutes: [] }),
    );
    navigate('/dashboard');
  };

  const handleModule = role => {
    dispatch(
      setSelectedModule({
        selectedModuleName: role.module,
        selectedModuleRoutes: role.accesses || [],
      }),
    );
    navigate('/modules');
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1200,
        p: 1.5,
        display: { xs: 'block', md: 'none' },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          height: 64,
          px: 1.5,
          display: 'flex',
          alignItems: 'stretch',
          gap: 1,
          borderRadius: 2,
          border: '1px solid',
          borderColor: theme => alpha(theme.palette.divider, 0.3),
          bgcolor: theme => alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(12px)',
          boxShadow: theme => theme.shadows[3],
        }}
      >
        <BottomNavItem
          icon={<DashboardIcon sx={{ fontSize: 22 }} />}
          label="Inicio"
          active={isInicioActive}
          onClick={handleInicio}
        />

        {quickModules.map(role => (
          <BottomNavItem
            key={role.module}
            icon={renderAppIcon(role?.accesses?.[0]?.module?.icon, {
              fontSize: 22,
            })}
            label={getQuickLabel(role.module)}
            active={activeModule === role.module}
            onClick={() => handleModule(role)}
          />
        ))}

        <BottomNavItem
          icon={<MoreHorizIcon sx={{ fontSize: 22 }} />}
          label="Mas"
          active={false}
          onClick={onOpenMore}
        />
      </Paper>
    </Box>
  );
}

export default BottomNav;
