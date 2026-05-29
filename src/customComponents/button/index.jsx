import MuiButton from '@mui/material/Button';

const variantStyles = {
  primary: {
    variant: 'contained',
    sx: {},
  },
  secondary: {
    variant: 'contained',
    sx: {
      bgcolor: 'rgba(94, 57, 224, 0.1)',
      color: 'primary.main',
      boxShadow: 'none',
      '&:hover': {
        bgcolor: 'rgba(94, 57, 224, 0.18)',
        boxShadow: 'none',
      },
    },
  },
  ghost: {
    variant: 'text',
    sx: {
      color: 'text.primary',
      '&:hover': {
        bgcolor: 'rgba(0, 0, 0, 0.04)',
      },
    },
  },
};

const VALID_MUI_COLORS = [
  'primary',
  'secondary',
  'success',
  'error',
  'info',
  'warning',
  'inherit',
];

function Button({
  variant = 'primary',
  sx,
  children,
  color,
  buttonText,
  ...props
}) {
  const config = variantStyles[variant] || variantStyles.primary;
  const isMuiColor = VALID_MUI_COLORS.includes(color);

  return (
    <MuiButton
      variant={config.variant}
      color={isMuiColor ? color : undefined}
      sx={{
        ...config.sx,
        ...(color && !isMuiColor
          ? {
              backgroundColor: color,
              '&:hover': { backgroundColor: color },
            }
          : {}),
        ...sx,
      }}
      {...props}
    >
      {children || buttonText}
    </MuiButton>
  );
}

export default Button;
