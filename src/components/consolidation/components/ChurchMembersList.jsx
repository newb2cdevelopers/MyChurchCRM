import React, { useState, useRef, useEffect } from 'react';
import styles from "../styles.module.css";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { genericGetService, getAuthHeaders } from '../../../api/externalServices';
import { B2C_BASE_URL } from '../../../constants';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useSelector } from 'react-redux';
import { selectedMemberData } from "../../../features/members/membersSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

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

        const headers = getAuthHeaders(user.token);
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
        <div className={styles.mainContainer}>
            <div className={styles.infoContainer}>
                <div class="mb-3">
                    <label for="idTxtMember" class="form-label">Buscar por número de documento o nombre:</label>
                    <input type="text" class="form-control form-control-dark" id="idTxtMember"
                        onChange={(e) => { searchMember(e.target.value) }} placeholder={"Ingrese el # documento o nombre"}
                        style={{ border: "1px solid grey" }} />
                </div>
                <div>
                    <label for="idTxtMember" class="form-label">Cantidad de registros: {membersList.length}</label>
                </div>
                <div className={styles.createNewMemberContainer}>
                    <div onClick={() => navigateToManageMembers("/consolidation")}>
                        <AddCircleIcon style={{ height: "40px", width: "40px" }}></AddCircleIcon>
                    </div>
                </div>
            </div>
            <div className={styles.tableContainer}>
                <table className={`${styles.table} table table-striped table-hover table-dark table-borderless`}>
                    <thead>
                        <tr>
                            <th><p>Acciones</p></th>
                            <th><p>Identificación</p></th>
                            <th><p>Nombre completo</p></th>
                            <th><p>Frente o área de trabajo</p></th>
                            <th><p>Dirección</p></th>
                            <th><p>Teléfono / Celular</p></th>
                            <th><p>Correo</p></th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        {membersList && membersList.length > 0 ?
                            membersList.map((member, index) => {
                                return <tr>
                                    <td>
                                        <div>
                                            <div onClick={(e) => { selectedMemberToEdit(member.documentNumber, "/consolidation") }}>
                                                <ModeEditIcon />
                                            </div>
                                            <div onClick={(e) => { selectedMemberToEdit(member.documentNumber, "/cv-member") }}>
                                                <VisibilityIcon />
                                            </div>
                                        </div>
                                    </td>
                                    <td><p>{member.documentNumber}</p></td>
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
                                    <td><p>{member.workfront ? member.workfront.name : ''}</p></td>
                                    <td><p>{member.address}</p></td>
                                    <td><p>{`${member.landLine}  ${member.mobilePhone}`}</p></td>
                                    <td><p>{member.email}</p></td>
                                </tr>
                            })
                            : <tr>
                                <td style={{ textAlign: 'center' }}><p>Sin resultados</p></td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}