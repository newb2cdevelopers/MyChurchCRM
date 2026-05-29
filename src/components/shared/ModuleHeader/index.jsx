import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function ModuleHeader({ title, description, primaryAction, actions, sx }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: { xs: 2, sm: 4 },
        mb: { xs: 2, md: 4 },
        ...sx,
      }}
    >
      <Box sx={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            lineHeight: 1.2,
            textAlign: 'left',
            wordBreak: 'break-word',
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography
            variant="body2"
            color="text.primary"
            sx={{
              mt: 0.5,
              opacity: 0.7,
              fontWeight: 500,
              textAlign: 'left',
              width: '100%',
              display: 'block',
              wordBreak: 'break-word',
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      {(primaryAction || actions) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexShrink: 0,
            flexWrap: 'wrap',
            alignSelf: { xs: 'stretch', sm: 'auto' },
          }}
        >
          {actions}
          {primaryAction &&
            (typeof primaryAction === 'object' && 'label' in primaryAction ? (
              <Button
                variant="contained"
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled}
                startIcon={primaryAction.icon || null}
                sx={{ py: 1, px: 2.5, whiteSpace: 'nowrap' }}
              >
                {primaryAction.label}
              </Button>
            ) : (
              primaryAction
            ))}
        </Box>
      )}
    </Box>
  );
}

export default ModuleHeader;
