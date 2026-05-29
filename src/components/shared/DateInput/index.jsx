import React from 'react';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { format, parse, isValid } from 'date-fns';

export default function DateInput({
  value = '',
  onChange,
  label,
  error,
  helperText,
  required,
  placeholder = 'DD/MM/AAAA',
}) {
  const dateValue = React.useMemo(() => {
    if (!value) return null;
    let d = parse(value, 'yyyy-MM-dd', new Date());
    if (isValid(d)) return d;
    if (value.includes('T')) {
      d = parse(value.split('T')[0], 'yyyy-MM-dd', new Date());
      if (isValid(d)) return d;
    }
    return null;
  }, [value]);

  const handleChange = date => {
    if (date && isValid(date)) {
      onChange(format(date, 'yyyy-MM-dd'));
    } else {
      onChange('');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
      <DatePicker
        value={dateValue}
        onChange={handleChange}
        inputFormat="dd/MM/yyyy"
        mask="__/__/____"
        label={label}
        renderInput={params => (
          <TextField
            {...params}
            size="small"
            fullWidth
            error={error}
            helperText={helperText}
            required={required}
            placeholder={placeholder}
            inputProps={{
              ...params.inputProps,
              placeholder,
              autoComplete: 'off',
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
}
