import React, { useState,useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import LinkMu from '@mui/material/Link';
import { Link } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { genericPostService } from "../../api/externalServices";
import BackdropLoader from "../common/backdroploader";
import { useDispatch } from 'react-redux'
import { login, setSelectedChurch } from '../../features/user/userSlice'
import { useNavigate } from "react-router-dom";
import { B2C_BASE_URL } from '../../constants';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <LinkMu color="inherit" href="/">
        Sistema de gestión Mi Igleisa
      </LinkMu>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const requiredFields = [
  "email",
  "password"
];

const theme = createTheme();

function RecoveryPassword() {

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
  const [email, setEmail] = useState("");
  

  const handleSubmit = async (event) => {

    event.preventDefault();

    setLoading(true);

    const results = await genericPostService(`${BASE_URL}/login/generateTokenForRecovery`, {
      "email": email
    });
    setLoading(false);

    if (results[0] && results[0].isSuccessful) {
      setErrorMessage("Se ha enviado un correo para el restablecimiento de su contraseña, por revise su bandeja de entrada.")
      return navigate("/login");
    }

    if (results[0] && !results[0].isSuccessful) {
      setErrorMessage("Se ha presentado un error, por favor contacte al administrador")
      return;
    }

    if (!results[0]) {
      setErrorMessage("Se ha presentado un error, por favor contacte al administrador")
      return;
    }

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

          <BackdropLoader show={loading} message="Validando los datos ingresados" />
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Restablecer contraseña
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              id="user"
              required
              fullWidth
              label="Correo eléctrónico"
              name="user"
              helperText={email === "" ? "El campo es requerido" : ""}
              error={email === "" ? true : false}
              autoFocus
              onChange={(e) => (setEmail(e.target.value))}
              value={email}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Enviar
            </Button>
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

export default RecoveryPassword;