import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

function MultiSelect({
  options = [],
  value,
  onChange,
  label,
  placeholder = 'Seleccionar...',
  getOptionLabel,
  isOptionEqualToValue,
  noOptionsText = 'Sin resultados',
  size = 'small',
  error,
  helperText,
  disabled,
  multiple = true,
  required,
}) {
  const defaultGetOptionLabel = option =>
    option.name?.toUpperCase() || option.label?.toUpperCase() || '';

  const defaultIsOptionEqualToValue = (option, val) =>
    String(option._id) === String(val._id);

  return (
    <Autocomplete
      multiple={multiple}
      options={options}
      value={multiple ? value || [] : value || null}
      onChange={(e, newValue) => onChange(newValue)}
      getOptionLabel={getOptionLabel || defaultGetOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue || defaultIsOptionEqualToValue}
      disabled={disabled}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          size={size}
          error={error}
          helperText={helperText}
          required={required}
        />
      )}
      renderTags={
        multiple
          ? (val, getTagProps) =>
              val.map((option, index) => {
                const label = (getOptionLabel || defaultGetOptionLabel)(option);
                return (
                  <Chip
                    label={label}
                    size="small"
                    {...getTagProps({ index })}
                    key={option._id || option.id || index}
                  />
                );
              })
          : undefined
      }
      noOptionsText={noOptionsText}
      fullWidth
    />
  );
}

export default MultiSelect;
