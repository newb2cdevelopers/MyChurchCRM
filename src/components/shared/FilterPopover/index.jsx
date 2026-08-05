import { useState } from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '../../../customComponents/button';
import Select from '../Select';

const hasActiveValue = filter => {
  if (filter.type === 'multi') {
    return Array.isArray(filter.value) && filter.value.length > 0;
  }
  return (
    filter.value !== undefined && filter.value !== null && filter.value !== ''
  );
};

function FilterPopover({
  filters = [],
  onClearAll,
  title = 'Filtros',
  clearAllLabel = 'Limpiar filtros',
  buttonLabel = 'Filtros',
  buttonVariant = 'secondary',
  hideLabelOnMobile = false,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const activeCount = filters.filter(hasActiveValue).length;

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button
        variant={buttonVariant}
        onClick={e => setAnchorEl(e.currentTarget)}
        aria-label={hideLabelOnMobile ? buttonLabel : undefined}
        sx={{
          whiteSpace: 'nowrap',
          fontWeight: 500,
          fontSize: '0.875rem',
          gap: 1,
        }}
        startIcon={<FilterListIcon />}
        endIcon={
          <ExpandMoreIcon
            sx={{
              transition: 'transform 0.2s',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              fontSize: 18,
            }}
          />
        }
      >
        <Box
          component="span"
          sx={{
            display: hideLabelOnMobile
              ? { xs: 'none', sm: 'inline' }
              : 'inline',
          }}
        >
          {buttonLabel}
        </Box>
        {activeCount > 0 && (
          <Box
            component="span"
            sx={{
              minWidth: 18,
              height: 18,
              px: 0.6,
              borderRadius: '999px',
              bgcolor: 'primary.main',
              color: 'common.white',
              fontSize: '0.75rem',
              lineHeight: '18px',
              textAlign: 'center',
            }}
          >
            {activeCount}
          </Box>
        )}
      </Button>
      <Popover
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 300, mt: 1, borderRadius: 2 } }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.5,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {activeCount > 0 && (
            <Typography
              variant="caption"
              onClick={() => onClearAll?.()}
              sx={{
                color: 'primary.main',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {clearAllLabel}
            </Typography>
          )}
        </Box>
        <Divider />
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: 'grid',
            gap: 2,
            maxHeight: 340,
            overflowY: 'auto',
          }}
        >
          {filters.map(filter => (
            <Box key={filter.id}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5, display: 'block', fontWeight: 500 }}
              >
                {filter.label}
              </Typography>
              {filter.type === 'multi' ? (
                <Select
                  size="small"
                  fullWidth
                  multiple
                  value={filter.value || []}
                  onChange={e => filter.onChange(e.target.value)}
                  renderValue={selected =>
                    selected.length === 0
                      ? 'Todos'
                      : selected.length === 1
                        ? filter.options.find(o => o.value === selected[0])
                            ?.label
                        : `${selected.length} seleccionados`
                  }
                >
                  {filter.options.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      <Checkbox
                        size="small"
                        checked={(filter.value || []).includes(option.value)}
                      />
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <Select
                  size="small"
                  fullWidth
                  displayEmpty
                  value={filter.value || ''}
                  onChange={e => filter.onChange(e.target.value)}
                >
                  {filter.showAll !== false && (
                    <MenuItem value={filter.allValue ?? ''}>
                      <em>{filter.allLabel || 'Todos'}</em>
                    </MenuItem>
                  )}
                  {filter.options.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Box>
          ))}
        </Box>
      </Popover>
    </>
  );
}

export default FilterPopover;
