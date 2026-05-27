import MuiTextField from '@mui/material/TextField';

function TextField({
  variant = 'outlined',
  fullWidth = true,
  size = 'medium',
  sx,
  ...props
}) {
  return (
    <MuiTextField
      variant={variant}
      fullWidth={fullWidth}
      size={size}
      sx={sx}
      {...props}
    />
  );
}

export default TextField;
