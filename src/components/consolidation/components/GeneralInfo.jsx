import React, { useState, useRef, useEffect, useContext } from 'react';
import MemberContext from '../../../contexts/MemberContext';
import styles from "../styles.module.css";
import { B2C_BASE_URL } from '../../../constants';
import Switch from '@mui/material/Switch';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { genericPostService, getAuthHeaders, genericPutService, genericGetService } from '../../../api/externalServices';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { style } from '@mui/system';

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
        <div className={styles.infoGeneralContainer}>
            <form onSubmit={formik.handleSubmit} >
                <div>
                    <div class="mb-3">
                        <span
                            style={{color: "white", width:"257px" }}>Tipo de documento de identidad:</span>
                        <select name='documentType' className={`${styles.selectorsInfoGeneral} form-select`}
                            id='documentType'
                            onChange={formik.handleChange} value={formik.values.documentType}>
                            <option value={""}>Seleccione una Opción</option>
                            <option value={"CC"}>Cédula</option>
                            <option value={"TI"}>Tarjeta de identidad</option>
                            <option value={"RC"}>Registro civil</option>
                            <option value={"CE"}>Cédula de extranjería</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <span 
                            style={{color: "white", width:"257px" }}
                        >Número de Documento:</span>
                        <input
                            class="form-control"
                            name='documentNumber'
                            type='text'
                            onChange={formik.handleChange}
                            value={formik.values.documentNumber}
                            id='documentNumber'
                            aria-label="documentNumber" aria-describedby="basic-addon1"
                            style={{ border: "1px solid grey" }} />
                    </div>
                    {formik.errors.documentNumber && formik.touched.documentNumber ? (
                        <p className={styles.errorMessage}>{formik.errors.documentNumber}</p>
                    ) : null}
                    <div class="mb-3">
                        <span 
                            style={{color: "white", width:"257px" }}
                            >Nombre completo:</span>
                        <input
                            class="form-control"
                            name='fullName'
                            type='text'
                            onChange={formik.handleChange}
                            className={styles.inputDataIdTxtFullName}
                            value={formik.values.fullName}
                            id='fullName'
                            aria-label="documentNumber" aria-describedby="basic-addon1"
                            style={{ border: "1px solid grey" }} />
                    </div>
                    {formik.errors.fullName && formik.touched.fullName ? (
                        <p className={styles.errorMessage}>{formik.errors.fullName}</p>
                    ) : null}
                    <div class="mb-3">
                        <span 
                            style={{color: "white", width:"257px" }}
                            >Dir. de residencia:</span>
                        <input
                            class="form-control"
                            name='address'
                            id='address'
                            type='text'
                            onChange={formik.handleChange}
                            value={formik.values.address}
                            aria-label="documentNumber" aria-describedby="basic-addon1"
                            style={{ border: "1px solid grey" }} />
                    </div>
                    {formik.errors.address && formik.touched.address ? (
                        <p className={styles.errorMessage}>{formik.errors.address}</p>
                    ) : null}

                    <div class="mb-3">
                        <span 
                            style={{color: "white", width:"257px" }}
                            >Tipo de vivienda:</span>
                        <select name='documentType' className={`${styles.selectorsInfoGeneral} form-select`}
                            id='housingType'
                            onChange={formik.handleChange} value={formik.values.housingType}>
                            <option value={""}>Seleccione una Opción</option>
                            <option value={"Arrendada"}>Arrendada</option>
                            <option value={"Propia"}>Propia</option>
                            <option value={"Familiar"}>Familiar</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <span 
                            style={{color: "white", width:"257px" }}
                            >Telefóno fijo:</span>
                        <input
                            class="form-control"
                            type='text'
                            name='landLine'
                            id='landLine'
                            onChange={formik.handleChange}
                            value={formik.values.landLine}
                            aria-label="documentNumber" aria-describedby="basic-addon1"
                            style={{ border: "1px solid grey" }} />
                    </div>
                    <div class="mb-3">
                        <span 
                            style={{color: "white", width:"257px" }}
                            >Celular:</span>
                        <input
                            class="form-control"
                            id='mobilePhone'
                            name='mobilePhone'
                            type='text'
                            onChange={formik.handleChange}
                            value={formik.values.mobilePhone}
                            aria-label="documentNumber" aria-describedby="basic-addon1"
                            style={{ border: "1px solid grey" }} />
                    </div>
                    {formik.errors.mobilePhone && formik.touched.mobilePhone ? (
                        <p className={styles.errorMessage}>{formik.errors.mobilePhone}</p>
                    ) : null}
                    <div class="mb-3">
                        <span 
                            style={{color: "white", width:"257px" }}>Correo:</span>
                        <input
                            class="form-control"
                            id='email'
                            name='email'
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            type='email'
                            aria-label="documentNumber" aria-describedby="basic-addon1"
                            style={{ border: "1px solid grey" }} />
                    </div>
                    {formik.errors.email && formik.touched.email ? (
                        <p className={styles.errorMessage}>{formik.errors.email}</p>
                    ) : null}
                    <div class="mb-3">
                        <span 
                            style={{color: "white", width:"257px" }}>Fecha de nacimiento:</span>
                        <input
                            class="form-control"
                            name='birthDate'
                            id='birthDate'
                            type='date'
                            onChange={formik.handleChange}
                            value={formik.values.birthDate ? formik.values.birthDate.split('T')[0] : ""}
                            aria-label="documentNumber" aria-describedby="basic-addon1"
                            style={{ border: "1px solid grey" }} />
                    </div>
                    <div class="mb-3">
                        <span 
                            style={{color: "white", width:"257px" }}>Año de conversión:</span>
                        <input
                            class="form-control"
                            id='conversionyear'
                            name='conversionyear'
                            type='text'
                            onChange={formik.handleChange}
                            value={formik.values.conversionyear}
                            aria-label="documentNumber" aria-describedby="basic-addon1"
                            style={{ border: "1px solid grey" }} />
                    </div>
                    <div class="mb-3">
                        <span 
                            style={{color: "white", width:"257px" }}>Años en la Iglesia:</span>
                        <input
                            class="form-control"
                            id='yearInChurch'
                            name='yearInChurch'
                            type='text'
                            onChange={formik.handleChange}
                            value={formik.values.yearInChurch}
                            aria-label="documentNumber" aria-describedby="basic-addon1"
                            style={{ border: "1px solid grey" }} />
                    </div>
                    <div class="mb-3">
                        <span 
                            style={{color: "white", width:"257px" }}>¿Bautizado?</span>
                        <Switch
                            class="form-control"
                            id='isBaptised'
                            name="isBaptised"
                            onChange={formik.handleChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                            defaultChecked={formik.values.isBaptised} />
                    </div>
                    <div class="mb-3">
                        <span 
                            style={{color: "white", width:"257px" }}>Estado civil:</span>
                        <select name='maritalStatus' className={`${styles.selectorsInfoGeneral} form-select`}
                            id='maritalStatus'
                            onChange={formik.handleChange} value={formik.values.maritalStatus}>
                            <option value={""}>Seleccione una Opción</option>
                            <option value={"Casado"}>Casado</option>
                            <option value={"Divoriciado"}>Divorciado</option>
                            <option value={"Soltero"}>Soltero</option>
                            <option value={"Viudo"}>Viudo</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <span 
                            style={{color: "white", width:"257px" }}>Nivel Educativo:</span>
                        <select className={`${styles.selectorsInfoGeneral} form-select`}
                            onChange={formik.handleChange}
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
                    <div class="mb-3">
                        <span 
                            style={{color: "white", width:"257px" }}>Ocupación:</span>
                        <select className={`${styles.selectorsInfoGeneral} form-select`}
                            onChange={formik.handleChange}
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
                    <div class="mb-3">
                        <span 
                            style={{color: "white", width:"257px" }}>Frente o Área de trabajo:</span>
                        <select className={`${styles.selectorsInfoGeneral} form-select`}
                            onChange={formik.handleChange}
                            id='workfront'
                            name='workfront' value={formik.values.workfront ? formik.values.workfront._id : ''}>
                            <option value={""}>Seleccione una Opción</option>
                            {
                                workFrontList.map((item, index) => {
                                    return <option value={item._id}>{item.name}</option>
                                })
                            }
                        </select>
                    </div>
                    <div class="mb-3">
                        <span 
                            style={{color: "white", width:"257px" }}>Observaciones</span>
                        <textarea class="form-control" aria-label="With textarea"
                            name='comments'
                            id='comments'
                            onChange={formik.handleChange}
                            value={formik.values.comments}
                            style={{ border: "1px solid grey", width:"520px" }}
                        ></textarea>
                    </div>
                </div>
                <div className={`${styles.buttons} btn-group`} role="group" aria-label="Basic example">
                    <button class="btn btn-success" type="submit" disabled={!formik.dirty}>Guardar</button>
                </div>
            </form>
        </div>
    )
}