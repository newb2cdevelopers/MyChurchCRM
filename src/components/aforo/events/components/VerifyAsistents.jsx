import React, {useState} from 'react';
import { genericGetService } from '../../../../api/externalServices';
import { B2C_BASE_URL } from '../../../../constants';
import styles from './styles.module.css';
import { Alert } from "@mui/material";
import { getCurrentHour, getFormatedTodayDate } from '../../../../utils/dateUtils';

export default function VerifyAsistents() {

  const [document, setDocument] = useState("");
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState(null);

  const searchBookings = async ()=>{
    if (document === "") {
      setMessage({message:"Debe ingresar el número de documento", severity:"error"});
      return
    }

    const results = await genericGetService(`${B2C_BASE_URL}/event/AllBookingsByDocument/${document}`);

    if (results[0]) {
      setBookings(results[0]);
      setDocument("");
      return;
    }
    setMessage({message:"Se ha presentado un error buscando las reservas", severity:"error"});
  }

  const confirmBooking = async (bookingId) => {
    const results =  await genericGetService(`${B2C_BASE_URL}/event/updateBooking/${bookingId}/Confirmado`)

    if (results[0]) {
      setMessage({message:"Reserva confirmada", severity:"success"});
      setBookings([]);
      return;
    }
    setMessage({message:"Se ha presentado un error confirmando la reserva", severity:"error"});
  }

  const isConfirmEnabled = (eventTime, eventDate) => {
    const formattedDate = eventDate.split("T")[0];
    const todayDate = getFormatedTodayDate();
    if(formattedDate === todayDate){
      const currentTime = parseInt(getCurrentHour().substring(0,2));
      const timeEvent = parseInt(eventTime.substring(0,2));
      const timeDifference = currentTime - timeEvent;
      if(timeDifference === 1 || timeDifference === -1 || timeDifference === 0){
        return false
      }
    }
    return true;
  }

  return (
    <div className={styles.containerVerifyAsistents}>
      <div className={styles.titleVerfiyAsistents}>Asistencia</div>
      <div className={styles.verifyAsistents}>
      <div className={styles.message}>
          {message && <Alert variant="filled" severity={message.severity} onClick={()=>{setMessage(null)}}>{message.message}</Alert>}
      </div>
        <div className={styles.entryIdTxtAttendee}>
          <p>Número de documento</p>
          <input className={styles.inputDataIdTxtAttendee} type="text" id="idTxtAttendee" value={document} onChange={(e) =>{setDocument(e.target.value)}} placeholder={"Ingrese la cédula"}/>
          <br></br>
          <input type="button" id="searchBooking" style={{"border-radius":"6px", "margin-top":"9px"}} value={"Consultar..."} onClick={() => {searchBookings()}}/>
        </div>
        <br></br>
        <table className={styles.tableVerifyAsistents}>
          <thead>
            <tr>
              <th><p>Nombre del evento</p></th>
              <th><p>Fecha</p></th>
              <th><p>Nombre Asistente</p></th>
              <th><p>Confirmar Asistencia</p></th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? 
              bookings.map((booking, index) => {
                return <tr>
                  <td>{booking.eventId?.name}</td>
                  <td>{booking.eventId?.date?.split("T")[0]} {booking.eventId?.time}</td>
                  <td>{booking.atendee?.name}</td>
                  <td>
                    {booking.status === "Pendiente" ?
                    <input title={isConfirmEnabled(booking.eventId?.time, booking.eventId?.date)?"Solo se puede confirmar una hora antes o después del evento":null}  disabled={isConfirmEnabled(booking.eventId?.time, booking.eventId?.date)} className={styles.confirmButton} type="button" id={`confirm${index}`} value={"Confirmar"} name={`confirm${index}`} onClick={() => {confirmBooking(booking._id)}}/>
                    : booking.status
                  }
                  </td>
                </tr>
              }) : <tr>
                <td style={{textAlign: 'center'}}>Sin resultados</td>
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
