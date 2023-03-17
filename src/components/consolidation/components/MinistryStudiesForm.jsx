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
      comments:"",
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
        "comments":"",
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
          <form onSubmit={formik.handleSubmit} >
            <div className={styles.modalTitle}>Crea nuevo estudio o formación ministerial</div>
            <div className={styles.fieldsContainer}>
              <div className={styles.labelFieldModal}>
                <span className={styles.labelField}>Título:</span>
                <input className={styles.inputField} type="text"
                  name='name'
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
              </div >
              {formik.errors.name && formik.touched.name ? (
                <p className={styles.errorMessage}>{formik.errors.name}</p>
              ) : null}
              {/*<div className={styles.labelFieldModal}>
                <span className={styles.labelField}>Institución:</span>
                <input className={styles.inputField} type="text"></input>
              </div>*/}
              <div className={styles.labelFieldModal}>
                <span className={styles.labelField}>Fecha Inicio:</span>
                <input className={styles.inputField} type="date"
                  name='startDate'
                  onChange={formik.handleChange}
                  value={formik.values.startDate.split('T')[0]}
                />
              </div>
              {formik.errors.startDate && formik.touched.startDate ? (
                <p className={styles.errorMessage}>{formik.errors.startDate}</p>
              ) : null}
              <div className={styles.labelFieldModal}>
                <span className={styles.labelField}>Fecha Fin:</span>
                <input className={styles.inputField} type="date"
                  name='endDate'
                  onChange={formik.handleChange}
                  value={formik.values.endDate.split('T')[0]}
                />
              </div>
              <div className={styles.labelFieldModal}>
                <span className={styles.labelField}>Estado:</span>
                <select className={styles.Select}
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
              <div className={styles.labelFieldModal}>
                <span className={styles.labelField}>Observaciones:</span>
                <textarea className={styles.inputFieldTextArea} rows='5' cols='50'
                  name='comments'
                  onChange={formik.handleChange}
                  value={formik.values.comments}
                />
              </div>
              <div className={styles.modalButtonContainer}>
                <input className={styles.modalButtons}
                  type="submit"
                  disabled={!formik.dirty}
                  value='Guardar'
                />
                <input className={styles.modalButtons}
                  type="button"
                  onClick={() => closeModal()}
                  value='Cancelar'
                />
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    </div >
  )
}
