/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { genericPostService, getAuthHeaders, genericPutService } from '../../../../api/externalServices';
import { useDispatch } from 'react-redux'
import { setSelectedEvent } from '../../../../features/events/eventsSlice';
import { B2C_BASE_URL } from '../../../../constants';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import { getFormatedTodayDate } from '../../../../utils/dateUtils';
import styles from "./styles.module.css";


const validationSchema = yup.object({
  name: yup
    .string('Ingrese el correo')
    .required('El nombre del evento es obligatorio'),
  date: yup
    .date().min(getFormatedTodayDate(), "Las fecha anteriores a hoy no son permitidas")
    .required('la fecha y hora es obligatoria'),
  capacity: yup
    .number()
    .positive("El campo debe sere mayor a 0")
    .required('La capacidad es obligatorio')
});


const validationSchemaNoDate = yup.object({
  name: yup
    .string('Ingrese el correo')
    .required('El nombre del evento es obligatorio'),
  date: yup
    .date()
    .required('la fecha y hora es obligatoria'),
  capacity: yup
    .number()
    .positive("El campo debe sere mayor a 0")
    .required('La capacidad es obligatorio')
});

export default function NewEventModal({ open, setOpen, setIsUpdateRequired }) {

  const dispatch = useDispatch();

  const BASE_URL = B2C_BASE_URL;
  const user = useSelector(state => state.user);
  const selectedEventId = useSelector(state => state.events.selectedEventId);

  const isEditting = selectedEventId !== null;

  useEffect(() => {
    if (isEditting) {
      formik.values.name = selectedEventId.name
      formik.values.date = `${selectedEventId.date.split("T")[0]}T${selectedEventId.time}`
      formik.values.capacity = selectedEventId.capacity
      formik.values.status = selectedEventId.status
      formik.values.isBookingAvailable = selectedEventId.isBookingAvailable
      setIsUpdateRequired(false);
    } else {
      formik.values.name = ''
      formik.values.date = ''
      formik.values.capacity = ''
      formik.values.status = ''
      formik.values.isBookingAvailable = false
    }
  }, [isEditting])

  const formik = useFormik({
    initialValues: {
      name: '',
      date: '',
      capacity: 0,
      status: '',
      isBookingAvailable: false
    },
    validationSchema: isEditting ? validationSchemaNoDate : validationSchema,
    onSubmit: async (values) => {

      var payload = { ...values, time: values.date.split("T")[1], churchId: user.selectedChurchId };

      if (isEditting) {
        const results = await genericPutService(`${BASE_URL}/event/updateEvent/${selectedEventId._id}`, payload, getAuthHeaders(user.token));

        if (results[1]) {
          alert("Se ha presentado un error")
        } else {
          setIsUpdateRequired(true)
          closeModal();
        }
      } else {

        const results = await genericPostService(`${BASE_URL}/event`, payload, getAuthHeaders(user.token));

        if (results[1]) {
          alert("Se ha presentado un error")
        } else {
          setIsUpdateRequired(true)
          closeModal();
        }
      }
    },
  });

  const closeModal = () => {
    formik.resetForm()
    dispatch(
      setSelectedEvent({
        selectedEventId: null
      }))

    setOpen(false);
  }

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className= {styles.modalContainer}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {isEditting ? "Editar Evento" : "Crear Evento"}
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 3 }}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12}>
                <TextField
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Nombre evento"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="date"
                  name="date"
                  type="datetime-local"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="capacity"
                  label="Capacidad"
                  type="number"
                  error={formik.touched.capacity && Boolean(formik.errors.capacity)}
                  helperText={formik.touched.capacity && formik.errors.capacity}
                  value={formik.values.capacity}
                  onChange={formik.handleChange}
                />
              </Grid>
              {isEditting ?
                <Grid item xs={12}>
                  <Box component="span" className='error'>
                  <InputLabel id="demo-simple-select-label">Estado</InputLabel>
                    <Select style={{ width: "200px" }}
                      onChange={formik.handleChange}
                      defaultValue={formik.values.status}
                      value={formik.values.status}
                      name={'status'}
                      label="Estado"
                    >
                      <MenuItem value={""}>Seleccione un estado...</MenuItem>
                      <MenuItem value={"Pendiente"}>Pendiente</MenuItem>
                      <MenuItem value={"Cancelado"}>Cancelado</MenuItem>
                      <MenuItem value={"Cerrado"}>Cerrado</MenuItem>
                    </Select>
                  </Box>
                </Grid>
                : null
              }
              <Grid item xs={12}>
                <div>Disponible para reserva: <Switch
                  onChange={formik.handleChange}
                  inputProps={{ 'aria-label': 'controlled' }}
                  value={formik.values.isBookingAvailable}
                  id='isBookingAvailable'
                  defaultChecked={formik.values.isBookingAvailable}
                /></div>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className={styles.buttons}
                >
                  Guardar
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  className={styles.buttons}
                  onClick={() => closeModal()}
                >
                  Cerrar
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}