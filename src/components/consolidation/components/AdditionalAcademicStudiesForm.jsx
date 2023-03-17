import { Box } from '@mui/material'
import React, { useState, useRef, useEffect, useContext } from 'react';
import MemberContext from '../../../contexts/MemberContext';
import Modal from '@mui/material/Modal';
import styles from "../styles.module.css";
import Switch from '@mui/material/Switch';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { genericPostService, getAuthHeaders, genericPutService } from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';


const validationSchema = yup.object({
  name: yup
    .string('Ingrese el nombre de la titulación')
    .required('El título es obligatorio'),
  AcademicInstitutionName: yup
    .string('Ingrese el nombre de la institución')
    .required('El campo institución es obligatorio'),
});

export default function AddicionalAcademicStudiesForm({ open, setOpen }) {

  const user = useSelector(state => state.user);
  const memberContext = useContext(MemberContext);

  const closeModal = () => {
    setOpen(false);
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      AcademicInstitutionName: '',
      isFinished: false,
      _id: null
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {

      const payload = { ...values };

      const results = await genericPutService(`${B2C_BASE_URL}/member/updateAcademicStudy/${memberContext.currentMember._id}`, payload, getAuthHeaders(user.token));

      if (results[1]) {
        alert("Se ha presentado un error")
      } else {
        if (results[0].isSuccessful) {
          closeModal();
          memberContext.setAreTabsDisabled(false);
          memberContext.setValue(3);
          memberContext.setCurrentMember(results[0].data);
        } else {
          alert(results[0].message)
        }
      }
    },
  });

  useEffect(() => {
    // If there is a selected member the tabs should be enabled
    if (memberContext.currentMemberAcademicStudy) {
      formik.setValues({
        "name": memberContext.currentMemberAcademicStudy.name,
        "_id": memberContext.currentMemberAcademicStudy._id,
        "isFinished": memberContext.currentMemberAcademicStudy.isFinished,
        "AcademicInstitutionName": memberContext.currentMemberAcademicStudy.AcademicInstitutionName
      });
    } else {
      formik.setValues({
        "name": "",
        "_id": null,
        "isFinished": false,
        "AcademicInstitutionName": ""
      });
    }
  }, [open]);

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"

      >
        <Box className={styles.modalContainer}>
          <form onSubmit={formik.handleSubmit} >
            <div className={styles.modalTitle}>Crea nuevo estudio o formación</div>
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
              <div className={styles.labelFieldModal}>
                <span className={styles.labelField}>Institución:</span>
                <input className={styles.inputField} type="text"
                  name='AcademicInstitutionName'
                  onChange={formik.handleChange}
                  value={formik.values.AcademicInstitutionName}
                />
              </div>
              {formik.errors.AcademicInstitutionName && formik.touched.AcademicInstitutionName ? (
                <p className={styles.errorMessage}>{formik.errors.AcademicInstitutionName}</p>
              ) : null}
              <div className={styles.labelFieldModal}>
                <span className={styles.labelField}>Finalizado:</span>
                <div className={styles.ToggleContainer}>
                  <Switch className={styles.toggle}
                    inputProps={{ 'aria-label': 'controlled' }}
                    id='isFinished'
                    defaultChecked={formik.values.isFinished}
                    onChange={formik.handleChange}
                    value={formik.values.isFinished}
                  />
                </div>
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
