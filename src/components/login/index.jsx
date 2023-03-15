import  React, {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import LinkMu from '@mui/material/Link';
import {Link} from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { genericPostService } from "../../api/externalServices";
import BackdropLoader from "../common/backdroploader";
import { useDispatch  } from 'react-redux'
import { login, setSelectedChurch } from '../../features/user/userSlice'
import { useNavigate } from "react-router-dom";
import { B2C_BASE_URL } from '../../constants';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <LinkMu color="inherit" href="/">
        B2C-APP
      </LinkMu>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const requiredFields =  [
  "email",
  "password"
];

const theme = createTheme();

function Login() {

  const BASE_URL = B2C_BASE_URL;

  let navigate = useNavigate();
  const dispatch = useDispatch();

  const initialFormState = {
    user: '',
    pass: ''
  }

  const validationInfo = {
    field: {
      validationMessage: "El campo es requerido"
    }
  };

  const [loginInfo, setLoginInfo] = useState(initialFormState);
  const [missingRequiredFields, setMissingRequiredFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {

    event.preventDefault();

    let missingFields = [];

    for (const [k, v] of Object.entries(loginInfo)) {

      if(v === ""){
        missingFields.push(k);
      }
    }

    if (missingFields.length > 0){
      setMissingRequiredFields(missingFields);
      return;
    } 

    setLoading(true);
    const results = await genericPostService(`${BASE_URL}/login`, loginInfo);
    setLoading(false);

    if (results[0] && results[0].access_token){
      dispatch(
        login({
          userEmail:  loginInfo.user,
          token: results[0].access_token,
          roles: results[0].roles
        })
      );
      
      dispatch(
        setSelectedChurch({
          selectedChurchId:  results[0].churchId,
        })
      );
      
      setErrorMessage("");
      return navigate("/dashboard");

    }
    
    if(results[0] && !results[0].access_token){
      setErrorMessage("Por favor verifique sus credenciales.")
      return;
    }

    if(!results[0]){
      setErrorMessage("Se ha presentado un error, por favor contacte al administrador")
      return;
    }

  };

  const handleFormOnchange = (e) => {
    const { name, value } = e.target

    if(errorMessage.length > 0){
      setErrorMessage("")
    }
    if(value){
      setMissingRequiredFields([])
    }
    setLoginInfo({...loginInfo, [name] : value} );
  }

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

          <BackdropLoader show={loading} message="Validando los datos ingresados" />
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Ingreso al sistema
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              id="user"
              required
              fullWidth
              label="Correo eléctrónico"
              name="user"
              helperText= {missingRequiredFields.indexOf("user") !== -1 ? "El campo es requerido"  : ""}
              error = {missingRequiredFields.indexOf("user") !== -1 ? true: false}
              autoFocus
              onChange={handleFormOnchange}
              value={loginInfo.user}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="pass"
              name="pass"
              label="Contraseña"
              type="password"
              onChange={handleFormOnchange}
              value={loginInfo.pass}
              helperText= {missingRequiredFields.indexOf("pass") !== -1 ? "El campo es requerido"  : ""}
              error = {missingRequiredFields.indexOf("pass") !== -1 ? true: false}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Recordar mis datos"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Ingresar
            </Button>
            <Grid container>
              <Grid item xs>
                <LinkMu href="#" variant="body2">
                  ¿Olvidó la contraseña?
                </LinkMu>
              </Grid>
              <Grid item>
                <Link to="/register" className='text-link'><LinkMu  variant="body2" component={"span"}>Registrarse</LinkMu> </Link> 
              </Grid>
            </Grid>
            <div>
              {errorMessage.length > 0 && <Alert severity="error">{errorMessage}</Alert>}
            </div>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

export default Login;