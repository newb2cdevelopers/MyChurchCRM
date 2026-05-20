import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '../../customComponents/button';
import BackdropLoader from '../common/backdroploader';
import { genericPostService } from '../../api/externalServices';
import { B2C_BASE_URL } from '../../constants';

const validationSchema = yup.object({
  password: yup
    .string('Ingresa la contraseña')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)',
    )
    .required('La contraseña es obligatoria'),
  passwordConfirm: yup.string().when('password', {
    is: val => (val && val.length > 0 ? true : false),
    then: yup
      .string()
      .oneOf([yup.ref('password')], 'La contraseña no coincide'),
  }),
});

const calculatePasswordStrength = password => {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (password.length >= 12) strength += 15;
  if (/[a-z]/.test(password)) strength += 15;
  if (/[A-Z]/.test(password)) strength += 15;
  if (/\d/.test(password)) strength += 15;
  if (/[@$!%*?&]/.test(password)) strength += 15;
  return Math.min(strength, 100);
};

const getStrengthColor = strength => {
  if (strength < 40) return 'error';
  if (strength < 70) return 'warning';
  return 'success';
};

const getStrengthText = strength => {
  if (strength === 0) return '';
  if (strength < 40) return 'Débil';
  if (strength < 70) return 'Media';
  return 'Fuerte';
};

function CreateNewPassword() {
  const BASE_URL = B2C_BASE_URL;
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [token, setToken] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get('token_id'));
  }, []);

  let navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      password: '',
      passwordConfirm: '',
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      var payload = {
        newPassword: values.password,
      };

      setLoading(true);
      const results = await genericPostService(
        `${BASE_URL}/login/recoveryPassword?token_id=${token}`,
        payload,
      );
      setLoading(false);

      if (results[0] && results[0].isSuccessful) {
        setSnackbar({
          open: true,
          message: 'Su contraseña ha sido restablecida exitosamente',
          severity: 'success',
        });
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      if (results[1] && results[1].message) {
        const errorMsg =
          results[1].message === 'Invalid or expired token'
            ? 'El enlace de recuperación ha expirado. Por favor solicite uno nuevo'
            : results[1].message === 'User not found'
              ? 'Usuario no encontrado en el sistema'
              : 'Se ha presentado un error al restablecer la contraseña';

        setSnackbar({ open: true, message: errorMsg, severity: 'error' });
        return;
      }

      setSnackbar({
        open: true,
        message: 'Se ha presentado un error. Por favor intente nuevamente',
        severity: 'error',
      });
    },
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePasswordChange = e => {
    const newPassword = e.target.value;
    formik.handleChange(e);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

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
      <BackdropLoader show={loading} message="Actualizando contraseña..." />

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
              Asignar nueva contraseña
            </Typography>
            <Typography variant="body2" color="text.secondary">
              La contraseña debe tener al menos 8 caracteres e incluir
              mayúsculas, minúsculas, números y caracteres especiales
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
                name="password"
                label="Nueva contraseña"
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoFocus
                value={formik.values.password}
                onChange={handlePasswordChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {formik.values.password && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Fuerza:
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 'bold',
                        color: `${getStrengthColor(passwordStrength)}.main`,
                      }}
                    >
                      {getStrengthText(passwordStrength)}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength}
                    color={getStrengthColor(passwordStrength)}
                    sx={{
                      mt: 0.5,
                      height: 6,
                      borderRadius: 3,
                    }}
                  />
                </Box>
              )}

              <TextField
                required
                fullWidth
                name="passwordConfirm"
                label="Confirmar contraseña"
                placeholder="••••••••"
                type={showPasswordConfirm ? 'text' : 'password'}
                id="passwordConfirm"
                value={formik.values.passwordConfirm}
                onChange={formik.handleChange}
                error={
                  formik.touched.passwordConfirm &&
                  Boolean(formik.errors.passwordConfirm)
                }
                helperText={
                  formik.touched.passwordConfirm &&
                  formik.errors.passwordConfirm
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password confirmation visibility"
                        onClick={() =>
                          setShowPasswordConfirm(!showPasswordConfirm)
                        }
                        edge="end"
                        size="small"
                      >
                        {showPasswordConfirm ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                size="large"
                sx={{ py: 1.75, fontSize: 14, letterSpacing: '0.02em' }}
              >
                Restablecer contraseña
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
    </Box>
  );
}

export default CreateNewPassword;
