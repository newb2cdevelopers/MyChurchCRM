import React, { useEffect, useState } from "react";
import PromotionalCard from "./components/PromotionalCard";
import styles from "./styles.module.css";
import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { B2C_BASE_URL } from "../../constants";
import { genericGetService } from "../../api/externalServices";
import eventImage from "../../images/data_alert.svg";
import arrowLeft from "../../images/arrow left.svg";
import arrowRight from "../../images/arrow right.svg";
import BackdropLoader from '../common/backdroploader';

export default function PromotionalEvents() {
  const data = useSelector((state) => state.user.selectedChurchId);
  const [events, setEvents] = useState([])
  const [currentEvents, setCurrentEvents] = useState([])
  const [nextEvents, setNextEvents] = useState([])
  const [loading, setLoading] = useState(false);

  const BASE_URL = B2C_BASE_URL;

  const getEvents = async () => {
    return await genericGetService(`${BASE_URL}/event/eventsByChurch/${data}`);
  };

  useEffect(() => {
    if (data) {
      
      setLoading(true);
      getEvents().then(data => {
        
        if (data[0]) {
          setEvents(data[0].filter(e => { return e.status === "Pendiente" }))

          setCurrentEvents(data[0].filter(event => { return event.isBookingAvailable && event.status === "Pendiente" }));
          setNextEvents(data[0].filter(event => { return !event.isBookingAvailable && event.status === "Pendiente" }));

          setLoading(false)
        } else {
          alert("Se ha presentado un error");
          setLoading(false)
        }
      });
    }
  }, []);

  return (
    <>
      {currentEvents.length > 4 ?
        <div className={styles.arrowContainer}>
          <img src={arrowLeft} alt="" className={styles.arrowLeft}
            onClick={() => document.getElementById('containerEvents').scrollBy(-300, 0)} />
          <img src={arrowRight} alt="" className={styles.arrowRight}
            onClick={() => document.getElementById('containerEvents').scrollBy(300, 0)} />
        </div>
        : <></>
      }
      {loading ? <BackdropLoader show={loading} message="Consultando los eventos" /> :
        currentEvents.length > 0 || nextEvents.length > 0 ?
          <div className={styles.containerEvents}>
            <p className={styles.titleContainerEvents}>Eventos disponibles para reserva</p>
            <div className={styles.currentEvents} id='containerEvents'>
              {
                currentEvents.length > 0 ?

                  currentEvents.map(e => {
                    return <PromotionalCard eventId={e._id} title={e.name} bookingAvailable={true} />
                  }) :
                  <div className={styles.cardEvents}>
                    <img alt="" src={eventImage} className={styles.cardImage}></img>
                    <span className={styles.noEvents}>No hay eventos recientes</span>
                  </div>
              }

            </div>
            <p className={styles.titleContainerEvents}>Próximos Eventos</p>
            {nextEvents.length > 4 ?
              <div className={styles.arrowContainer}>
                <img src={arrowLeft} alt="" className={styles.arrowLeftNextEvents}
                  onClick={() => document.getElementById('containerNextEvents').scrollBy(-300, 0)} />
                <img src={arrowRight} alt="" className={styles.arrowRightNextEvents}
                  onClick={() => document.getElementById('containerNextEvents').scrollBy(300, 0)} />
              </div>
              : <></>
            }
            <div className={styles.nextEvents} id='containerNextEvents'>
              {
                nextEvents.length > 0 ?

                  nextEvents.map(e => {
                    return <PromotionalCard eventId={e._id} title={e.name} bookingAvailable={false} />
                  }) :
                  <div className={styles.cardEvents}>
                    <img alt="" src={eventImage} className={styles.cardImage}></img>
                    <span className={styles.noEvents}>No hay eventos recientes</span>
                  </div>
              }
            </div>
          </div>
          : <div className={styles.cardEvents}>
          <img alt="" src={eventImage} className={styles.cardImage}></img>
          <span className={styles.noEvents}>No hay eventos</span>
        </div>
      }
    </>
  );
}
