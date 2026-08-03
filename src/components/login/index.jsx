import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '../../customComponents/button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import showToast from '../../customComponents/toast/showToast';
import { Link as RouterLink } from 'react-router-dom';
import { genericPostService } from '../../api/externalServices';
import BackdropLoader from '../common/backdroploader';
import { useDispatch } from 'react-redux';
import { login, setSelectedChurch } from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { B2C_BASE_URL } from '../../constants';
import * as tokenService from '../../services/tokenService';
import TextField from '../shared/TextField';
import PasswordField from '../shared/PasswordField';
import PublicHeader from '../shared/PublicHeader';

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
      user: loginInfo.user.includes('@')
        ? loginInfo.user.toLowerCase()
        : loginInfo.user,
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
        localStorage.setItem('userEmail', results[0].email);
      } else {
        sessionStorage.setItem('userEmail', results[0].email);
      }

      dispatch(
        login({
          userEmail: results[0].email,
          token: results[0].access_token,
          roles: results[0].roles,
          workfront: results[0].workfront,
          zoneId: results[0].zoneId,
          churchName: results[0].churchName,
        }),
      );

      dispatch(
        setSelectedChurch({
          selectedChurchId: results[0].churchId,
        }),
      );

      return navigate('/dashboard');
    }

    const error = results[1];
    const message =
      error?.statusCode === 401
        ? 'Por favor verifique sus credenciales.'
        : 'Se ha presentado un error, por favor contacte al administrador';
    showToast.error('Error', message);
  };

  const handleFormOnchange = e => {
    const { name, value } = e.target;

    if (value) {
      setMissingRequiredFields([]);
    }
    setLoginInfo({ ...loginInfo, [name]: value });
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
                id="user"
                name="user"
                label="Correo electrónico o Número de documento"
                placeholder="nombre@ejemplo.com o 123456789"
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
                <PasswordField
                  required
                  id="pass"
                  name="pass"
                  label="Contraseña"
                  placeholder="••••••••"
                  value={loginInfo.pass}
                  onChange={handleFormOnchange}
                  error={missingRequiredFields.indexOf('pass') !== -1}
                  helperText={
                    missingRequiredFields.indexOf('pass') !== -1
                      ? 'El campo es requerido'
                      : ''
                  }
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
          </Box>
        </Box>
      </Box>

      <Copyright />
    </Box>
  );
}

export default Login;
