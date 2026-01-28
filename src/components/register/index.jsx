import React, {useState, useEffect} from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Link} from "react-router-dom";
import LinkMu from '@mui/material/Link';
import { genericGetService, genericPostService } from "../../api/externalServices";
import  AutoCompleteSearch from './autoCompleteSearch';
import BackdropLoader from "../common/backdroploader";
import { useFormik } from 'formik';
import { B2C_BASE_URL } from '../../constants';
import { useNavigate } from "react-router-dom";
import * as yup from 'yup';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useDispatch } from 'react-redux';
import { login, setSelectedChurch } from '../../features/user/userSlice';
import * as tokenService from '../../services/tokenService';

const theme = createTheme();

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
  names: yup
    .string()
    .required('Este campo es obligatorio'),
  lastNames: yup
    .string()
    .required('Este campo es obligatorio'),
    selectedChurchId: yup
    .string().required('Debe seleccionar una iglesia'),
  passwordConfirm: yup
    .string().when("password", {
      is: val => (val && val.length > 0 ? true : false),
      then: yup.string().oneOf(
        [yup.ref("password")],
        "La contraseña no coincide"
      )
    })
    
});

function Register() {
  const BASE_URL = B2C_BASE_URL;
  const [loading, setLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState("");
  const [churches, setChurches] = useState([]);
  const [selectedChurchId, setSelectedChurchId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowPasswordConfirm = () => setShowPasswordConfirm(!showPasswordConfirm);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      names:'',
      lastNames: '',
      selectedChurchId: ""
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {

      var payload = {
        email: values.email.toLowerCase(),
        name: values.names,
        lastName: values.lastNames,
        password: values.password,
        churchId: values.selectedChurchId
      };

      setLoading(true);
      const results = await genericPostService(`${BASE_URL}/user`, payload);
      setLoading(false);
      
      if(results[0] && results[0].access_token){
        // Save tokens (default to sessionStorage for security, similar to login without "remember me")
        tokenService.setTokens(
          results[0].access_token, 
          results[0].refresh_token,
          false // Don't persist in localStorage by default
        );
        
        // Save user email in session
        sessionStorage.setItem('userEmail', values.email.toLowerCase());
        
        // Dispatch login action to Redux
        dispatch(
          login({
            userEmail: values.email.toLowerCase(),
            token: results[0].access_token,
            roles: results[0].roles,
            workfront: results[0].workfront,
          })
        );

        // Set selected church
        dispatch(
          setSelectedChurch({
            selectedChurchId: results[0].churchId,
          })
        );

        // Show success message and redirect to dashboard
        setSnackbar({
          open: true,
          message: 'Usuario registrado exitosamente. Bienvenido!',
          severity: 'success',
        });
        
        setTimeout(() => navigate("/dashboard"), 1500);
        return;
      }
      
      // Handle errors
      if(results[1]) {
        const backendMessage = results[1].message || '';
        const statusCode = results[1].statusCode;
        
        let errorMsg = '';
        
        if (statusCode === 409 || backendMessage.toLowerCase().includes('already registered') || 
            backendMessage.toLowerCase().includes('already exists')) {
          errorMsg = 'Este correo electrónico ya está registrado. Por favor inicia sesión o usa otro correo';
        } else if (backendMessage.toLowerCase().includes('validation') || statusCode === 400) {
          errorMsg = 'Por favor verifica que todos los campos estén correctamente llenados';
        } else {
          errorMsg = 'Se ha presentado un error registrando el usuario. Por favor intente nuevamente';
        }
        
        setSnackbar({
          open: true,
          message: errorMsg,
          severity: 'error',
        });
      }
    },
  });


  useEffect(()=>{
    const loadChurches =  async () => {
      const results = await genericGetService(`${BASE_URL}/church`)
      setLoading(false)
      if(results[1]){
        setErrorInfo("Se ha presentado un error cargando las iglesias.")
        return 
      }
      setChurches(results[0]);
    };
    loadChurches()
  }, [BASE_URL])

  useEffect(() =>{
    if(selectedChurchId){
      formik.setFieldValue('selectedChurchId', selectedChurchId._id);
    }else{
      formik.setFieldValue('selectedChurchId', '');
    }
  },[selectedChurchId, formik]);

  return errorInfo !== "" ? <div>{errorInfo}</div> :  (
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
           <BackdropLoader show={loading} message="Espere un momento" />
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Registrarse
          </Typography>
          <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="names"
                  required
                  fullWidth
                  id="names"
                  label="Nombres"
                  autoFocus
                  value={formik.values.names}
                  onChange={formik.handleChange}
                  error={formik.touched.names && Boolean(formik.errors.names)}
                  helperText={formik.touched.names && formik.errors.names}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastNames"
                  name="lastNames"
                  label="Apellidos"
                  value={formik.values.lastNames}
                  onChange={formik.handleChange}
                  error={formik.touched.lastNames && Boolean(formik.errors.lastNames)}
                  helperText={formik.touched.lastNames && formik.errors.lastNames}
                />
              </Grid>
              <Grid item xs={12}>
                <Box component="span" className='error'>
                  <AutoCompleteSearch
                   setSelectedChurchId={setSelectedChurchId}
                   error={formik.touched.selectedChurchId && Boolean(formik.errors.selectedChurchId)}
                   helperText={formik.touched.selectedChurchId && formik.errors.selectedChurchId}
                  items={churches}/>
                </Box>
               </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Correo electrónico"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
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
                  onBlur={formik.handleBlur}
                  error={formik.touched.passwordConfirm && Boolean(formik.errors.passwordConfirm)}
                  helperText={formik.touched.passwordConfirm && formik.errors.passwordConfirm}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password confirm visibility"
                          onClick={handleClickShowPasswordConfirm}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPasswordConfirm ? <Visibility /> : <VisibilityOff />}
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
              Registrarse
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login" className='text-link'><LinkMu component={"span"}  variant="body2">Ingresar</LinkMu> </Link> 
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

export default Register;
