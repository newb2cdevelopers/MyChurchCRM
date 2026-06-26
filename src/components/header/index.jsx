import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import InputBase from '@mui/material/InputBase';
import { alpha } from '@mui/material/styles';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SearchIcon from '@mui/icons-material/Search';

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
        <IconButton
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              bgcolor: theme => alpha(theme.palette.primary.main, 0.06),
            },
          }}
        >
          <NotificationsNoneOutlinedIcon sx={{ fontSize: 22 }} />
        </IconButton>
        <IconButton
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              bgcolor: theme => alpha(theme.palette.primary.main, 0.06),
            },
          }}
        >
          <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 22 }} />
        </IconButton>
        <IconButton
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              bgcolor: theme => alpha(theme.palette.primary.main, 0.06),
            },
          }}
        >
          <SettingsOutlinedIcon sx={{ fontSize: 22 }} />
        </IconButton>

        <Box
          sx={{
            width: '1px',
            height: 28,
            bgcolor: theme => alpha(theme.palette.divider, 0.3),
            mx: 0.5,
          }}
        />

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
