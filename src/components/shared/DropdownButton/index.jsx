import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function DropdownButton({
  label,
  items,
  icon: Icon,
  variant = 'text',
  hideLabelOnMobile = false,
  sx,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => setAnchorEl(null);

  const handleClick = event => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        onClick={handleClick}
        endIcon={
          <ExpandMoreIcon
            sx={{
              transition: 'transform 0.2s',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        }
        startIcon={Icon ? <Icon /> : undefined}
        sx={{
          color: 'text.secondary',
          fontWeight: 500,
          fontSize: '0.875rem',
          whiteSpace: 'nowrap',
          ...sx,
        }}
      >
        <Box
          component="span"
          sx={{
            display: hideLabelOnMobile
              ? { xs: 'none', sm: 'inline' }
              : 'inline',
          }}
        >
          {label}
        </Box>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        BackdropProps={{
          invisible: true,
          sx: { backgroundColor: 'transparent !important' },
        }}
      >
        {items.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              item.onClick?.();
              handleClose();
            }}
          >
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: 1 }}
            >
              {item.icon}
              <Typography variant="body2">{item.label}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default DropdownButton;
