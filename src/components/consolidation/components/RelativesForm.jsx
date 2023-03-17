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
  documentNumber: yup
    .string('Ingrese el número de documento')
    .required('El campo es obligatorio'),
  mobilePhone: yup
    .string('Ingrese el número teléfono')
    .required('El campo es obligatorio'),
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
      comments:"",
      _id: null
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {

      const payload = { ...values };

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
        "comments":memberContext.currentRelative.comments,
        "_id":  memberContext.currentRelative._id
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
            <div className={styles.modalTitle}>Crea nuevo familiar</div>
            <div className={styles.fieldsContainer}>
              <div className={styles.labelFieldModal}>
                <span className={styles.labelField}>Nombre:</span>
                <input className={styles.inputField} type="text"
                  name='name'
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
              </div >
              {formik.errors.name && formik.touched.name ? (
                <p className={styles.errorMessage}>{formik.errors.name}</p>
              ) : null}
              <div className={styles.labelFieldModal}>
                <span className={styles.labelField}>Idetificación:</span>
                <input className={styles.inputField} type="text"
                  name='documentNumber'
                  onChange={formik.handleChange}
                  value={formik.values.documentNumber}
                />
              </div >
              {formik.errors.documentNumber && formik.touched.documentNumber ? (
                <p className={styles.errorMessage}>{formik.errors.documentNumber}</p>
              ) : null}
              <div className={styles.labelFieldModal}>
                <span className={styles.labelField}>Dirección:</span>
                <input className={styles.inputField} type="text"
                  name='address'
                  onChange={formik.handleChange}
                  value={formik.values.address}
                />
              </div>
              <div className={styles.labelFieldModal}>
                <span className={styles.labelField}>Celular:</span>
                <input className={styles.inputField} type="text"
                  name='mobilePhone'
                  onChange={formik.handleChange}
                  value={formik.values.mobilePhone}
                />
              </div >
              {formik.errors.mobilePhone && formik.touched.mobilePhone ? (
                <p className={styles.errorMessage}>{formik.errors.mobilePhone}</p>
              ) : null}
              <div className={styles.labelFieldModal}>
                <span className={styles.labelField}>Correo electrónico:</span>
                <input className={styles.inputField} type="text"
                  name='email'
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
              </div>
              <div className={styles.labelFieldModal}>
                <span className={styles.labelField}>Fecha de nacimiento:</span>
                <input className={styles.inputField} type="date"
                  name='birthDate'
                  onChange={formik.handleChange}
                  value={formik.values.birthDate.split('T')[0]}
                />
              </div>
              <div className={styles.labelFieldModal}>
                <span className={styles.labelField}>Ocupación:</span>
                <input className={styles.inputField} type="text"
                  name='occupation'
                  onChange={formik.handleChange}
                  value={formik.values.occupation}
                />
              </div>
              <div className={styles.labelFieldModal}>
                <span className={styles.labelField}>Paresteco:</span>
                <select className={styles.Select}
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
