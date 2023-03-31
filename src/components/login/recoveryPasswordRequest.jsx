import React, { useState, useEffect } from 'react';
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
import RecoveryPassword from './recoveryPassword';
import CreateNewPassword from './createNewPassword';

function RecoveryPasswordRequest() {

    const [token, setToken] = useState("")

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        setToken(params.get("token_id"));
    });

    return (
        <div>
            {!token && token !== "" ?
                <RecoveryPassword />
                : <CreateNewPassword/>
            }
        </div>
    )
}

export default RecoveryPasswordRequest;