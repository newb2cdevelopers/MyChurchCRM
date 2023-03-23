import { Box } from '@mui/material'
import React, { useState, useRef, useEffect, useContext } from 'react';
import Modal from '@mui/material/Modal';
import styles from "../styles.module.css";
import { useSelector } from 'react-redux';
import { genericPostService, getAuthHeaders, genericPutService, genericGetService } from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';
import { useFormik } from 'formik';
import * as yup from 'yup';
import MemberContext from '../../../contexts/MemberContext';

const validationSchema = yup.object({
  workFrontId: yup
    .string('Seleccione el frente o área de trabajo')
    .required('El campo frente o árear de trabajo es obligatorio'),
  startDate: yup
    .string('Ingrese la fecha de inicio del curso')
    .required('El campo es obligatorio'),
  status: yup
    .string('Ingrese el estado del curso')
    .required('El campo es obligatorio'),
  role: yup
    .string('Ingrese el role que desempeña')
    .required('El campo es obligatorio'),
});

export default function WorkFrontForm({ open, setOpen, setIsUpdateRequired }) {

  const user = useSelector(state => state.user);
  const memberContext = useContext(MemberContext);

  const [workFrontList, setWorkFrontList] = useState([])

  const getWorkFrontListByChurch = async () => {
    return await genericGetService(`${B2C_BASE_URL}/workfront/workfrontsByChurch/${user.selectedChurchId}`);
  }


  const closeModal = () => {
    setOpen(false);
  }

  const formik = useFormik({
    initialValues: {
      workFrontId: "",
      startDate: "",
      endDate: "",
      status: "",
      role: "",
      comments: "",
      _id: null
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {

      const payload = { ...values };

      const results = await genericPutService(`${B2C_BASE_URL}/member/updateWorkfrontsInfo/${memberContext.currentMember._id}`, payload, getAuthHeaders(user.token));

      if (results[1]) {
        alert("Se ha presentado un error")
      } else {
        if (results[0].isSuccessful) {
          closeModal();
          memberContext.setAreTabsDisabled(false);
          memberContext.setValue(0);
          memberContext.setCurrentMember(results[0].data);
        } else {
          alert(results[0].message)
        }
      }
    },
  });

  useEffect(() => {
    // If there is a selected member the tabs should be enabled
    if (memberContext.currentWorkFront) {
      formik.setValues({
        "workFrontId": memberContext.currentWorkFront.workFrontId._id,
        "startDate": memberContext.currentWorkFront.startDate,
        "endDate": !memberContext.currentWorkFront.endDate || memberContext.currentWorkFront.endDate === '' ?
          "" : memberContext.currentWorkFront.endDate,
        "status": memberContext.currentWorkFront.status,
        "role": memberContext.currentWorkFront.role,
        "comments": memberContext.currentWorkFront.comments,
        "_id": memberContext.currentWorkFront._id
      });
    } else {
      formik.setValues({
        "workFrontId": "",
        "startDate": "",
        "endDate": "",
        "status": "",
        "role": "",
        "comments": "",
        "_id": null
      });
    }
  }, [open]);

  useEffect(() => {

    getWorkFrontListByChurch().then(data => {
      //setLoading(false);
      if (data[0]) {
        setWorkFrontList(data[0]);
        return;
      }
      alert("Error");
    });
  }, []);

  return (
    workFrontList.length > 0 &&
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"

      >
        <Box className={styles.modalContainer}>
          <form onSubmit={formik.handleSubmit} >
            <div className={styles.modalTitle}>Asignar frente o área de trabajo</div>
            <div className={styles.fieldsContainer}>
              <div className={styles.labelFieldModal}>
                <span className={styles.labelField}>Área o frente de trabajo:</span>
                <select className={styles.Select}
                  value={formik.values.workFrontId}
                  onChange={formik.handleChange}
                  name='workFrontId'
                >
                  <option value={""}>Seleccione una Opción</option>

                  {
                    workFrontList.map((item, index) => {
                      return <option value={item._id}>{item.name}</option>
                    })
                  }
                </select>
              </div >
              {formik.errors.workFrontId && formik.touched.workFrontId ? (
                <p className={styles.errorMessage}>{formik.errors.workFrontId}</p>
              ) : null}
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
                <span className={styles.labelField}>Rol:</span>
                <input className={styles.inputField} type="text"
                  name='role'
                  onChange={formik.handleChange}
                  value={formik.values.role}
                />
              </div>
              {formik.errors.role && formik.touched.role ? (
                <p className={styles.errorMessage}>{formik.errors.role}</p>
              ) : null}
              <div className={styles.labelFieldModal}>
                <span className={styles.labelField}>Estado:</span>
                <select className={styles.Select}
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  name='status'
                >
                  <option value={""}>Seleccione una Opción</option>
                  <option value='Terminado'>Terminado</option>
                  <option value='En curso'>Vigente</option>
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
