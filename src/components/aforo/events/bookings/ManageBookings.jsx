import React, { useState, useRef, useEffect } from 'react';
import { genericGetService } from '../../../../api/externalServices';
import { B2C_BASE_URL } from '../../../../constants';
import styles from './styles.module.css'
import QrCode2Icon from '@mui/icons-material/QrCode2';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import { GenerateQR } from '../../../../utils/generateQR';
import { QRCodeCanvas } from 'qrcode.react';
import { Alert } from "@mui/material";


export default function ManageBooking() {

    const [document, setDocument] = useState("");
    const [bookings, setBookings] = useState([]);
    const [qrValue, setQrValue] = useState("");
    const qrRef = useRef();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [message, setMessage] = useState(null);
    useEffect(() => {
        if (qrValue !== "") {
            if (selectedEvent) {
                GenerateQR(selectedEvent, document, qrRef.current?.children[0])
                setSelectedEvent(null)
            }
        }
    }, [qrValue, selectedEvent])

    const searchBookings = async () => {
        if (document === "") {
            setMessage({ message: "Debe ingresar el número de documento.", severity: "error" });
            return
        }

        const results = await genericGetService(`${B2C_BASE_URL}/event/bookingsByDocument/${document}`);

        setSelectedEvent(null)

        if (results[0]) {
            setBookings(results[0]);
            return;
        }
        setMessage({ message: "Se ha presentado un error buscando las reservas", severity: "error" });
    }

    const cancelBooking = async (bookingId) => {
        if (window.confirm("¿Está seguro que desea cancelar su reserva?") === true) {

            const results = await genericGetService(`${B2C_BASE_URL}/event/updateBooking/${bookingId}/Cancelado`)

            if (results[0]) {
                setMessage({ message: "Reserva cancelada", severity: "success" });
                if(bookings.length>1){
                    searchBookings();
                }
                else{
                setBookings([])
                }
                return;
            }
            setMessage({ message: "Se ha presentado un error confirmando la reserva", severity: "error" });

        }
    }

    const downloadQR = async (booking) => {
        setSelectedEvent(booking.eventId);
        setQrValue(`https://b2c-front.herokuapp.com/confirmarReserva?id=${booking._id}`);
    }


    return (
        <div className={styles.containerVerifyAsistents}>
            <div className={styles.titleVerfiyAsistents}>Gestionar mis reservas</div>
            <div style={{ "display": "none" }} ref={qrRef}>
                <QRCodeCanvas value={qrValue} />,
            </div>
            <div className={styles.verifyAsistents}>
                <div className={styles.message}>
                    {message && <Alert variant="filled" severity={message.severity} onClick={() => { setMessage(null) }}>{message.message}</Alert>}
                </div>
                <div className={styles.entryIdTxtAttendee}>
                    <p>Número de documento</p>
                    <input className={styles.inputDataIdTxtAttendee} type="text" id="idTxtAttendee" onChange={(e) => { setDocument(e.target.value) }} placeholder={"Ingrese la cédula"} />
                    <br></br>
                    <input type="button" id="searchBooking" style={{ "borderRadius": "6px", "marginTop": "9px" }} value={"Consultar..."} onClick={() => { searchBookings() }} />
                </div>
                <br></br>
                <table className={styles.tableVerifyAsistents}>
                    <thead>
                        <tr>
                            <th><p>Nombre del evento</p></th>
                            <th><p>Fecha</p></th>
                            <th><p>Nombre Asistente</p></th>
                            <th><p>Acciones</p></th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length > 0 ?
                            bookings.map((booking, index) => {
                                return <tr>
                                    <td>{booking.eventId?.name}</td>
                                    <td>{booking.eventId?.date.split("T")[0]} {booking.eventId?.time}</td>
                                    <td>{booking.atendee?.name}</td>
                                    <td>
                                        <div>
                                            <QrCode2Icon titleAccess='Descargar QR' color='info' className={styles.actionIcon} onClick={() => { downloadQR(booking) }} />
                                            <DoDisturbOnIcon titleAccess='Cancelar reserva' color='error' className={styles.actionIcon} onClick={() => { cancelBooking(booking._id) }} />
                                        </div>
                                    </td>
                                </tr>
                            }) : <tr>
                                <td style={{ textAlign: 'center' }}>Sin resultados</td>
                            </tr>
                        }
                        <tr>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}