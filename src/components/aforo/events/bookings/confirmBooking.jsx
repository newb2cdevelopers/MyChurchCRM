import React, { useEffect, useState } from "react";
//import styles from '../../../home/home.module.css'
import { genericGetService, getAuthHeaders } from '../../../../api/externalServices';
import { B2C_BASE_URL } from '../../../../constants';
import { Alert } from "@mui/material";
import styles from './styles.module.css'
import { getFormatedTodayDate, getCurrentHour } from "../../../../utils/dateUtils";

export default function ConfirmBooking({ id }) {

    const [bookingId, setBookingId] = useState("");
    const [confirmBookingResponse, setConfirmBookingResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        setBookingId(params.get("id"));
    }, []);

    useEffect(async () => {
        if (bookingId !== "") {
            setLoading(true)
            var result = await confirmBooking();
            setConfirmBookingResponse(result)
            setLoading(false)
        }
    }, [bookingId])


    const BASE_URL = B2C_BASE_URL;

    const confirmBooking = async () => {
        const clientDate = `${getFormatedTodayDate()}T${getCurrentHour()}`
        const results = await genericGetService(`${BASE_URL}/event/updateBooking/${bookingId}/Confirmado?clientDate=${clientDate}`);

        if (results[0]) {
            return results[0];
        }

        return null;
    }

    return (
        <div className={styles.confirmContainer}>
            {!loading ?
                <div >
                    {confirmBookingResponse && confirmBookingResponse.isSuccessful ? <Alert variant="filled" severity="success">Confirmado</Alert> : <Alert variant="filled" severity="error"> {confirmBookingResponse === null ? "Hubo un error, comuníquese con el administrador" : confirmBookingResponse.message}</Alert>}
                </div>
                : <div>Cargando...</div>}
        </div>

    );
}