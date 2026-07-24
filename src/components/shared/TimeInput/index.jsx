import React from 'react';
import TextField from '@mui/material/TextField';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { format, parse, isValid } from 'date-fns';

export default function TimeInput({
  value = '',
  onChange,
  label,
  error,
  helperText,
  required,
  placeholder = 'hh:mm am/pm',
}) {
  const timeValue = React.useMemo(() => {
    if (!value) return null;
    const d = parse(value, 'HH:mm', new Date());
    return isValid(d) ? d : null;
  }, [value]);

  const handleChange = date => {
    if (date && isValid(date)) {
      onChange(format(date, 'HH:mm'));
    } else {
      onChange('');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
      <TimePicker
        value={timeValue}
        onChange={handleChange}
        ampm
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
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
}
