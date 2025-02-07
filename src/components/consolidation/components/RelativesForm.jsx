import { Box } from '@mui/material'
import React, { useState, useRef, useEffect, useContext } from 'react';
import Modal from '@mui/material/Modal';
import styles from "../styles.module.css";
import { useSelector } from 'react-redux';
import { genericPostService, getAuthHeaders, genericPutService } from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';
import { useFormik } from 'formik';
import * as yup from 'yup';
import MemberContext from '../../../contexts/MemberContext';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const validationSchema = yup.object({
  name: yup
    .string('Ingrese el nombre')
    .required('El nombre es obligatorio'),
  documentNumber: yup
    .string('Ingrese el número de documento')
    .required('El campo es obligatorio')
});

export default function RelativesForm({ open, setOpen, setIsUpdateRequired }) {

  const user = useSelector(state => state.user);
  const memberContext = useContext(MemberContext);

  const formik = useFormik({
    initialValues: {
      name: "",
      documentNumber: "",
      address: "",
      mobilePhone: "",
      email: "",
      birthDate: "",
      occupation: "",
      kinship: "",
      comments: "",
      _id: null
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {

      const payload = { ...values, documentNumber: values.documentNumber.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '') };

      const results = await genericPutService(`${B2C_BASE_URL}/member/updateRelativeInfo/${memberContext.currentMember._id}`, payload, getAuthHeaders(user.token));

      if (results[1]) {
        alert("Se ha presentado un error")
      } else {
        if (results[0].isSuccessful) {
          closeModal();
          memberContext.setAreTabsDisabled(false);
          memberContext.setValue(2);
          memberContext.setCurrentMember(results[0].data);
        } else {
          alert(results[0].message)
        }
      }
    },
  });

  useEffect(() => {
    // If there is a selected member the tabs should be enabled
    if (memberContext.currentRelative) {
      formik.setValues({
        "name": memberContext.currentRelative.name,
        "documentNumber": memberContext.currentRelative.documentNumber,
        "address": memberContext.currentRelative.address,
        "mobilePhone": memberContext.currentRelative.mobilePhone,
        "email": memberContext.currentRelative.email,
        "birthDate": memberContext.currentRelative.birthDate,
        "occupation": memberContext.currentRelative.occupation,
        "kinship": memberContext.currentRelative.kinship,
        "comments": memberContext.currentRelative.comments,
        "_id": memberContext.currentRelative._id
      });
    } else {
      formik.setValues({
        "name": "",
        "documentNumber": "",
        "address": "",
        "mobilePhone": "",
        "email": "",
        "birthDate": "",
        "occupation": "",
        "kinship": "",
        "comments": "",
        "_id": null
      });
    }
  }, [open]);

  const closeModal = () => {
    setOpen(false);
  }

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"

      >
        <Box className={styles.modalContainer}>
          <form className={styles.formContainer} onSubmit={formik.handleSubmit} >
            <h1>Crea nuevo familiar</h1>
            <div class="mb-3">
              <label 
                style={{color: "white", width:"520px" }}>Nombre:</label>
              <input type="text" class="form-control" id="name"
                placeholder="Escribe el nombre de la persona"
                name='name'
                onChange={formik.handleChange}
                value={formik.values.name}
                style={{ border: "1px solid grey" }} />
            </div>
            {formik.errors.name && formik.touched.name ? (
              <p className={styles.errorMessage}>{formik.errors.name}</p>
            ) : null}
            <div class="mb-3">
              <label 
                style={{color: "white", width:"520px" }}>Idetificación:</label>
              <input type="text" class="form-control" id="documentNumber"
                placeholder="Escribe el nombre de la persona"
                name='documentNumber'
                onChange={formik.handleChange}
                value={formik.values.documentNumber}
                style={{ border: "1px solid grey" }} />
            </div>
            {formik.errors.documentNumber && formik.touched.documentNumber ? (
              <p className={styles.errorMessage}>{formik.errors.documentNumber}</p>
            ) : null}
            <div class="mb-3">
              <label 
                style={{color: "white", width:"520px" }}>Dirección:</label>
              <input type="text" class="form-control" id="address"
                name='address'
                onChange={formik.handleChange}
                value={formik.values.address}
                style={{ border: "1px solid grey" }} />
            </div>
            <div class="mb-3">
              <label 
                style={{color: "white", width:"520px" }}>Celular:</label>
              <input type="text" class="form-control" id="mobilePhone"
                name='mobilePhone'
                onChange={formik.handleChange}
                value={formik.values.mobilePhone}
                style={{ border: "1px solid grey" }} />
            </div>
            <div class="mb-3">
              <label 
                style={{color: "white", width:"520px" }}>Correo electrónico:</label>
              <input type="email" class="form-control" id="email"
                name='email'
                onChange={formik.handleChange}
                value={formik.values.email}
                style={{ border: "1px solid grey" }} />
            </div>
            <div class="mb-3">
              <label 
                style={{color: "white", width:"520px" }}>Fecha de nacimiento:</label>
              <input type="date" class="form-control" id="birthDate"
                name='birthDate'
                onChange={formik.handleChange}
                value={formik.values.birthDate.split('T')[0]}
                style={{ border: "1px solid grey" }} />
            </div>
            <div class="mb-3">
              <label  for="occupation"
                style={{color: "white", width:"520px" }}
              >Ocupación:</label>
              <input type="text" class="form-control" id="occupation"
                name='occupation'
                onChange={formik.handleChange}
                value={formik.values.occupation}
                style={{ border: "1px solid grey" }} />
            </div>
            <div class="mb-3">
              <label 
                style={{color: "white", width:"520px" }}>Paresteco:</label>
              <select className={`${styles.selectors} form-select`}
                value={formik.values.kinship}
                onChange={formik.handleChange}
                name='kinship'
              >
                <option value='Cónyuge'>Cónyuge</option>
                <option value='Hijo/a'>Hijo/a</option>
                <option value='Sobrino/a'>Sobrino/a</option>
                <option value='Primo/a'>Primo/a</option>
                <option value='Padre'>Padre</option>
                <option value='Madre'>Madre</option>
                <option value='Abuelo/a'>Abuelo/a</option>
                <option value='Hermano/a'>Hermano/a</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="comments" 
                style={{color: "white", width:"520px" }}>Observaciones: </label>
              <textarea type="text" class="form-control" id="comments"
                name='comments'
                onChange={formik.handleChange}
                value={formik.values.comments}
                style={{ border: "1px solid grey" }}
              ></textarea>
            </div>
            <div className={`${styles.buttons} btn-group`} role="group" aria-label="Basic example">
              <button type="button" class="btn btn-secondary" onClick={() => closeModal()}>Cancelar</button>
              <button class="btn btn-success" type="submit" disabled={!formik.dirty}>Guardar</button>
            </div>
          </form>
        </Box>
      </Modal>
    </div >
  )
}
