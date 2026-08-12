import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

const config = {
  success: {
    borderColor: 'success.main',
    iconColor: 'success.dark',
    Icon: CheckCircleIcon,
  },
  error: {
    borderColor: 'error.main',
    iconColor: 'error.dark',
    Icon: ErrorIcon,
  },
  warning: {
    borderColor: 'warning.main',
    iconColor: 'warning.dark',
    Icon: WarningIcon,
  },
  info: {
    borderColor: 'info.main',
    iconColor: 'info.dark',
    Icon: InfoIcon,
  },
};

function ToastContent({ variant = 'info', title, description, closeToast }) {
  const { borderColor, iconColor, Icon } = config[variant] || config.info;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        bgcolor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(8px)',
        border: '1px solid',
        borderColor: 'divider',
        borderLeftWidth: 4,
        borderLeftColor: borderColor,
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
        p: 2,
        minWidth: 280,
        maxWidth: 420,
      }}
    >
      <Icon sx={{ fontSize: 20, color: iconColor, flexShrink: 0 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="caption" fontWeight={600} color="text.primary">
          {title}
        </Typography>
        {description && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block' }}
          >
            {description}
          </Typography>
        )}
      </Box>
      {closeToast && (
        <IconButton
          size="small"
          onClick={closeToast}
          sx={{ color: 'text.secondary', flexShrink: 0 }}
        >
          <CloseIcon sx={{ fontSize: 14 }} />
        </IconButton>
      )}
    </Box>
  );
}

export default ToastContent;
