import React, { useState, useRef, useEffect, useContext } from 'react';
import styles from "../styles.module.css";
import WorkFrontForm from './WorkFrontForm';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import './toolTip.css'
import MemberContext from '../../../contexts/MemberContext';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

export default function WorkFronts() {

    const [open, setOpen] = useState(false);
    const [isUpdateRequired, setIsUpdateRequired] = useState(false);
    const memberContext = useContext(MemberContext);
    const [workFronts, setWorkFronts] = useState([])


    const handleOpen = () => {
        memberContext.setCurrentWorkFront(null);
        setOpen(true);
    }

    useEffect(() => {
        // If there is a selected member the tabs shoul be enabled
        setWorkFronts(memberContext.currentMember.workFronts);
    }, []);

    const selectedWorkFront = (currentWorkFront) => {
        memberContext.setCurrentWorkFront(currentWorkFront)
        setOpen(true);
    }

    return (
        <div className={styles.containerVerifyAsistents}>
            <div className={styles.tabContainer}>
                <div className={styles.createNewContainer}>
                    <div className={styles.createNewButton} >
                        <div className="tooltip right" onClick={() => handleOpen()}>
                            <span className="tiptext" >Crear nuevo</span>
                            <AddCircleIcon></AddCircleIcon>
                        </div>
                    </div>
                </div>
                <table className={styles.tableVerifyAsistents}>
                    <thead>
                        <tr>
                            <th><p>Frente / Área de trabajo</p></th>
                            <th><p>Fecha Inicio</p></th>
                            <th><p>Fecha Fin</p></th>
                            <th><p>Rol</p></th>
                            <th><p>Estado</p></th>
                            <th><p>Observaciones</p></th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workFronts && workFronts.length > 0 ?
                            workFronts.map((workFront, index) => {
                                return <tr>
                                    <td>{workFront.name}</td>
                                    <td>{workFront.startDate ? workFront.startDate.split('T')[0] : ""}</td>
                                    <td>{workFront.endDate ? workFront.endDate.split('T')[0] : ""}</td>
                                    <td>{workFront.role}</td>
                                    <td>{workFront.status}</td>
                                    <td>{workFront.comments}</td>
                                    <td>
                                        <div>
                                            <div className="tooltip right" onClick={(e) => { selectedWorkFront(workFronts[index]) }}>
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
            <WorkFrontForm
                open={open}
                setOpen={setOpen}
                setIsUpdateRequired={setIsUpdateRequired}
            />
        </div>
    )
}