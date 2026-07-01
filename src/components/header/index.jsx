import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DropdownButton from '../shared/DropdownButton';

const HEADER_HEIGHT = 64;

function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 36,
      height: 36,
      fontSize: '0.875rem',
      fontWeight: 600,
    },
    children: name.charAt(0).toUpperCase(),
  };
}

function Header() {
  const { userEmail } = useSelector(state => state.user);

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: HEADER_HEIGHT,
        bgcolor: theme => alpha(theme.palette.background.default, 0.8),
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, md: 2 },
        borderBottom: '1px solid',
        borderColor: theme => alpha(theme.palette.divider, 0.3),
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 448,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'text.secondary',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <SearchIcon sx={{ fontSize: 20 }} />
        </Box>
        <InputBase
          placeholder="Buscar registros..."
          sx={{
            width: '100%',
            pl: '48px',
            pr: 2,
            py: 0.75,
            bgcolor: theme => alpha(theme.palette.primary.main, 0.06),
            borderRadius: 1,
            fontSize: '0.875rem',
            color: 'text.primary',
            transition: theme =>
              theme.transitions.create(['box-shadow'], {
                duration: theme.transitions.duration.short,
              }),
            '&:focus-within': {
              boxShadow: theme =>
                `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
            },
            '& ::placeholder': {
              color: 'text.secondary',
              opacity: 1,
            },
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <DropdownButton
          label="Páginas Públicas"
          hideLabelOnMobile
          items={[
            {
              label: 'Directorio de Empresas',
              icon: (
                <BusinessIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              ),
              onClick: () =>
                window.open(
                  '/company-directory',
                  '_blank',
                  'noopener,noreferrer',
                ),
            },
            {
              label: 'Eventos',
              icon: (
                <CalendarMonthIcon
                  sx={{ fontSize: 20, color: 'text.secondary' }}
                />
              ),
              onClick: () =>
                window.open('/public-events', '_blank', 'noopener,noreferrer'),
            },
            {
              label: 'Reservas',
              icon: (
                <EventAvailableIcon
                  sx={{ fontSize: 20, color: 'text.secondary' }}
                />
              ),
              onClick: () =>
                window.open(
                  '/manage-bookings',
                  '_blank',
                  'noopener,noreferrer',
                ),
            },
          ]}
        />

        <Divider orientation="vertical" flexItem sx={{ height: 28, mx: 0.5 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              textAlign: 'right',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: 'text.primary', lineHeight: 1.2 }}
            >
              {userEmail}
            </Typography>
          </Box>
          <Avatar {...stringAvatar(userEmail || 'U')} />
        </Box>
      </Box>
    </Box>
  );
}

export default Header;
