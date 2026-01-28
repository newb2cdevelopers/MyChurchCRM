import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import LinkMu from '@mui/material/Link';
import { genericPostService } from '../../api/externalServices';
import BackdropLoader from '../common/backdroploader';
import { useFormik } from 'formik';
import { B2C_BASE_URL } from '../../constants';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const theme = createTheme();

// Password validation schema synced with backend requirements
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

// Function to calculate password strength
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

// Function to get color based on strength
const getStrengthColor = strength => {
  if (strength < 40) return 'error';
  if (strength < 70) return 'warning';
  return 'success';
};

// Function to get text based on strength
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
  }, []); // Fixed: added empty dependency array

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

      // Specific error handling from backend
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

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowPasswordConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <BackdropLoader show={loading} message="Actualizando contraseña..." />
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Asignar nueva contraseña
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, textAlign: 'center' }}
          >
            La contraseña debe tener al menos 8 caracteres e incluir mayúsculas,
            minúsculas, números y caracteres especiales
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={formik.handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Nueva contraseña"
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
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {formik.values.password && (
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Fuerza:
                      </Typography>
                      <Typography
                        variant="caption"
                        color={`${getStrengthColor(passwordStrength)}.main`}
                        sx={{ fontWeight: 'bold' }}
                      >
                        {getStrengthText(passwordStrength)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={passwordStrength}
                      color={getStrengthColor(passwordStrength)}
                      sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
                    />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="passwordConfirm"
                  label="Confirmar contraseña"
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
                          onClick={handleClickShowPasswordConfirm}
                          edge="end"
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
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Restablecer contraseña
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

export default CreateNewPassword;
