import React, { useState, useRef, useEffect, useContext } from 'react';
import MemberContext from '../../../contexts/MemberContext';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import styles from "../styles.module.css";
import { B2C_BASE_URL } from '../../../constants';
import { display } from '@mui/system';
import Switch from '@mui/material/Switch';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { genericPostService, getAuthHeaders, genericPutService, genericGetService } from '../../../api/externalServices';

const validationSchema = yup.object({
    documentNumber: yup
        .string('Ingrese la cédula')
        .required('El número de documento es obligatorio'),
    fullName: yup
        .string('Ingrese el nombre completo')
        .required('El nombre completo es obligatorio'),
    address: yup
        .string('Ingrese la dirección')
        .required('La dirección es obligatoria'),
    mobilePhone: yup
        .string('Ingrese el número del celular')
        .required('El número de celular es obligatorio'),
    email: yup
        .string('Ingrese el correo')
        .email("El correo no es válido")
});

export default function GeneralInfo() {

    const user = useSelector(state => state.user);
    const memberContext = useContext(MemberContext);

    const isEditting = memberContext.currentMember !== null;

    const [workFrontList, setWorkFrontList] = useState([])

  const getWorkFrontListByChurch = async () => {
    return await genericGetService(`${B2C_BASE_URL}/workfront/workfrontsByChurch/${user.selectedChurchId}`);
  }
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
        isBaptised: false,
        workfront: '',
        comments: ''
    };

    const formik = useFormik({
        initialValues: isEditting ? memberContext.currentMember : initialValues,

        validationSchema: validationSchema,
        onSubmit: async (values) => {


            if (isEditting) {
                const payload = { ...values, churchId: user.selectedChurchId };

                const editPayload = {
                    fullName: payload.fullName,
                    address: payload.address,
                    housingType: payload.housingType,
                    landLine: payload.landLine,
                    mobilePhone: payload.mobilePhone,
                    birthDate: payload.birthDate,
                    maritalStatus: payload.maritalStatus,
                    educationalLevel: payload.educationalLevel,
                    occupation: payload.occupation,
                    conversionyear: payload.conversionyear,
                    isBaptised: payload.isBaptised,
                    yearInChurch: payload.yearInChurch,
                    documentType: payload.documentType,
                    email: payload.email,
                    workfront: payload.workfront,
                    comments: payload.comments
                };

                const results = await genericPutService(`${B2C_BASE_URL}/member/updateMemberInfo/${memberContext.currentMember._id}`, editPayload, getAuthHeaders(user.token));

                if (results[1]) {
                    alert("Se ha presentado un error")
                } else {
                    if (results[0].isSuccessful) {
                        memberContext.setAreTabsDisabled(false);
                        memberContext.setValue(1);
                        memberContext.setCurrentMember(results[0].data);
                    } else {
                        alert(results[0].message)
                    }
                }

            } else {
                var payload = { ...values, churchId: user.selectedChurchId, documentNumber: values.documentNumber.trim(), email: values.email.trim() };
                const results = await genericPostService(`${B2C_BASE_URL}/member`, payload, getAuthHeaders(user.token));

                if (results[1]) {
                    alert("Se ha presentado un error")
                } else {
                    if (results[0].isSuccessful) {
                        memberContext.setAreTabsDisabled(false);
                        memberContext.setValue(1);
                        memberContext.setCurrentMember(results[0].data);
                    } else {
                        alert(results[0].message)
                    }
                }
            }
        },
    });

    return (
        <div className={styles.containerVerifyAsistents}>
            <form onSubmit={formik.handleSubmit} >
                <div className={styles.tabContainer}>
                    <div className={styles.entryIdTxtPhone}>
                        <label for='documentType'>Tipo de documento de identidad:</label>
                        <select name='documentType' className={styles.inputDataIdTxtHousingType}
                            id='documentType'
                            onChange={formik.handleChange} value={formik.values.documentType}>
                            <option value={""}>Seleccione una Opción</option>
                            <option value={"CC"}>Cédula</option>
                            <option value={"TI"}>Tarjeta de identidad</option>
                            <option value={"RC"}>Registro civil</option>
                            <option value={"CE"}>Cédula de extranjería</option>
                        </select>
                    </div>
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
                        <label for='address'>Dir. de residencia:</label>
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
                        <label for='housingType'>Tipo de vivienda:</label>
                        <select name='housingType' className={styles.inputDataIdTxtHousingType}
                            id='housingType'
                            onChange={formik.handleChange} value={formik.values.housingType}>
                            <option value={""}>Seleccione una Opción</option>
                            <option value={"Arrendada"}>Arrendada</option>
                            <option value={"Propia"}>Propia</option>
                            <option value={"Familiar"}>Familiar</option>
                        </select>
                    </div>
                    <div className={styles.entryIdTxtPhone}>
                        <label for='landLine'>Telefóno fijo:</label>
                        <input
                            type='text'
                            name='landLine'
                            id='landLine'
                            onChange={formik.handleChange}
                            value={formik.values.landLine}
                            className={styles.inputDataIdTxtPhone}
                        />
                    </div>
                    <div className={styles.entryIdTxtPhone}>
                        <label for='mobilePhone'>Celular:</label>
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
                    <div className={styles.entryIdTxtPhone}>
                        <label for='email'>Correo:</label>
                        <input type='text'
                            id='email'
                            name='email'
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            className={styles.inputDataIdTxtEmail}
                        />
                    </div>
                    {formik.errors.email && formik.touched.email ? (
                        <p className={styles.errorMessage}>{formik.errors.email}</p>
                    ) : null}
                    <div className={styles.entryIdTxtPhone}>
                        <label for='birthDate'>Fecha de nacimiento:</label>
                        <input
                            name='birthDate'
                            id='birthDate'
                            type='date'
                            onChange={formik.handleChange}
                            value={formik.values.birthDate ? formik.values.birthDate.split('T')[0] : ""}
                            className={styles.inputDataIdTxtBirthDate}
                        />
                    </div>
                    <div className={styles.entryIdTxtPhone}>
                        <label for='conversionyear'>Año de conversión:</label>
                        <input
                            id='conversionyear'
                            name='conversionyear'
                            type='text'
                            onChange={formik.handleChange}
                            value={formik.values.conversionyear}
                            className={styles.inputDataIdTxtYears}
                        />
                    </div>
                    <div className={styles.entryIdTxtPhone}>
                        <label for='yearInChurch'>Años en la Iglesia:</label>
                        <input
                            id='yearInChurch'
                            name='yearInChurch'
                            type='text'
                            onChange={formik.handleChange}
                            value={formik.values.yearInChurch}
                            className={styles.inputDataIdTxtYearsChurch}
                        />
                    </div>
                    <div className={styles.entryIdTxtPhone}>
                        <label for='yearInChurch'>¿Bautizado?</label>
                        <Switch className={styles.inputDataIdSwitch}
                            id='yearInChurch'
                            name="isBaptised"
                            onChange={formik.handleChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                            defaultChecked={formik.values.isBaptised}
                        />
                    </div>
                    <div className={styles.entryIdTxtPhone}>
                        <label for='maritalStatus'>Estado civil:</label>
                        <select className={styles.inputDataIdTxtMaritalStatus}
                            id='maritalStatus'
                            onChange={formik.handleChange} name='maritalStatus' value={formik.values.maritalStatus}>
                            <option value={""}>Seleccione una Opción</option>
                            <option value={"Casado"}>Casado</option>
                            <option value={"Divoriciado"}>Divorciado</option>
                            <option value={"Soltero"}>Soltero</option>
                            <option value={"Viudo"}>Viudo</option>
                        </select>
                    </div>
                    <div className={styles.entryIdTxtPhone}>
                        <label for='educationalLevel'>Nivel Educativo:</label>
                        <select className={styles.inputDataIdTxtEducationLevel} onChange={formik.handleChange}
                            id='educationalLevel'
                            name='educationalLevel' value={formik.values.educationalLevel}>
                            <option value={""}>Seleccione una Opción</option>
                            <option value={"Profesional"}>Profesional</option>
                            <option value={"Tecnólogo"}>Tecnólogo</option>
                            <option value={"Técnico"}>Técnico</option>
                            <option value={"Bachiller"}>Bachiller</option>
                            <option value={"Primaria"}>Primaria</option>
                            <option value={"Ninguno"}>Ninguno</option>
                        </select>
                    </div>
                    <div className={styles.entryIdTxtPhone}>
                        <label for='occupation'>Ocupación:</label>
                        <select className={styles.inputDataIdTxtOccupation} onChange={formik.handleChange}
                            id='occupation'
                            name='occupation' value={formik.values.occupation}>
                            <option value={""}>Seleccione una Opción</option>
                            <option value={"Estudiante"}>Estudiante</option>
                            <option value={"Independiente"}>Independiente</option>
                            <option value={"Ama de casa"}>Ama de casa</option>
                            <option value={"Empleado"}>Empleado</option>
                            <option value={"Pensionado"}>Pensionado</option>
                        </select>
                    </div>
                    <div className={styles.entryIdTxtPhone}>
                        <label for='workfront'>Frente o Área de trabajo:</label>
                        <select className={styles.inputDataIdTxtOccupation} onChange={formik.handleChange}
                            id='workfront'
                            name='workfront' value={formik.values.workfront ? formik.values.workfront._id: ''}>
                                <option value={""}>Seleccione una Opción</option>
                                    {
                                    workFrontList.map((item, index) => {
                                        return <option value={item._id}>{item.name}</option>
                                    })
                                    }
                        </select>
                    </div>
                    <div className={styles.entryIdTxtPhone}>
                        <label for='landLine'>Observaciones:</label>
                        <textarea
                            rows='5' cols='50'
                            type='text'
                            name='comments'
                            id='comments'
                            onChange={formik.handleChange}
                            value={formik.values.comments}
                            className={styles.inputDataIdTxtPhone}
                        />
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <button type="submit" disabled={!formik.dirty} className={styles.buttonClass}>Guardar</button>
                </div>
            </form>
        </div>
    )
}