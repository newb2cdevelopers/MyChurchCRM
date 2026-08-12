import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

const severityConfig = {
  success: {
    Icon: CheckCircleIcon,
    borderColor: 'success.main',
    iconColor: 'success.dark',
    bgcolor: 'success.light',
  },
  error: {
    Icon: ErrorIcon,
    borderColor: 'error.main',
    iconColor: 'error.dark',
    bgcolor: 'error.light',
  },
  warning: {
    Icon: WarningIcon,
    borderColor: 'warning.main',
    iconColor: 'warning.dark',
    bgcolor: 'warning.light',
  },
  info: {
    Icon: InfoIcon,
    borderColor: 'info.main',
    iconColor: 'info.dark',
    bgcolor: 'info.light',
  },
};

/**
 * Persistent inline alert/banner that follows the design system.
 * Severity maps to theme tokens (main = accent border, dark = icon/text,
 * light = tinted background), sharing the visual language of the toast.
 */
function Alert({
  severity = 'info',
  title,
  children,
  showIcon = true,
  dismissible = false,
  onDismiss,
  icon: CustomIcon,
  sx,
}) {
  const config = severityConfig[severity] || severityConfig.info;
  const Icon = CustomIcon || config.Icon;

  return (
    <Box
      role="alert"
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        bgcolor: config.bgcolor,
        border: '1px solid',
        borderColor: config.borderColor,
        borderLeftWidth: 4,
        borderRadius: 2,
        py: 1,
        px: 2,
        ...sx,
      }}
    >
      {showIcon && (
        <Icon
          sx={{ fontSize: 20, color: config.iconColor, flexShrink: 0, mt: 0.25 }}
        />
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {title && (
          <Typography
            variant="caption"
            fontWeight={600}
            color="text.primary"
            sx={{ display: 'block' }}
          >
            {title}
          </Typography>
        )}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block' }}
        >
          {children}
        </Typography>
      </Box>
      {dismissible && (
        <IconButton
          size="small"
          onClick={onDismiss}
          aria-label="Cerrar"
          sx={{ color: 'text.secondary', flexShrink: 0 }}
        >
          <CloseIcon sx={{ fontSize: 14 }} />
        </IconButton>
      )}
    </Box>
  );
}

export default Alert;
