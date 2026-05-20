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

function Button({ variant = 'primary', sx, children, ...props }) {
  const config = variantStyles[variant] || variantStyles.primary;

  return (
    <MuiButton variant={config.variant} sx={{ ...config.sx, ...sx }} {...props}>
      {children}
    </MuiButton>
  );
}

export default Button;
