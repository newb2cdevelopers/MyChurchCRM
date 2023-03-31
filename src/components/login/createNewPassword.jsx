import React, { useState, useEffect } from 'react'
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
import { Link } from "react-router-dom";
import LinkMu from '@mui/material/Link';
import { genericGetService, genericPostService } from "../../api/externalServices";
import BackdropLoader from "../common/backdroploader";
import { useFormik } from 'formik';
import { B2C_BASE_URL } from '../../constants';
import { useNavigate } from "react-router-dom";
import * as yup from 'yup';

const theme = createTheme();

const validationSchema = yup.object({
    password: yup
        .string('Ingresa la contraseña')
        .min(2, 'La contraseña debe tener al menos 2 caracteres')
        .required('La contraseña es obligatoria'),
    passwordConfirm: yup
        .string().when("password", {
            is: val => (val && val.length > 0 ? true : false),
            then: yup.string().oneOf(
                [yup.ref("password")],
                "La contraseña no coincide"
            )
        })

});

function CreateNewPassword() {

    const BASE_URL = B2C_BASE_URL;
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [token, setToken] = useState("")

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        setToken(params.get("token_id"));
    });

    let navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            password: '',
            passwordConfirm: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {

            var payload = {
                newPassword: values.password,
            };

            setLoading(true);
            const results = await genericPostService(`${BASE_URL}/login/recoveryPassword?token_id=${token}`, payload);
            setLoading(false);

            if (results[0] && results[0].isSuccessful) {
                alert("Su contraseña ha sido restablecida")
                return navigate("/login");
            } else {
                alert("Se ha presentado un error registrando el usuario")
            }

            if (results[0] && !results[0].isSuccessful) {
                setErrorMessage(results[0].message)
                return;
              }
        },
    });

    return errorMessage !== "" ? <div>{errorMessage}</div> : (
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
                        Asignar nueva contraseña
                    </Typography>
                    <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={1}>
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
                            Guardar
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link to="/login" className='text-link'><LinkMu component={"span"} variant="body2">Ingresar</LinkMu> </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default CreateNewPassword;
