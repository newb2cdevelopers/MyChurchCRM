import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import EventIcon from '@mui/icons-material/Event';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedChurch } from '../../features/user/userSlice';
import { genericGetService } from '../../api/externalServices';
import AutoCompleteSearch from '../register/autoCompleteSearch';
import PromotionalEvents from '../promotionalEvents';
import { B2C_BASE_URL } from '../../constants';
import Button from '../../customComponents/button';
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

function PublicEvents() {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const BASE_URL = B2C_BASE_URL;

  const [churches, setChurches] = useState([]);
  const [localSelection, setLocalSelection] = useState(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const hasChurch = user.selectedChurchId && user.selectedChurchId !== '';

  useEffect(() => {
    if (!hasChurch) {
      const loadChurches = async () => {
        const results = await genericGetService(`${BASE_URL}/church`);
        if (results[1]) {
          setError(true);
          setErrorMessage('Se ha presentado un error cargando las iglesias.');
          return;
        }
        setChurches(results[0]);
      };
      loadChurches();
    }
  }, [BASE_URL, hasChurch]);

  useEffect(() => {
    if (localSelection) {
      setError(false);
      setErrorMessage('');
    }
  }, [localSelection]);

  const handleContinue = () => {
    if (!localSelection) {
      setError(true);
      setErrorMessage('Debe seleccionar una iglesia.');
      return;
    }
    dispatch(setSelectedChurch({ selectedChurchId: localSelection._id }));
  };

  const handleChangeChurch = () => {
    dispatch(setSelectedChurch({ selectedChurchId: '' }));
    setLocalSelection(null);
  };

  const gradientBg = {
    background:
      'radial-gradient(at 0% 0%, hsla(253,100%,95%,1) 0px, transparent 50%), radial-gradient(at 100% 0%, hsla(225,100%,95%,1) 0px, transparent 50%), radial-gradient(at 100% 100%, hsla(253,100%,97%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(225,100%,97%,1) 0px, transparent 50%)',
    backgroundColor: '#faf8ff',
  };

  if (hasChurch) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          ...gradientBg,
        }}
      >
        <PublicHeader>
          <Link
            component="button"
            onClick={handleChangeChurch}
            underline="hover"
            sx={{
              fontSize: 14,
              fontWeight: 500,
              color: 'primary.main',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              fontFamily: 'inherit',
            }}
          >
            Cambiar iglesia
          </Link>
          {!user.userEmail && (
            <Link
              component={RouterLink}
              to="/login"
              underline="none"
              sx={{
                fontSize: 14,
                fontWeight: 500,
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Iniciar sesión
            </Link>
          )}
        </PublicHeader>

        <Box component="main" sx={{ flexGrow: 1, py: 6, px: { xs: 3, md: 6 } }}>
          <PromotionalEvents />
        </Box>

        <Copyright />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        ...gradientBg,
      }}
    >
      <PublicHeader>
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
          Reservas
        </Link>
        <Link
          component={RouterLink}
          to="/company-directory"
          underline="none"
          sx={{
            fontSize: 14,
            fontWeight: 500,
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' },
          }}
        >
          Directorio
        </Link>
        <Button component={RouterLink} to="/login" size="small" sx={{ ml: 2 }}>
          Ingresar
        </Button>
      </PublicHeader>

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
              <EventIcon sx={{ fontSize: 28 }} />
            </Box>
            <Typography variant="h3" sx={{ mb: 1 }}>
              Explorar eventos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Selecciona una iglesia para ver sus eventos
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 2.5, sm: 3 },
            }}
          >
            <AutoCompleteSearch
              setSelectedChurchId={setLocalSelection}
              error={error}
              helperText={errorMessage}
              items={churches}
            />

            <Button
              fullWidth
              size="large"
              disabled={!localSelection}
              onClick={handleContinue}
              sx={{ py: 1.75, fontSize: 14, letterSpacing: '0.02em' }}
            >
              Continuar
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link
                component={RouterLink}
                to="/"
                variant="caption"
                sx={{ fontWeight: 500, color: 'primary.main' }}
                underline="hover"
              >
                Volver al inicio
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>

      <Copyright />
    </Box>
  );
}

export default PublicEvents;
