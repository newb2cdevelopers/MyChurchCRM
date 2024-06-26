import React, { useState, useRef, useEffect } from 'react';
import styles from "../styles.module.css";
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

export default function ChurchMembersList() {

    const [open, setOpen] = useState(false);
    const [isUpdateRequired, setIsUpdateRequired] = useState(false);
    const [members, setMembers] = useState([]);
    const [membersList, setMembersList] = useState([]);
    const user = useSelector(state => state.user);
    const handleOpen = () => {
        setIsUpdateRequired(false);
        setOpen(true);
    }
    let navigate = useNavigate();
    const dispatch = useDispatch();

    const BASE_URL = B2C_BASE_URL;

    const getMembers = async () => {

        const headers= getAuthHeaders(user.token);
        //setLoading(true);
        return await genericGetService(`${BASE_URL}/member?churchId=${user.selectedChurchId}`, headers);
    }

    useEffect(() => {

        dispatch(selectedMemberData({
            selectedMemberData: null
        }));

        getMembers().then(data => {
            //setLoading(false);
            if (data[0]) {
                setMembers(data[0]);
                setMembersList(data[0])
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

    const selectedMemberToEdit = (document, route) => {

        let _selectedMember = members.filter(member => {
            return member.documentNumber === document
        });

        dispatch(selectedMemberData({
            selectedMemberData: _selectedMember[0]
        }));

        navigateToManageMembers(route);
    }



    const searchMember = (document) => {

        if (document !== '' && document.length >= 3) {
            let _filteredMembers = members.filter(member => {
                return member.documentNumber.toString().indexOf(document) >= 0 ||
                 (member.fullName.toLowerCase().indexOf(document) >= 0 || member.fullName.toUpperCase().indexOf(document) >= 0)
            });

            if (_filteredMembers && _filteredMembers.length > 0) {
                setMembersList(_filteredMembers)
            }
            else setMembersList(members)
        }
        else setMembersList(members)
    }

    return (
        <div className={styles.containerVerifyAsistents}>
            <div className={styles.tableMembersContainer}>
                <div className={styles.searchContainer}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>Buscar por número de documento o nombre: </span>
                        <input className={styles.inputField} type="text" id="idTxtMember" onChange={(e) => { searchMember(e.target.value) }} placeholder={"Ingrese el # documento o nombre"} />
                        <span>Cantidad de registros: {membersList.length}</span>
                    </div>
                    <div className={styles.createNewMemberContainer}>
                        <div className={styles.createNewButton} >
                            <div className="tooltip right" onClick={() => navigateToManageMembers("/consolidation")}>
                                <span className="tiptext" >Crear nuevo</span>
                                <AddCircleIcon></AddCircleIcon>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.tableVerifyAsistents}>
                        <thead>
                            <tr>
                                <th>Acciones</th>
                                <th><p>Identificación</p></th>
                                <th><p>Nombre completo</p></th>
                                <th><p>Frente o área de trabajo</p></th>
                                <th><p>Dirección</p></th>
                                <th><p>Teléfono</p></th>
                                <th><p>Celular</p></th>
                                <th><p>Correo</p></th>
                                <th><p>Años en la iglesia</p></th>
                                <th><p>¿Bautizado?</p></th>
                            </tr>
                        </thead>
                        <tbody>
                            {membersList && membersList.length > 0 ?
                                membersList.map((member, index) => {
                                    return <tr>
                                           <td>
                                            <div>
                                                <div className="tooltip right" onClick={(e) => { selectedMemberToEdit(member.documentNumber, "/consolidation") }}>
                                                    <span className="tiptext" >Editar</span>
                                                    <ModeEditIcon />
                                                </div>
                                                <div className="tooltip right" onClick={(e) => { selectedMemberToEdit(member.documentNumber, "/cv-member") }}>
                                                    <span className="tiptext" >Ver perfil</span>
                                                    <VisibilityIcon />
                                                </div>
                                            </div>
                                        </td>
                                        <td>{member.documentNumber}</td>
                                        <td>{/*member.fullName.split(' ').length === 2 ?
                                                member.fullName.split(' ')[0].charAt(0).toUpperCase() +
                                                member.fullName.split(' ')[0].slice(1) + ' ' +
                                                member.fullName.split(' ')[1].charAt(0).toUpperCase() +
                                                member.fullName.split(' ')[1].slice(1) :
                                            member.fullName.split(' ').length === 3 ?
                                                member.fullName.split(' ')[0].charAt(0).toUpperCase() +
                                                member.fullName.split(' ')[0].slice(1) + ' ' +
                                                member.fullName.split(' ')[1].charAt(0).toUpperCase() +
                                                member.fullName.split(' ')[1].slice(1) + ' ' +
                                                member.fullName.split(' ')[2].charAt(0).toUpperCase() +
                                                member.fullName.split(' ')[2].slice(1) :
                                            member.fullName.split(' ').length === 4 || member.fullName.split(' ').length === 5 ?
                                                member.fullName.split(' ')[0].charAt(0).toUpperCase() + 
                                                member.fullName.split(' ')[0].slice(1) + ' ' +
                                                member.fullName.split(' ')[1].charAt(0).toUpperCase() +
                                                member.fullName.split(' ')[1].slice(1) + ' ' +
                                                member.fullName.split(' ')[2].charAt(0).toUpperCase() +
                                                member.fullName.split(' ')[2].slice(1) + ' ' +
                                                member.fullName.split(' ')[3].charAt(0).toUpperCase() +
                                                member.fullName.split(' ')[3].slice(1) :*/
                                                member.fullName.toUpperCase() 
                                        
                                            }</td>
                                        <td>{member.workfront ? member.workfront.name : ''}</td>
                                        <td>{member.address}</td>
                                        <td>{member.landLine}</td>
                                        <td>{member.mobilePhone}</td>
                                        <td>{member.email}</td>
                                        <td>{member.yearInChurch}</td>
                                        <td>{member.isBaptised ? 'Si' : 'No'}</td>
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
        </div>
    )
}