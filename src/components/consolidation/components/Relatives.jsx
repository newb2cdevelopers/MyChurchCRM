import React, { useState, useRef, useEffect, useContext } from 'react';
import styles from "../styles.module.css";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import RelativesForm from './RelativesForm';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import './toolTip.css'
import MemberContext from '../../../contexts/MemberContext';

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
        <div className={styles.containerVerifyAsistents}>
            <div className={styles.tabContainer}>
                <div className={styles.createNewRelativeContainer}>
                    <div className={styles.createNewButton} >
                        <div className="tooltip right" onClick={() => handleOpen()}>
                            <span className="tiptext" >Crear nuevo</span>
                            <AddCircleIcon></AddCircleIcon>
                        </div>
                    </div>
                </div>
                <div className={styles.relativeTableContainer}>
                    <table className={styles.tableRelatives}>
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
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {relatives && relatives.length > 0 ?
                                relatives.map((relative, index) => {
                                    return <tr>
                                        <td>{relative.name}</td>
                                        <td>{relative.documentNumber}</td>
                                        <td>{relative.address}</td>
                                        <td>{relative.mobilePhone}</td>
                                        <td>{relative.email}</td>
                                        <td>{relative.birthDate.split('T')[0]}</td>
                                        <td>{relative.occupation}</td>
                                        <td>{relative.kinship}</td>
                                        <td>{relative.comments}</td>
                                        <td>
                                            <div>
                                                <div className="tooltip right" onClick={(e) => { selectedRelative(relatives[index]) }}>
                                                    <span className="tiptext" >Editar</span>
                                                    <ModeEditIcon></ModeEditIcon>
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
            </div>
            <RelativesForm
                open={open}
                setOpen={setOpen}
                setIsUpdateRequired={setIsUpdateRequired}

            />
        </div>
    )
}