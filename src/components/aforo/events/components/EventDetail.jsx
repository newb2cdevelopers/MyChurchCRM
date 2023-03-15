/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import styles from "./styles.module.css" 
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import {selectEventDetails} from '../../../../features/events/eventsSlice';
import {capitalizeName} from "../../../../utils/capitalizeName";
import { ExportToExcel } from '../../../../utils/downloadExcelFile';

function EventDetail({ open, setOpen }) {

  const dispatch = useDispatch();
  const [filterValue, setFilterValue] = useState("");
  const [filterBookings, setFilterBookings] = useState([]);
  const [initialBookings, setInitialBookings] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Selecciona un estado");

  const event = useSelector(state => state.events.selectedEventDetails);

  useEffect(()=>{
    if(filterValue === ""){
      setFilterBookings(initialBookings) 
      return;
    }
    let filter = initialBookings.filter(booking=>{return booking.atendee.name.toLowerCase().includes(filterValue.toLowerCase()) || booking.atendee.documentNumber.startsWith(filterValue)})
    if(selectedStatus !== "Selecciona un estado"){
      filter = filter.filter(booking=>{return booking.status.includes(selectedStatus)})
    }
    setFilterBookings(filter)
  },[filterValue]);

  useEffect(()=>{
    if(event === null){
      return 
    }
    setFilterBookings(event.Bookings);
    setInitialBookings(event.Bookings);
  },[event]);

  useEffect(()=>{
    if(selectedStatus === "Selecciona un estado"){
      setFilterBookings(initialBookings) 
      return;
    }
    let selected = initialBookings.filter(booking=>{return booking.status.includes(selectedStatus)})
    if(filterValue !== ""){
      selected = selected.filter(booking=>{return booking.attendeeName.toLowerCase().includes(filterValue.toLowerCase()) || booking.attendeeDocument.startsWith(filterValue)})
    }
    setFilterBookings(selected)
  },[selectedStatus]);


  const closeModal = () => {
    setOpen(false)
    dispatch(
      selectEventDetails({
          selectedEventDetails: null
      })
  )
  }

  const downloadReport = () => {
    const columnHeaders = ["Documento", "Nombre", "Teléfono", "Nombre Cónyuge", "Fecha Reserva", "Estado"];
    const eventDetailData = initialBookings.map(booking => {
      return {
        attendeeDocument: booking.atendee.documentNumber,
        attendeeName: booking.atendee.name,
        attendeePhone: booking.atendee.phone,
        attendeeSpouseName: booking.atendee.atendeeSpouse,
        bookingDate: booking.bookingDate,
        status: booking.status
      }
    })
    ExportToExcel(eventDetailData, `Reporte reservas ${event.name}`, columnHeaders)
  }
    
  return (

    event &&

    <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className= {styles.detailModalContainer}>
          <Typography className={styles.title} id="modal-modal-title" variant="h6">Detalle Reservas</Typography> 
          <div className={styles.summaryContainer}>
            <div>
              <span>{event.name}</span>
              <span>Fecha: {event.date.split("T")[0]}</span>
            </div>
            <div>
              <span>Total Reservas: {event.Bookings.length}</span>
              <span>Capacidad: {event.capacity}</span>
            </div>
            <div>
              <span>Reservas Canceladas: {event.Bookings.filter(booking=>{return booking.status === "Cancelado"}).length}</span>
              <span>Reservas Confirmadas: {event.Bookings.filter(booking=>{return booking.status === "Confirmado"}).length}</span>
            </div>
            <div>
              <span>Reservas Pendientes: {event.Bookings.filter(booking=>{return booking.status === "Pendiente"}).length}</span>
            </div>
            <div className={styles.search}>
              <input value={filterValue} onChange={(e)=>{setFilterValue(e.target.value)}} type="text" placeholder="Ingrese nombre o cédula"/>
              <select value={selectedStatus} onChange={(e)=>{setSelectedStatus(e.target.value)}} name="status">
                <option value="Selecciona un estado">Selecciona un estado</option>
                <option value="Confirmado">Confirmado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
            <div>
            {initialBookings.length > 0 && 
              <button className={styles.downloadReport} onClick = { downloadReport }>DESCARGAR REPORTE</button>
            } 
            </div>
          </div> 
          <div className={styles.tableContainer}>
            <table className={styles.detailTable}>
                <thead>
                  <tr>
                    <th><p>Documento</p></th>
                    <th><p>Nombre</p></th>
                    <th><p>Teléfono</p></th>
                    <th><p>Cónyuge</p></th>
                    <th><p>Estado</p></th>
                  </tr>
                </thead>
                <tbody>
                  {filterBookings.length > 0 ? filterBookings.map(booking => {
                    return <tr>
                              <td>{booking.atendee.documentNumber}</td>
                              <td>{capitalizeName(booking.atendee.name)}</td>
                              <td>{booking.atendee.phone}</td>
                              <td>{booking.atendee.atendeeSpouse}</td>
                              <td>{booking.status}</td>
                            </tr>
                  })
                    : <tr>
                        <td>No hay reservas</td>
                        <td></td>
                        <td></td>
                      </tr>}
                  
                </tbody>
            </table>
          </div>
          <Grid item xs={12}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() => {closeModal()}}
            >
              Cerrar
            </Button>
          </Grid>
        </Box>
      </Modal>
  )
}

export default EventDetail