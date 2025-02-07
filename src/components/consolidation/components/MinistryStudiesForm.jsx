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
  startDate: yup
    .string('Ingrese la fecha de inicio del curso')
    .required('El campo es obligatorio'),
  status: yup
    .string('Ingrese el estado del curso')
    .required('El campo es obligatorio'),
});


export default function MinistryStudiesForm({ open, setOpen, setIsUpdateRequired }) {

  const user = useSelector(state => state.user);
  const memberContext = useContext(MemberContext);

  const formik = useFormik({
    initialValues: {
      name: "",
      startDate: "",
      endDate: "",
      status: "",
      comments: "",
      _id: null
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {

      const payload = { ...values };

      const results = await genericPutService(`${B2C_BASE_URL}/member/updateMinistryStudiesInfo/${memberContext.currentMember._id}`, payload, getAuthHeaders(user.token));

      if (results[1]) {
        alert("Se ha presentado un error")
      } else {
        if (results[0].isSuccessful) {
          closeModal();
          memberContext.setAreTabsDisabled(false);
          memberContext.setValue(4);
          memberContext.setCurrentMember(results[0].data);
        } else {
          alert(results[0].message)
        }
      }
    },
  });

  useEffect(() => {
    // If there is a selected member the tabs should be enabled
    if (memberContext.currentMinistryStudy) {
      formik.setValues({
        "name": memberContext.currentMinistryStudy.name,
        "startDate": memberContext.currentMinistryStudy.startDate,
        "endDate": !memberContext.currentMinistryStudy.endDate || memberContext.currentMinistryStudy.endDate === '' ?
          "" : memberContext.currentMinistryStudy.endDate,
        "status": memberContext.currentMinistryStudy.status,
        "comments": memberContext.currentMinistryStudy.comments,
        "_id": memberContext.currentMinistryStudy._id
      });
    } else {
      formik.setValues({
        "name": "",
        "startDate": "",
        "endDate": "",
        "status": "",
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
            <h1>Formación ministerial</h1>
            <div class="mb-3">
              <label 
                style={{color: "white", width:"520px" }}>Título:</label>
              <input class="form-control" type="text"
                name='name'
                onChange={formik.handleChange}
                value={formik.values.name}
                style={{ border: "1px solid grey" }}
              />
            </div >
            {formik.errors.name && formik.touched.name ? (
              <p className={styles.errorMessage}>{formik.errors.name}</p>
            ) : null}
            {/*<div className={styles.labelFieldModal}>
                <label className={styles.labelField}>Institución:</label>
                <input className={styles.inputField} type="text"></input>
              </div>*/}
            <div class="mb-3">
              <label 
                style={{color: "white", width:"520px" }}>Fecha Inicio:</label>
              <input class="form-control" type="date"
                name='startDate'
                onChange={formik.handleChange}
                value={formik.values.startDate.split('T')[0]}
                style={{ border: "1px solid grey" }}
              />
            </div>
            {formik.errors.startDate && formik.touched.startDate ? (
              <p className={styles.errorMessage}>{formik.errors.startDate}</p>
            ) : null}
            <div class="mb-3">
              <label 
                style={{color: "white", width:"520px" }}>Fecha Fin:</label>
              <input class="form-control" type="date"
                name='endDate'
                onChange={formik.handleChange}
                value={formik.values.endDate.split('T')[0]}
                style={{ border: "1px solid grey" }}
              />
            </div>
            <div class="mb-3">
              <label 
                style={{color: "white", width:"520px" }}>Estado:</label>
              <select className={`${styles.selectors} form-select`}
                value={formik.values.status}
                onChange={formik.handleChange}
                name='status'
              >
                <option value={""}>Seleccione una Opción</option>
                <option value='Terminado'>Terminado</option>
                <option value='En curso'>En curso</option>
                <option value='Cancelado'>Cancelado</option>
              </select>
            </div>
            {formik.errors.status && formik.touched.status ? (
              <p className={styles.errorMessage}>{formik.errors.status}</p>
            ) : null}
            <div class="mb-3">
              <label for="comments" 
                style={{color: "white", width:"520px" }}>Observaciones:</label>
              <textarea type="text" class="form-control" id="comments"
                name='comments'
                onChange={formik.handleChange}
                value={formik.values.comments}
                style={{ border: "1px solid grey", width:"520px" }}
              />
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
