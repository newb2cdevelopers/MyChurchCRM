import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import showToast from '../../customComponents/toast/showToast';
import { useFormik } from 'formik';
import * as yup from 'yup';

import {
  genericGetService,
  genericPostService,
} from '../../api/externalServices';
import AutoCompleteSearch from './autoCompleteSearch';
import BackdropLoader from '../common/backdroploader';
import { B2C_BASE_URL, DOCUMENT_TYPES } from '../../constants';
import Button from '../../customComponents/button';
import TextField from '../shared/TextField';
import Select from '../shared/Select';
import MenuItem from '@mui/material/MenuItem';
import PasswordField from '../shared/PasswordField';
import PublicHeader from '../shared/PublicHeader';

const validationSchema = yup.object({
  email: yup
    .string('Ingrese el correo')
    .email('Ingrese un email válido')
    .required('El correo es obligatorio'),
  password: yup
    .string('Ingresa la contraseña')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)',
    )
    .required('La contraseña es obligatoria'),
  names: yup.string().required('Este campo es obligatorio'),
  lastNames: yup.string().required('Este campo es obligatorio'),
  selectedChurchId: yup.string().required('Debe seleccionar una iglesia'),
  documentType: yup.string().required('El tipo de documento es obligatorio'),
  documentNumber: yup
    .string()
    .required('El número de documento es obligatorio'),
  passwordConfirm: yup.string().when('password', {
    is: val => (val && val.length > 0 ? true : false),
    then: yup
      .string()
      .oneOf([yup.ref('password')], 'La contraseña no coincide'),
  }),
});

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

function Register() {
  const BASE_URL = B2C_BASE_URL;
  const [loading, setLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState('');
  const [churches, setChurches] = useState([]);
  const [selectedChurchId, setSelectedChurchId] = useState('');

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      names: '',
      lastNames: '',
      documentType: '',
      documentNumber: '',
      selectedChurchId: '',
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      var payload = {
        email: values.email.toLowerCase(),
        name: values.names,
        lastName: values.lastNames,
        documentType: values.documentType,
        documentNumber: values.documentNumber,
        password: values.password,
        churchId: values.selectedChurchId,
      };

      setLoading(true);
      const results = await genericPostService(`${BASE_URL}/user`, payload);
      setLoading(false);

      if (results[0] && !results[1]) {
        showToast.success(
          'Registro exitoso',
          'Usuario registrado exitosamente. Su cuenta está pendiente de activación.',
        );

        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      if (results[1]) {
        const backendMessage = results[1].message || '';
        const statusCode = results[1].statusCode;

        let errorMsg = '';

        if (
          statusCode === 409 ||
          backendMessage.toLowerCase().includes('already registered') ||
          backendMessage.toLowerCase().includes('already exists')
        ) {
          errorMsg =
            'Este correo electrónico ya está registrado. Por favor inicia sesión o usa otro correo';
        } else if (
          backendMessage.toLowerCase().includes('validation') ||
          statusCode === 400
        ) {
          errorMsg =
            'Por favor verifica que todos los campos estén correctamente llenados';
        } else {
          errorMsg =
            'Se ha presentado un error registrando el usuario. Por favor intente nuevamente';
        }

        showToast.error('Error', errorMsg);
      }
    },
  });

  useEffect(() => {
    const loadChurches = async () => {
      const results = await genericGetService(`${BASE_URL}/church`);
      setLoading(false);
      if (results[1]) {
        setErrorInfo('Se ha presentado un error cargando las iglesias.');
        return;
      }
      setChurches(results[0]);
    };
    loadChurches();
  }, [BASE_URL]);

  useEffect(() => {
    if (selectedChurchId) {
      formik.setFieldValue('selectedChurchId', selectedChurchId._id);
    } else {
      formik.setFieldValue('selectedChurchId', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChurchId]);

  return errorInfo !== '' ? (
    <div>{errorInfo}</div>
  ) : (
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
      <BackdropLoader show={loading} message="Espere un momento" />

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
              Registrarse
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Crea tu cuenta para empezar
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
              <Box
                sx={{
                  display: 'flex',
                  gap: { xs: 2.5, sm: 3 },
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <TextField
                  name="names"
                  required
                  label="Nombres"
                  autoFocus
                  value={formik.values.names}
                  onChange={formik.handleChange}
                  error={formik.touched.names && Boolean(formik.errors.names)}
                  helperText={formik.touched.names && formik.errors.names}
                />
                <TextField
                  required
                  name="lastNames"
                  label="Apellidos"
                  value={formik.values.lastNames}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.lastNames && Boolean(formik.errors.lastNames)
                  }
                  helperText={
                    formik.touched.lastNames && formik.errors.lastNames
                  }
                />
              </Box>

              <Select
                label="Tipo de documento"
                value={formik.values.documentType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="documentType"
                error={
                  formik.touched.documentType &&
                  Boolean(formik.errors.documentType)
                }
                helperText={
                  formik.touched.documentType && formik.errors.documentType
                }
                size="medium"
                required
              >
                <MenuItem value="">
                  <em>Seleccione...</em>
                </MenuItem>
                {DOCUMENT_TYPES.map(dt => (
                  <MenuItem key={dt.value} value={dt.value}>
                    {dt.label}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                required
                name="documentNumber"
                label="Número de documento"
                value={formik.values.documentNumber}
                onChange={formik.handleChange}
                error={
                  formik.touched.documentNumber &&
                  Boolean(formik.errors.documentNumber)
                }
                helperText={
                  formik.touched.documentNumber && formik.errors.documentNumber
                }
              />

              <AutoCompleteSearch
                setSelectedChurchId={setSelectedChurchId}
                error={
                  formik.touched.selectedChurchId &&
                  Boolean(formik.errors.selectedChurchId)
                }
                helperText={
                  formik.touched.selectedChurchId &&
                  formik.errors.selectedChurchId
                }
                items={churches}
              />

              <TextField
                required
                name="email"
                label="Correo electrónico"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />

              <PasswordField
                required
                name="password"
                label="Contraseña"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />

              <PasswordField
                required
                name="passwordConfirm"
                label="Confirmar contraseña"
                value={formik.values.passwordConfirm}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.passwordConfirm &&
                  Boolean(formik.errors.passwordConfirm)
                }
                helperText={
                  formik.touched.passwordConfirm &&
                  formik.errors.passwordConfirm
                }
              />

              <Button
                type="submit"
                fullWidth
                size="large"
                sx={{ py: 1.75, fontSize: 14, letterSpacing: '0.02em' }}
              >
                Registrarse
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  ¿Ya tienes una cuenta?{' '}
                  <Link
                    component={RouterLink}
                    to="/login"
                    sx={{ fontWeight: 500, color: 'primary.main' }}
                    underline="hover"
                  >
                    Ingresar
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

export default Register;
