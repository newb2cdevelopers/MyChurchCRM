import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '../../customComponents/button';
import BackdropLoader from '../common/backdroploader';
import showToast from '../../customComponents/toast/showToast';
import { genericPostService } from '../../api/externalServices';
import { B2C_BASE_URL } from '../../constants';

const validationSchema = yup.object({
  email: yup
    .string('Ingresa tu correo electrónico')
    .email('Ingresa un correo electrónico válido')
    .required('El correo electrónico es obligatorio'),
});

function RecoveryPassword() {
  const BASE_URL = B2C_BASE_URL;
  let navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      setLoading(true);

      const results = await genericPostService(
        `${BASE_URL}/login/generateTokenForRecovery`,
        {
          email: values.email.toLowerCase(),
        },
      );
      setLoading(false);

      if (results[0] && results[0].isSuccessful) {
        showToast.success(
          'Solicitud enviada',
          'Si este correo está asociado a una cuenta activa, recibirás instrucciones de recuperación. Revisa tu bandeja de entrada y spam',
        );
        setTimeout(() => navigate('/login'), 5000);
        return;
      }

      if (results[1]) {
        const backendMessage = results[1].message || '';

        if (
          backendMessage.toLowerCase().includes('send') ||
          (backendMessage.toLowerCase().includes('email') &&
            backendMessage.toLowerCase().includes('fail'))
        ) {
          showToast.error(
            'Error al enviar',
            'No se pudo enviar el correo. Por favor intente nuevamente',
          );
          return;
        }

        showToast.info(
          'Solicitud enviada',
          'Si este correo está asociado a una cuenta activa, recibirás instrucciones de recuperación. Revisa tu bandeja de entrada y spam',
        );
        setTimeout(() => navigate('/login'), 5000);
        return;
      }

      showToast.error(
        'Error de conexión',
        'No se pudo procesar la solicitud. Por favor verifique su conexión e intente nuevamente',
      );
    },
  });

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
      <BackdropLoader
        show={loading}
        message="Enviando solicitud de recuperación..."
      />

      <Box
        component="nav"
        sx={{
          width: '100%',
          px: { xs: 3, md: 6 },
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'fixed',
          top: 0,
          zIndex: 50,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              letterSpacing: '-0.02em',
            }}
          >
            SISTEMA DE GESTIÓN MI IGLESIA
          </Typography>
        </Box>
      </Box>

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

          <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 5 } }}>
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
              <LockOutlinedIcon sx={{ fontSize: 28 }} />
            </Box>
            <Typography variant="h3" sx={{ mb: 1 }}>
              Restablecer contraseña
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ingresa tu correo electrónico y te enviaremos un enlace para
              restablecer tu contraseña
            </Typography>
          </Box>

          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 2.5, sm: 3 },
              }}
            >
              <TextField
                required
                fullWidth
                id="email"
                name="email"
                label="Correo electrónico"
                placeholder="nombre@ejemplo.com"
                autoComplete="email"
                autoFocus
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />

              <Button
                type="submit"
                fullWidth
                size="large"
                sx={{ py: 1.75, fontSize: 14, letterSpacing: '0.02em' }}
              >
                Enviar enlace de recuperación
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Link
                  component={RouterLink}
                  to="/login"
                  variant="caption"
                  sx={{ fontWeight: 500, color: 'primary.main' }}
                  underline="hover"
                >
                  Volver al inicio de sesión
                </Link>
              </Box>
            </Box>
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

export default RecoveryPassword;
