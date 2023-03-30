import React, { useState, useRef, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { genericPostService, getAuthHeaders, genericPutService } from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';
import styles from "../../consolidation/styles.module.css";

const validationSchema = yup.object({
  documentNumber: yup
    .string('Ingrese la cédula')
    .required('El numero de documento es obligatorio'),
  fullName: yup
    .string('Ingrese el nombre completo')
    .required('El nombre completo es obligatorio'),
  address: yup
    .string('Ingrese la dirección')
    .required('La dirección es obligatoria'),
  housingType: yup
    .string('Ingrese el tipo de vivienda')
    .required('El tipo de vivienda obligatorio'),
  mobilePhone: yup
    .string('Ingrese el número del celular')
    .required('El número de celular es obligatorio'),
  email: yup
    .string('Ingrese el correo')
    .required('El correo es obligatorio')
    .email("El correo no es válido"),
  birthDate: yup
    .date()
    .required('la fecha es obligatoria'),
  maritalStatus: yup
    .string('Seleccione el estado civil')
    .required('El estado civil es obligatorio'),
  occupation: yup
    .string('Ingrese la ocupación')
    .required('La ocupación es obligatoria'),
  conversionyear: yup
    .number()
    .positive("El campo debe sere mayor a 0"),
  yearInChurch: yup
    .number()
    .positive("El campo debe sere mayor a 0")
});

export default function NewMember() {

  const user = useSelector(state => state.user);

  const initialValues = {
    documentNumber: '',
    documentType: '',
    fullName: '',
    address: '',
    housingType: '',
    landLine: '',
    mobilePhone: '',
    email: '',
    birthDate: '',
    maritalStatus: '',
    educationalLevel: '',
    occupation: '',
    conversionyear: 0,
    yearInChurch: 0,
    isBaptised: false
  };

  const formik = useFormik({
    initialValues: initialValues,

    validationSchema: validationSchema,
    onSubmit: async (values) => {

      var payload = { ...values, churchId: user.selectedChurchId };
      const results = await genericPostService(`${B2C_BASE_URL}/member`, payload, getAuthHeaders(user.token));

      if (results[1]) {
        alert("Se ha presentado un error")
      } else {
        if (results[0].isSuccessful) {
          alert("Se regitró un miembro nuevo exitosamente")
        } else {
          alert(results[0].message)
        }
      }

    },
  });

  return (
    <div className={styles.containerVerifyAsistents}>
      <form onSubmit={formik.handleSubmit} >
        <div className={styles.tabContainer}>
          <div className={styles.entryIdTxtFullName}>
            <label for='documentNumber'>Número de Documento:</label>
            <input
              name='documentNumber'
              type='text'
              onChange={formik.handleChange}
              className={styles.inputDataIdTxtFullName}
              value={formik.values.documentNumber}
              id='documentNumber'
            />
          </div>
          {formik.errors.documentNumber && formik.touched.documentNumber ? (
            <p className={styles.errorMessage}>{formik.errors.documentNumber}</p>
          ) : null}
          <div className={styles.entryIdTxtFullName}>
            <label for='fullName'>Nombre completo:</label>
            <input
              name='fullName'
              type='text'
              onChange={formik.handleChange}
              className={styles.inputDataIdTxtFullName}
              value={formik.values.fullName}
              id='fullName'
            />
          </div>
          {formik.errors.fullName && formik.touched.fullName ? (
            <p className={styles.errorMessage}>{formik.errors.fullName}</p>
          ) : null}
          <div className={styles.entryIdTxtAddress}>
            <label for='address'>Barrio:</label>
            <input
              name='address'
              id='address'
              type='text'
              onChange={formik.handleChange}
              value={formik.values.address}
              className={styles.inputDataIdTxtAddress}
            />
          </div>
          {formik.errors.address && formik.touched.address ? (
            <p className={styles.errorMessage}>{formik.errors.address}</p>
          ) : null}
          <div className={styles.entryIdTxtPhone}>
            <label for='mobilePhone'>Teléfono / Celular:</label>
            <input
              id='mobilePhone'
              name='mobilePhone'
              type='text'
              onChange={formik.handleChange}
              value={formik.values.mobilePhone}
              className={styles.inputDataIdTxtPhone}
            />
          </div>
          {formik.errors.mobilePhone && formik.touched.mobilePhone ? (
            <p className={styles.errorMessage}>{formik.errors.mobilePhone}</p>
          ) : null}
        </div>
        <div className={styles.buttonContainer}>
          <button type="submit" disabled={!formik.dirty} className={styles.buttonClass}>Guardar</button>
        </div>
      </form>
    </div>
  )
}