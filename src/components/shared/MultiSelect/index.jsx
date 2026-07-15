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
}) {
  const defaultGetOptionLabel = option =>
    option.name?.toUpperCase() || option.label?.toUpperCase() || '';

  const defaultIsOptionEqualToValue = (option, val) =>
    String(option._id) === String(val._id);

  const debugId = Math.random().toString(36).slice(2, 6);
  console.log(
    `[MultiSelect:${debugId}] render - options:`,
    options?.length ?? 0,
    'items, value:',
    JSON.stringify(value),
  );
  console.log(
    `[MultiSelect:${debugId}] isOptionEqualToValue samples:`,
    options?.[0] && value?.[0]
      ? `option._id=${JSON.stringify(options[0]._id)} val._id=${JSON.stringify(value[0]._id)} match=${String(options[0]._id) === String(value[0]._id) || String(options[0].id) === String(value[0].id)}`
      : 'N/A',
  );

  return (
    <Autocomplete
      multiple
      options={options}
      value={value || []}
      onChange={(e, newValue, reason, details) => {
        console.log(
          `[MultiSelect:${debugId}] onChange reason:${reason}`,
          JSON.stringify(newValue),
        );
        onChange(newValue);
      }}
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
        />
      )}
      renderTags={(val, getTagProps) =>
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
      }
      noOptionsText={noOptionsText}
      fullWidth
    />
  );
}

export default MultiSelect;
