import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '../../customComponents/button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link as RouterLink } from 'react-router-dom';
import { genericPostService } from '../../api/externalServices';
import BackdropLoader from '../common/backdroploader';
import { useDispatch } from 'react-redux';
import { login, setSelectedChurch } from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { B2C_BASE_URL } from '../../constants';
import * as tokenService from '../../services/tokenService';

function Copyright() {
  return (
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
  );
}

function Login() {
  const BASE_URL = B2C_BASE_URL;
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const initialFormState = {
    user: '',
    pass: '',
  };

  const [loginInfo, setLoginInfo] = useState(initialFormState);
  const [missingRequiredFields, setMissingRequiredFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();

    let missingFields = [];

    for (const [k, v] of Object.entries(loginInfo)) {
      if (v === '') {
        missingFields.push(k);
      }
    }

    if (missingFields.length > 0) {
      setMissingRequiredFields(missingFields);
      return;
    }

    setLoading(true);
    const loginPayload = {
      user: loginInfo.user.toLowerCase(),
      pass: loginInfo.pass,
    };
    const results = await genericPostService(`${BASE_URL}/login`, loginPayload);
    setLoading(false);

    if (results[0] && results[0].access_token) {
      tokenService.setTokens(
        results[0].access_token,
        results[0].refresh_token,
        rememberMe,
      );

      if (rememberMe) {
        localStorage.setItem('userEmail', loginInfo.user);
      } else {
        sessionStorage.setItem('userEmail', loginInfo.user);
      }

      dispatch(
        login({
          userEmail: loginInfo.user,
          token: results[0].access_token,
          roles: results[0].roles,
          workfront: results[0].workfront,
        }),
      );

      dispatch(
        setSelectedChurch({
          selectedChurchId: results[0].churchId,
        }),
      );

      setErrorMessage('');
      return navigate('/dashboard');
    }

    if (results[0] && !results[0].access_token) {
      setErrorMessage('Por favor verifique sus credenciales.');
      return;
    }

    if (!results[0]) {
      setErrorMessage(
        'Se ha presentado un error, por favor contacte al administrador',
      );
      return;
    }
  };

  const handleFormOnchange = e => {
    const { name, value } = e.target;

    if (errorMessage.length > 0) {
      setErrorMessage('');
    }
    if (value) {
      setMissingRequiredFields([]);
    }
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const handleRememberMeChange = event => {
    setRememberMe(event.target.checked);
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
      <BackdropLoader show={loading} message="Validando los datos ingresados" />

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

        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Link
            component={RouterLink}
            to="/manageBookings"
            underline="none"
            sx={{
              fontSize: 14,
              fontWeight: 500,
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
            }}
          >
            Gestionar Mis Reservas
          </Link>
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
              Ingreso al sistema
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bienvenido de nuevo
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate>
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
                id="user"
                name="user"
                label="Correo electrónico"
                placeholder="nombre@ejemplo.com"
                autoFocus
                value={loginInfo.user}
                onChange={handleFormOnchange}
                error={missingRequiredFields.indexOf('user') !== -1}
                helperText={
                  missingRequiredFields.indexOf('user') !== -1
                    ? 'El campo es requerido'
                    : ''
                }
              />

              <Box>
                <TextField
                  required
                  fullWidth
                  id="pass"
                  name="pass"
                  label="Contraseña"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={loginInfo.pass}
                  onChange={handleFormOnchange}
                  error={missingRequiredFields.indexOf('pass') !== -1}
                  helperText={
                    missingRequiredFields.indexOf('pass') !== -1
                      ? 'El campo es requerido'
                      : ''
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}
                >
                  <Link
                    component={RouterLink}
                    to="/recoveryPassword"
                    variant="caption"
                    sx={{ fontWeight: 500, color: 'primary.main' }}
                    underline="hover"
                  >
                    ¿Olvidó la contraseña?
                  </Link>
                </Box>
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    color="primary"
                    size="small"
                  />
                }
                label={
                  <Typography variant="caption" color="text.secondary">
                    Recordar mis datos
                  </Typography>
                }
              />

              <Button
                type="submit"
                fullWidth
                size="large"
                sx={{ py: 1.75, fontSize: 14, letterSpacing: '0.02em' }}
              >
                INGRESAR
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  ¿No tienes una cuenta?{' '}
                  <Link
                    component={RouterLink}
                    to="/register"
                    sx={{ fontWeight: 500, color: 'primary.main' }}
                    underline="hover"
                  >
                    Registrarse
                  </Link>
                </Typography>
              </Box>
            </Box>

            {errorMessage.length > 0 && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {errorMessage}
              </Alert>
            )}
          </Box>
        </Box>
      </Box>

      <Copyright />
    </Box>
  );
}

export default Login;
