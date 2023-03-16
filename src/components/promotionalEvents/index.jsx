import React, { useEffect, useState } from "react";
import PromotionalCard from "./components/PromotionalCard";
import styles from "./styles.module.css";
import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { B2C_BASE_URL } from "../../constants";
import { genericGetService } from "../../api/externalServices";
import eventImage from "../../images/event.jpg";

export default function PromotionalEvents() {
  const data = useSelector((state) => state.user.selectedChurchId);
  const [events, setEvents] = useState([])

  const BASE_URL = B2C_BASE_URL;

  const getEvents = async () => {
    return await genericGetService(`${BASE_URL}/event/eventsByChurch/${data}`);
  };

  useEffect(() => {
    if (data) {
      getEvents().then(data => {

        if (data[0]) {
          setEvents(data[0].filter(e => { return e.status === "Pendiente" }))
        } else {
          alert("Se ha presentado un error");
        }
      });
    }
  }, []);

  return (
    <>
      <div className={styles.containerEvents}>
        <p className={styles.titleContainerEvents}>Eventos</p>
        <div className={styles.currentEvents}>
          {
            events.length > 0 ?

              events.filter(event => { return event.isBookingAvailable }).map(e => {
                return <PromotionalCard eventId={e._id} title={e.name} bookingAvailable={true} />
              }) : 
              <div>
                <img alt="" src={eventImage} className={styles.cardImage}></img>
                <span className={styles.noEvents}>No hay eventos recientes</span>
              </div>
          }

        </div>
        <p className={styles.titleContainerEvents}>Próximos Eventos</p>
        <div className={styles.nextEvents}>
          {
            events.length > 0 ?

              events.filter(event => { return !event.isBookingAvailable }).map(e => {
                return <PromotionalCard eventId={e._id} title={e.name} bookingAvailable={false} />
              }) : 
              <div>
                <img alt="" src={eventImage} className={styles.cardImage}></img>
                <span className={styles.noEvents}>No hay eventos recientes</span>
              </div>
          }
        </div>
      </div>
    </>
  );
}
