import React, { useState, useRef, useEffect } from 'react';
import styles from "./styles.module.css";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { genericGetService, getAuthHeaders } from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useSelector } from 'react-redux';
import { selectedMemberData } from "../../../features/members/membersSlice";
import './toolTip.css'
import { Button } from '@mui/material';
import { display } from '@mui/system';
import data from './mockdata.json';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import FamilyGroupForm from './familyGroupForm/familyGroupForm';

export default function FamilyGroupList() {

    const [open, setOpen] = useState(false);
    const [isUpdateRequired, setIsUpdateRequired] = useState(false);
    const [familyGroups, setFamilyGroups] = useState([]);
    const [familyGroupsList, setFamilyGroupsList] = useState([]);
    const user = useSelector(state => state.user);

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

    const selectedFamilyGroupToEdit = (codigo, route) => {

        let _selectedFamilyGroup = familyGroups.filter(familyGroup => {
            return familyGroup.codigo === codigo
        });

        /*dispatch(selectedMemberData({
            selectedMemberData: _selectedMember[0]
        }));*/

        navigateToManageMembers(route);
    }



    const searchFamilyGroup = (code) => {

        if (code !== '' && code.length >= 3) {
            let _filteredFamilyGroups = familyGroups.filter(familyGroup => {
                return familyGroup.codigo.toString().indexOf(code) >= 0
            });

            if (_filteredFamilyGroups && _filteredFamilyGroups.length > 0) {
                setFamilyGroupsList(_filteredFamilyGroups)
            }
            else setFamilyGroupsList(familyGroups)
        }
        else setFamilyGroupsList(familyGroups)
    }

    return (
        <div className={styles.containerVerifyAsistents}>
            <div>
                <div style={{ display: "inline-block" }}>
                    <div>
                        <div class="input-group flex-nowrap input-group-sm mb-3">
                            <span class="input-group-text" id="inputGroup-sizing-sm" style={{ fontWeight: "700" }}>
                                Buscar por código del grupo familiar:</span>
                            <input type="text" class="form-control" placeholder="Ingrese el código"
                                aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"
                                onChange={(e) => { searchFamilyGroup(e.target.value) }} />
                        </div>
                        <span style={{ fontWeight: "700" }}>
                            <p style={{ marginRight: "300px" }}>Cantidad de registros: {familyGroupsList.length}</p>
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
                    <table className="table table-striped table-hover table-dark table-borderless">
                        <thead>
                            <tr>
                                <th>Acciones</th>
                                <th>Código</th>
                                <th>Líder principal</th>
                                <th>Dirección</th>
                                <th>Barrio</th>
                                <th>Zona</th>
                                <th>Celular / Teéfono</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody class="table-group-divider">
                            {familyGroupsList && familyGroupsList.length > 0 ?
                                familyGroupsList.map((familyGroup, index) => {
                                    return <tr>
                                        <td>
                                            <div style={{ cursor: "pointer" }} onClick={(e) => { selectedFamilyGroupToEdit(familyGroup.codigo, "/AdministrarGruposamiliares") }}>
                                                <ModeEditIcon />
                                            </div>
                                        </td>
                                        <td>{familyGroup.codigo}</td>
                                        <td>{familyGroup.LiderPrincipal.toUpperCase()}</td>
                                        <td>{familyGroup.Direccion}</td>
                                        <td>{familyGroup.Barrio}</td>
                                        <td>{familyGroup.zona}</td>
                                        <td>{familyGroup.CelularTelefono}</td>
                                        <td>{familyGroup.Estado}</td>
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
            <FamilyGroupForm
                open={open}
                setOpen={setOpen}
                setIsUpdateRequired={setIsUpdateRequired}
            />
        </div>
    )
}