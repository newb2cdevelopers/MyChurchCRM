import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Link as RouterLink } from 'react-router-dom';
import Button from '../../customComponents/button';
import PublicHeader from '../shared/PublicHeader';

function NotFound() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background:
          'radial-gradient(at 0% 0%, hsla(253,100%,95%,1) 0px, transparent 50%), radial-gradient(at 100% 0%, hsla(225,100%,95%,1) 0px, transparent 50%), radial-gradient(at 100% 100%, hsla(253,100%,97%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(225,100%,97%,1) 0px, transparent 50%)',
        backgroundColor: '#faf8ff',
      }}
    >
      <PublicHeader />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          pt: '80px',
          pb: 6,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '440px',
            bgcolor: 'background.paper',
            borderRadius: '16px',
            boxShadow:
              '0 0 0 1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.025)',
            border: '1px solid',
            borderColor: 'divider',
            p: { xs: 3, sm: 5 },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: theme =>
                `linear-gradient(90deg, transparent, ${theme.palette.primary.main}4D, transparent)`,
            }}
          />

          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                borderRadius: '16px',
                bgcolor: 'rgba(94, 57, 224, 0.1)',
                color: 'primary.main',
                mb: 3,
              }}
            >
              <ErrorOutlineIcon sx={{ fontSize: 28 }} />
            </Box>
            <Typography
              variant="h2"
              sx={{ fontWeight: 700, mb: 1, fontSize: '3rem' }}
            >
              404
            </Typography>
            <Typography variant="h3" sx={{ mb: 2 }}>
              Página no encontrada
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              La página que buscas no existe o ha sido movida.
            </Typography>
            <Button
              component={RouterLink}
              to="/"
              fullWidth
              size="large"
              sx={{ py: 1.75, fontSize: 14, letterSpacing: '0.02em' }}
            >
              Volver al inicio
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="caption" color="text.secondary">
          {'Copyright © '}
          <Link color="inherit" href="/" underline="hover">
            Sistema de gestión Mi Iglesia
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Box>
    </Box>
  );
}

export default NotFound;
