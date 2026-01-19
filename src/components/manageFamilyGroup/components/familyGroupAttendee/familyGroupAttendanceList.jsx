import React, { useState, useRef, useEffect } from 'react';
import styles from "./styles.module.css";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
//import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
//import { genericGetService, getAuthHeaders } from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../../constants';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useSelector } from 'react-redux';
//import { selectedMemberData } from "../../../features/members/membersSlice";
//import data from './mockdata.json';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import FamilyGroupAttendanceForm from '../familyGroupAttendee/familyGroupAttendanceForm';

export default function FamilyGroupAttendanceList({ perfil, familyGroupId }) {

    const [open, setOpen] = useState(false);
    const [isUpdateRequired, setIsUpdateRequired] = useState(false);
    const [familyGroups, setFamilyGroups] = useState([]);
    const [familyGroupsList, setFamilyGroupsList] = useState([]);
    const [selecteditem, setSelectedItem] = useState(null);
    const user = useSelector(state => state.user);


    console.log(perfil)
    const data = [
        {
            "fecha": "01-02-2025",
            "Clase": "Hombre insensato ó sabio",
            "Observaciones": "Se realizó con exito, dos miembros nuevos",
            "Integrantes": "Camilo jímenez, Andrea Escobar, Orlando Cano, Isabella Pérez"
        },
        {
            "fecha": "01-02-2025",
            "Clase": "Hombre insensato ó sabio",
            "Observaciones": "Se realizó con exito, dos miembros nuevos",
            "Integrantes": "Camilo jímenez, Andrea Escobar, Orlando Cano, Isabella Pérez"
        },
        {
            "fecha": "01-02-2025",
            "Clase": "Hombre insensato ó sabio",
            "Observaciones": "Se realizó con exito, dos miembros nuevos",
            "Integrantes": "Camilo jímenez, Andrea Escobar, Orlando Cano, Isabella Pérez"
        },
        {
            "fecha": "01-02-2025",
            "Clase": "Hombre insensato ó sabio",
            "Observaciones": "Se realizó con exito, dos miembros nuevos",
            "Integrantes": "Camilo jímenez, Andrea Escobar, Orlando Cano, Isabella Pérez"
        },
        {
            "fecha": "01-02-2025",
            "Clase": "Hombre insensato ó sabio",
            "Observaciones": "Se realizó con exito, dos miembros nuevos",
            "Integrantes": "Camilo jímenez, Andrea Escobar, Orlando Cano, Isabella Pérez"
        },
        {
            "fecha": "01-02-2025",
            "Clase": "Hombre insensato ó sabio",
            "Observaciones": "Se realizó con exito, dos miembros nuevos",
            "Integrantes": "Camilo jímenez, Andrea Escobar, Orlando Cano, Isabella Pérez"
        }
    ]

    const handleOpen = () => {
        setIsUpdateRequired(false);
        setOpen(true);
    }

    let navigate = useNavigate();
    const dispatch = useDispatch();

    const BASE_URL = B2C_BASE_URL;

    const getFamilyGroupList = async () => {

        //const headers= getAuthHeaders(user.token);
        //setLoading(true);
        //return await genericGetService(`${BASE_URL}/member?churchId=${user.selectedChurchId}`, headers);

        return data;
    }

    useEffect(() => {

        /* dispatch(selectedMemberData({
             selectedMemberData: null
         }));*/

        getFamilyGroupList().then(data => {
            //setLoading(false);
            if (data[0]) {
                setFamilyGroups(data);
                setFamilyGroupsList(data)
                return;
            }
            alert("Error");
        });
    }, []);

    const navigateToManageMembers = (route) => {
        /*dispatch(selectedEventIdForBooking({
          selectedEventId: eventId
        }));*/

        return navigate(route);
    }

    const selectedFamilyGroupToEdit = (name, route) => {

        let _selectedFamilyGroupAntendee = familyGroups.filter(familyGroup => {
            return familyGroup.Nombre === name
        });

        /*dispatch(selectedMemberData({
            selectedMemberData: _selectedMember[0]
        }));*/
        setSelectedItem(_selectedFamilyGroupAntendee)
        setIsUpdateRequired(false);
        setOpen(true);
        //navigateToManageMembers(route);
    }

    const searchFamilyGroup = (name) => {

        if (name !== '' && name.length >= 3) {
            let _filteredFamilyGroups = familyGroups.filter(familyGroup => {
                return familyGroup.Nombre.toLowerCase().indexOf(name.toLowerCase()) >= 0
            });

            if (_filteredFamilyGroups && _filteredFamilyGroups.length > 0) {
                setFamilyGroupsList(_filteredFamilyGroups)
            }
            else setFamilyGroupsList(familyGroups)
        }
        else setFamilyGroupsList(familyGroups)
    }

    return (
        <div className={styles.MainContainer}>
            <div>

                <div style={{ display: "inline-block" }}>
                    {perfil !== 'coordinator' ?
                        <div className={styles.detailsFamilyGroupContainer}>
                            <div class="input-group-sm mb-3">
                                <label style={{ fontWeight: "700" }}>
                                    Código grupo familiar:&nbsp;&nbsp;</label>
                                <label style={{ fontWeight: "400" }}>
                                    001&nbsp;</label>
                                <label style={{ fontWeight: "700" }}>
                                    Líder Pricipal:&nbsp;</label>
                                <label style={{ fontWeight: "400" }}>
                                    Javier Hernández&nbsp;</label>
                                <label style={{ fontWeight: "700" }}>
                                    Dirección:&nbsp;</label>
                                <label style={{ fontWeight: "400" }}>
                                    Carrera 45 # 79-50 Barrio Manrique&nbsp;</label>
                            </div>
                        </div>
                        : <></>}
                    <div>
                        <div class="input-group flex-nowrap input-group-sm mb-3">
                            <span class="input-group-text" id="inputGroup-sizing-sm" style={{ fontWeight: "700" }}>
                                Buscar por nombre del integrante:</span>
                            <input type="text" class="form-control" placeholder="Ingrese el nombre"
                                aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"
                                onChange={(e) => { searchFamilyGroup(e.target.value) }} />
                        </div>
                        <span style={{ fontWeight: "700" }}>
                            <p style={{ marginRight: "600px" }}>Cantidad de registros: {familyGroupsList.length}</p>
                        </span>
                    </div>
                    <div>
                        <div>
                            <div className={styles.createNewContainer}
                                onClick={() => handleOpen()}>
                                <AddCircleIcon style={{ height: "40px", width: "40px" }}></AddCircleIcon>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${styles.tableContainer} table-responsive-lg`}>
                    <table className={`${styles.table} table table-striped table-hover table-dark table-borderless`}>
                        <thead>
                            <tr>
                                <th>Acciones</th>
                                <th>Fecha</th>
                                <th>Clase Enseñada</th>
                                <th>Asistentes</th>
                                <th>Observaciones</th>
                            </tr>
                        </thead>
                        <tbody class="table-group-divider">
                            {familyGroupsList && familyGroupsList.length > 0 ?
                                familyGroupsList.map((familyGroup, index) => {
                                    return <tr>
                                        <td>
                                            <div style={{ cursor: "pointer" }} onClick={(e) => { selectedFamilyGroupToEdit(familyGroup.Nombre, "/IntegrantesGruposFamiliares") }}>
                                                <ModeEditIcon />
                                            </div>
                                        </td>
                                        <td>{familyGroup.fecha}</td>
                                        <td>{familyGroup.Clase}</td>
                                        <td>{familyGroup.Integrantes}</td>
                                        <td>{familyGroup.Observaciones}</td>
                                    </tr>
                                })
                                : <tr>
                                    <td style={{ textAlign: 'center' }}>Sin resultados</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <FamilyGroupAttendanceForm
                open={open}
                setOpen={setOpen}
                setIsUpdateRequired={setIsUpdateRequired}
                itemToEdit={selecteditem}
            />
        </div>
    )
}