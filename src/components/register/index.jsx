import React, {useState, useEffect} from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
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

const theme = createTheme();

const validationSchema = yup.object({
  email: yup
    .string('Ingrese el correo')
    .email('Ingrese un email válido')
    .required('El correo es obligatorio'),
  password: yup
    .string('Ingresa la contraseña')
    .min(2, 'La contraseña debe tener al menos 2 caracteres')
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

  let navigate = useNavigate();
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
      
      if(results[0]){
        return navigate("/login");
      }else{
        alert("Se ha presentado un error registrando el usuario")
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

  }, [])

  useEffect(() =>{
    if(selectedChurchId){
      formik.values.selectedChurchId = selectedChurchId._id;
    }else{
      formik.values.selectedChurchId = "";
    }
  },[selectedChurchId]);

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
                  type="password"
                  id="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="passwordConfirm"
                  label="Confirmar contraseña"
                  type="password"
                  id="passwordConfirm"
                  value={formik.values.passwordConfirm}
                  onChange={formik.handleChange}
                  error={formik.touched.passwordConfirm && Boolean(formik.errors.passwordConfirm)}
                  helperText={formik.touched.passwordConfirm && formik.errors.passwordConfirm}
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
      </Container>
    </ThemeProvider>
  );
}

export default Register;
