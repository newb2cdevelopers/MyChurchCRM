/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";
import {
  genericGetService,
  genericPostService,
  genericPutService
} from "../../api/externalServices";
import { B2C_BASE_URL } from "../../constants";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BackdropLoader from "../common/backdroploader";
import { QRCodeCanvas } from 'qrcode.react';
import { GenerateQR } from "../../utils/generateQR";
import { Alert } from "@mui/material";
import { emailValidation } from "../../utils/validations";
import { getFormatedTodayDate } from "../../utils/dateUtils";

const initialAttendee = {
  documentType: "CC",
  name: "",
  email: "",
  phone: "",
  birthDate: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  atendeeSpouse: "",  
};

const propertiesMap = {
  documentType: "Tipo de identificación",
  documentNumber: "Número de documento",
  phone: "Celular",
  birthDate: "Fecha de nacimiento",
  emergencyContactName: "Nombre contacto de emergencia",
  emergencyContactPhone: "Teléfono contacto de emergencia",
  name: "Nombre",
  email: "Correo",
  atendeeSpouse: "Iglesia a la que asiste"
};

export default function ReservationEvent() {

  let navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [document, setDocumentNumber] = useState("");
  const [attendee, setAttendee] = useState(initialAttendee);
  const [startAtendee, setStartAtendee] = useState(null);
  const [isExistingAttendee, setIsExistingAttendee] = useState(false);
  const [alreadyBooked, setAlreadyBooked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [message, setMessage] = useState(null);
  const documentRef = useRef(null);
  const qrRef = useRef();

  const eventId = useSelector(
    (state) => state.bookings.selectedEventIdForBooking
  );

  const getEventDetails = async () => {
    if (!eventId) {
      return navigate("/");
    }

    setDocumentNumber("");
    setLoading(true);
    const results = await genericGetService(
      `${B2C_BASE_URL}/event/getEventById/${eventId}`
    );
    setLoading(false);
    if (results[0]) {
      if (Object.keys(results[0]).length === 0) {
        setMessage({message:"No se encontró el evento, por favor contacte al administrador", severity:"error"});
        return;
      }
      setEvent(results[0]);
      return;
    }
    setMessage({message:"Se presentó un error cargando los datos.", severity:"error"});
  };

  const checkExistingBooking = () => {
    if (event.Bookings.length === 0) {
      return false;
    }

    var filteredBooking = event?.Bookings.filter((booking) => {
      return booking.atendee.documentNumber === document;
    });

    return filteredBooking.length > 0;
  };

  useEffect(() => {
    if (qrValue !== "") {
      GenerateQR(event,document, qrRef.current?.children[0],attendee.name);
      setAttendee(initialAttendee);
    }
  }, [qrValue])

  useEffect(() => {
    getEventDetails();
  }, []);

  const resetForm = () => {
    setQrValue("");
    setAlreadyBooked(false);
    setIsExistingAttendee(false);
    setAttendee(initialAttendee);
    setDocumentNumber("");
    setMessage(null)
    documentRef.current.value = "";
    getEventDetails();
  };

  const checkAttendeeAndBooking = async () => {
    if (document === "") {
      setAlreadyBooked(false);
      setIsExistingAttendee(false);
      setAttendee(initialAttendee);
      return;
    }

    const results = await genericGetService(
      `${B2C_BASE_URL}/attendee/${document}`
    );

    if (results[0]) {
      if (Object.keys(results[0]).length !== 0) {
        setAttendee(results[0]);
        setStartAtendee(results[0]);
        setIsExistingAttendee(true);

        if (checkExistingBooking()) {
          setAlreadyBooked(true);
          setMessage({message:"Ya tiene reserva para este evento", severity:"warning"});
        } else {
          setAlreadyBooked(false);
          setMessage({message:"Sin  reserva para este evento", severity:"warning"});
        }
      } else {
        setAlreadyBooked(false);
        setIsExistingAttendee(false);
        setAttendee(initialAttendee);
      }

      return;
    }
    setMessage({message:"Se ha presentado un error", severity:"error"});
    return;
  };

  const handleAttendeeOnchange = (e) => {
    setMessage(null)
    setAttendee((prevAttendee) => ({
      ...prevAttendee,
      [e.target.name]: e.target.value,
    }));
  };

  const validateAttendeeData = () => {

    for (let attendeeProperty in attendee) {
      // skip loop if the property is from prototype
      if (attendee[attendeeProperty] === "") {
        setMessage({message:"El campo " + propertiesMap[attendeeProperty] + " es obligatorio", severity:"error"})
        return false;
      }
      if(attendeeProperty === "phone"){
        if(attendee[attendeeProperty].length !== 10){
          setMessage({message:"El campo " + propertiesMap[attendeeProperty] + " debe tener 10 dígitos", severity:"error"})
          return false;
        }
      }
      if(attendeeProperty === "emergencyContactPhone"){
        if(attendee[attendeeProperty].length !== 7 && attendee[attendeeProperty].length !== 10){
          setMessage({message:"El campo " + propertiesMap[attendeeProperty] + " debe tener mínimo 7 dígitos y máximo 10", severity:"error"})
          return false;
        }
      }
      if(attendeeProperty === "email"){
        if(!emailValidation(attendee[attendeeProperty])){
          setMessage({message:"El campo " + propertiesMap[attendeeProperty] + " debe ser válido", severity:"error"})
          return false;
        }
      }
    }
    return true;
  }

  const handleBookingProcess = async () => {
    if (isExistingAttendee) {
      if(JSON.stringify(startAtendee) === JSON.stringify(attendee)) {
       createBooking(attendee._id); 
       return
      }
      if (validateAttendeeData()) {
        updateAtendee();
      }
    } else {
      if (validateAttendeeData()) {
        createAttendee();
      }
    }
  };

  const updateAtendee = async () => {
    setLoading(true);
    const payload = { ...attendee, documentNumber: document };
    const results = await genericPutService(
      `${B2C_BASE_URL}/attendee/${attendee._id}`,
      payload
    );

    if (results[0]) {

      if (!alreadyBooked) {
        createBooking(attendee._id);
        return
      }

      setLoading(false);
      setMessage({message:"Datos Actualizados correctamente", severity:"success"});

      setTimeout(() => {
        resetForm()
      }, 1000)
     

    } else {
      setLoading(false);
      setMessage({message:"Se presentó un error guardando los datos.", severity:"error"});
    }
  }

  const createAttendee = async () => {
    setLoading(true);
    const payload = { ...attendee, documentNumber: document };

    const results = await genericPostService(
      `${B2C_BASE_URL}/attendee`,
      payload
    );

    if (results[0]) {
      createBooking(results[0]._id);
      setLoading(false);
    } else {
      setLoading(false);
      setMessage({message:"Se presentó un error guardando los datos.", severity:"error"});
    }
  };

  const handleDocumentChange = (e) => {
    setDocumentNumber(e.target.value);
    setAttendee({...attendee,documentNumber:e.target.value})
  };
  const createBooking = async (attendeeId) => {
    setLoading(true);
    console.log(attendee);

    const payload = {
      bookingDate: getFormatedTodayDate(),
      atendee: attendeeId,
    };

    const results = await genericPostService(
      `${B2C_BASE_URL}/event/addBooking/${eventId}`,
      payload
    );

    if (results[0]) {

      const bookingId = results[0]?.Bookings.filter(booking => { return booking.atendee.documentNumber === document })[0]?.id;

      setLoading(false);
      setAlreadyBooked(false);
      setIsExistingAttendee(false);    
      documentRef.current.value = "";
      documentRef.current.focus();
      setMessage({message:"Reserva confirmada", severity:"success"});
      setQrValue(`https://b2c-front.herokuapp.com/confirmarReserva?id=${bookingId}`);
      await getEventDetails();
    } else {
      setLoading(false);
      setMessage({message:"Error creando reserva", severity:"error"});
    }
  };

  return (
    event && (
      <div className={styles.containerReservationEvent}>
        <BackdropLoader
          show={loading}
          message="Validando los datos ingresados"
        />

        <div style={{ "display": "none" }} ref={qrRef}>
          <QRCodeCanvas value={qrValue} />,
        </div>
     
        <div className={styles.reservationEvent}>
        <div className={styles.message}>
          {message && <Alert variant="filled" severity={message.severity} onClick={()=>{setMessage(null)}}>{message.message}</Alert>}
          </div>
          <div className={styles.titleReservationEvent}>
            <p>Nueva reserva</p>
            <p
              className={
                event.capacity - event.Bookings.length > 0
                  ? styles.spacesAvailables
                  : styles.spacesUnavailables
              }
            >
              {event.capacity - event.Bookings.length} Cupos disponibles
            </p>
          </div>
          <div>
            <p className={styles.titleEvent}>{event.name}</p>
          </div>
          <div className={styles.dataReservation}>
            <div>
              <p>Tipo de documento</p>
              <select
                className={styles.inputDataReservation}
                name="documentType"
                onChange={handleAttendeeOnchange}
                disabled={isExistingAttendee}
                value={attendee.documentType}
              >
                <option value="CC">Cedula ciudadania</option>
                <option value="TI">Tarjeta de identidad</option>
                <option value="Passport">Pasaporte</option>
              </select>
            </div>
            <div>
              <p>Número de Documento</p>
              <input
                className={styles.inputDataReservation}
                ref={documentRef}
                onBlur={() => {
                  checkAttendeeAndBooking();
                }}
                value={document}
                disabled={isExistingAttendee}
                onChange={handleDocumentChange}
              />
            </div>
          </div>
          <div className={styles.dataReservation}>
            <div>
              <p>Nombre Completo</p>
              <input
                className={styles.inputDataReservation}
                type="text"
                name="name"
                disabled={isExistingAttendee}
                value={attendee.name}
                onChange={handleAttendeeOnchange}
              />
            </div>
            <div>
              <p>Correo</p>
              <input
                name="email"
                onChange={handleAttendeeOnchange}
                value={attendee.email}
                className={styles.inputDataReservation}
                type="text"
              />
            </div>
          </div>
          <div className={styles.dataReservation}>
            <div>
              <p>Celular</p>
              <input
                className={styles.inputDataReservation}
                name="phone"
                onChange={handleAttendeeOnchange}
                value={attendee.phone}                
                type="number"
              />
            </div>
            <div>
              <p>Fecha de nacimiento</p>
              <input
                className={styles.inputDataReservation}
                type="date"                
                name="birthDate"
                value={attendee.birthDate}
                onChange={handleAttendeeOnchange}
              />
            </div>
          </div>
          <div className={styles.dataReservation}>
            <div>
              <p>Nombre Contacto de emergencia</p>
              <input
                className={styles.inputDataReservation}
                type="text"
                name="emergencyContactName"
                value={attendee.emergencyContactName}
                onChange={handleAttendeeOnchange}
              />
            </div>
            <div>
              <p>Teléfono Contacto de emergencia</p>
              <input
                name="emergencyContactPhone"
                onChange={handleAttendeeOnchange}
                value={attendee.emergencyContactPhone}
                className={styles.inputDataReservation}
                type="number"
              />
            </div>
          </div>
          <div className={styles.dataReservation}>
            <div>
              <p>Iglesia a la que asiste</p>
              <input 
                type="text" 
                className={styles.inputDataReservation}
                name="atendeeSpouse"
                value={attendee.atendeeSpouse}
                onChange={handleAttendeeOnchange}
              />
            </div>
          </div>
          <div
            className={`${styles.dataReservation} ${styles.dataReservationButtons}`}
          >
            <button
              disabled={
                ((alreadyBooked || event.capacity - event.Bookings.length === 0 || document === "") && JSON.stringify(startAtendee) === JSON.stringify(attendee)) 
              }
              title={alreadyBooked ? "Ya tiene reserva" : ""}
              onClick={() => {
                handleBookingProcess();
              }}
            >
              {alreadyBooked && JSON.stringify(startAtendee) !== JSON.stringify(attendee) ? "Actualizar Datos" : "Reservar"} 
            </button>
            <button
              onClick={() => {
                resetForm();
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )
  );
}
