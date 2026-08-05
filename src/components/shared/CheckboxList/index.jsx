import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

function CheckboxList({
  options = [],
  value = [],
  onChange,
  getOptionLabel,
  emptyLabel = 'No hay opciones disponibles',
  showSelectAll = true,
  selectAllLabel = 'Seleccionar todos',
  disabled,
}) {
  const defaultGetOptionLabel = option =>
    option.name?.toUpperCase() || option.label?.toUpperCase() || '';

  const labelFor = getOptionLabel || defaultGetOptionLabel;

  const optionId = option => String(option._id ?? option.id ?? option);

  const selectedIds = new Set(value.map(v => optionId(v)));

  const allSelected =
    options.length > 0 && options.every(o => selectedIds.has(optionId(o)));

  const someSelected =
    !allSelected && options.some(o => selectedIds.has(optionId(o)));

  const handleToggle = option => {
    const id = optionId(option);
    const next = selectedIds.has(id)
      ? value.filter(v => optionId(v) !== id)
      : [...value, option];
    onChange(next);
  };

  const handleToggleAll = () => {
    onChange(allSelected ? [] : [...options]);
  };

  if (options.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {emptyLabel}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        maxHeight: 300,
        overflowY: 'auto',
      }}
    >
      {showSelectAll && (
        <>
          <Box sx={{ px: 1.5, py: 0.5 }}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  indeterminate={someSelected}
                  checked={allSelected}
                  onChange={handleToggleAll}
                  disabled={disabled}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {selectAllLabel}
                </Typography>
              }
            />
          </Box>
          <Divider sx={{ borderColor: 'divider' }} />
        </>
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          px: 1,
          py: 0.5,
        }}
      >
        {options.map(option => {
          const id = optionId(option);
          return (
            <FormControlLabel
              key={id}
              control={
                <Checkbox
                  size="small"
                  checked={selectedIds.has(id)}
                  onChange={() => handleToggle(option)}
                  disabled={disabled}
                />
              }
              label={
                <Typography variant="body2">{labelFor(option)}</Typography>
              }
              sx={{
                px: 0.5,
                py: 0.25,
                '&:hover': { backgroundColor: 'rgba(94, 57, 224, 0.04)' },
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
}

export default CheckboxList;
