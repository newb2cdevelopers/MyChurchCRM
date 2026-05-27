import MuiSelect from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';

function Select({
  variant = 'outlined',
  size = 'medium',
  sx,
  label,
  children,
  error,
  helperText,
  fullWidth = true,
  ...props
}) {
  return (
    <FormControl fullWidth={fullWidth} error={error} size={size}>
      {label && <InputLabel>{label}</InputLabel>}
      <MuiSelect variant={variant} label={label} size={size} sx={sx} {...props}>
        {children}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

export default Select;
