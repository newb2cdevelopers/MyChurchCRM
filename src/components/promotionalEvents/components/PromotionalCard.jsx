import React from "react";
import styles from "../styles.module.css";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch  } from 'react-redux';
import { selectedEventIdForBooking } from "../../../features/bookings/bookingSlice";
import calendarImage from "../../../../src/images/adorar.jpg";
import eventImage from "../../../../src/images/Fundamentos-de-Doctrina-Biblica.jpeg";
import dinnerImage from "../../../../src/images/cena-de-parejas.jpeg";
import CanticoImage from "../../../../src/images/CanticoNuevo.jpeg";

export default function PromotionalCard({
  bookingAvailable,
  available,
  title,
  eventId
}){

  let navigate = useNavigate();
  const dispatch = useDispatch();


  const navigateToBooking = () =>{
    dispatch(selectedEventIdForBooking({
      selectedEventId: eventId
    }));

    return navigate("/reservation");
  }

  return (
    <div
      className={`${styles.containerPromotionalCard} ${
        available === false ? styles.cardEventDesactive : ""
      }`}
    >
      <div className={styles.cardEvents}>
        <div>
          <img alt="" src={eventId==="633f8ededfdcf7c4d5ac7120" ? CanticoImage : calendarImage} className={styles.cardImage}></img>
        </div>
        {bookingAvailable ? (
          <button className={styles.buttonPromotionalCard} onClick={()=>{navigateToBooking()}}>
            ¡Reserva aquí!
          </button>
        ) : (
          ""
        )}
      </div>
      <div>
        <p className={styles.titleEvent}>{title}</p>
      </div>
    </div>
  );
}
