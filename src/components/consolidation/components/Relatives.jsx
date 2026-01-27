import React, { useState, useRef, useEffect, useContext } from 'react';
import styles from "../styles.module.css";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import RelativesForm from './RelativesForm';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import './toolTip.css'
import MemberContext from '../../../contexts/MemberContext';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

export default function Relatives() {
    const [open, setOpen] = useState(false);
    const [isUpdateRequired, setIsUpdateRequired] = useState(false);
    const memberContext = useContext(MemberContext);
    const [relatives, setRelatives] = useState([])

    useEffect(() => {
        // If there is a selected member the tabs shoul be enabled
        setRelatives(memberContext.currentMember.relatives);
    }, []);

    const handleOpen = () => {
        memberContext.setCurrentRelative(null);
        setOpen(true);
    }

    const selectedRelative = (currentRelative) => {
        memberContext.setCurrentRelative(currentRelative)
        setOpen(true);
    }

    return (
        <div className={styles.relativesContainer}>
            <div className={styles.createNewRelativesContainer}>
                <div onClick={() => handleOpen()}>
                    <AddCircleIcon style={{ height: "40px", width: "40px",position: "absolute", top: "30px" }}></AddCircleIcon>
                </div>
            </div>
            <div>
                <table className={`${styles.table} table table-striped table-hover table-dark table-borderless`}>
                    <thead>
                        <tr>
                            <th><p>Nombre</p></th>
                            <th><p>Número de identificación</p></th>
                            <th><p>Dirección</p></th>
                            <th><p>Celular / Teléfono</p></th>
                            <th><p>Correo electrónico</p></th>
                            <th><p>Fecha de nacimiento</p></th>
                            <th><p>Ocupación</p></th>
                            <th><p>Parentesco</p></th>
                            <th><p>Obervaciones</p></th>
                            <th><p>Acciones</p></th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        {relatives && relatives.length > 0 ?
                            relatives.map((relative, index) => {
                                return <tr>
                                    <td><p>{relative.name}</p></td>
                                    <td><p>{relative.documentNumber}</p></td>
                                    <td><p>{relative.address}</p></td>
                                    <td><p>{relative.mobilePhone}</p></td>
                                    <td><p>{relative.email}</p></td>
                                    <td><p>{relative.birthDate ? relative.birthDate.split('T')[0] : ""}</p></td>
                                    <td><p>{relative.occupation}</p></td>
                                    <td><p>{relative.kinship}</p></td>
                                    <td><p>{relative.comments}</p></td>
                                    <td>
                                        <div>
                                            <div onClick={(e) => { selectedRelative(relatives[index]) }}>
                                                <ModeEditIcon style={{ cursor:"pointer" }}></ModeEditIcon>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            })
                            : <tr>
                                <td style={{ textAlign: 'center' }}>Sin resultados</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
            <RelativesForm
                open={open}
                setOpen={setOpen}
                setIsUpdateRequired={setIsUpdateRequired}

            />
        </div>
    )
}