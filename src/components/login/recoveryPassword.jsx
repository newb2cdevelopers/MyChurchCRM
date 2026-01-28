import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import LinkMu from '@mui/material/Link';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { genericPostService } from '../../api/externalServices';
import BackdropLoader from '../common/backdroploader';
import { useNavigate } from 'react-router-dom';
import { B2C_BASE_URL } from '../../constants';
import { useFormik } from 'formik';
import * as yup from 'yup';

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <LinkMu color="inherit" href="/">
        Sistema de gestión Mi Iglesia
      </LinkMu>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

// Email validation schema
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

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
        setSnackbar({
          open: true,
          message:
            'Si este correo está asociado a una cuenta activa, recibirás instrucciones de recuperación. Revisa tu bandeja de entrada y spam',
          severity: 'success',
        });
        setTimeout(() => navigate('/login'), 5000);
        return;
      }

      // For security reasons, show the same message for all cases (email not found, inactive user, etc.)
      // This prevents user enumeration attacks
      if (results[1]) {
        const backendMessage = results[1].message || '';
        
        // Only show different message for actual system errors (email sending failures)
        if (backendMessage.toLowerCase().includes('send') || 
            (backendMessage.toLowerCase().includes('email') && backendMessage.toLowerCase().includes('fail'))) {
          setSnackbar({ 
            open: true, 
            message: 'No se pudo enviar el correo. Por favor intente nuevamente', 
            severity: 'error' 
          });
          return;
        }

        // For user-not-found, inactive user, etc. - use generic security-focused message
        setSnackbar({
          open: true,
          message: 'Si este correo está asociado a una cuenta activa, recibirás instrucciones de recuperación. Revisa tu bandeja de entrada y spam',
          severity: 'info',
        });
        setTimeout(() => navigate('/login'), 5000);
        return;
      }

      // Network or unexpected errors
      setSnackbar({
        open: true,
        message:
          'No se pudo procesar la solicitud. Por favor verifique su conexión e intente nuevamente',
        severity: 'error',
      });
    },
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <BackdropLoader
            show={loading}
            message="Enviando solicitud de recuperación..."
          />
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Restablecer contraseña
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, textAlign: 'center' }}
          >
            Ingresa tu correo electrónico y te enviaremos un enlace para
            restablecer tu contraseña
          </Typography>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{ mt: 3 }}
          >
            <TextField
              margin="normal"
              id="email"
              required
              fullWidth
              label="Correo electrónico"
              name="email"
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
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Enviar enlace de recuperación
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link to="/login" className="text-link">
                  <LinkMu component={'span'} variant="body2">
                    Volver al inicio de sesión
                  </LinkMu>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default RecoveryPassword;
