import React, { useState, useRef, useEffect, useContext } from 'react';
import styles from "../styles.module.css";
import MinistryStudiesForm from './MinistryStudiesForm';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import './toolTip.css'
import MemberContext from '../../../contexts/MemberContext';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

export default function MinistryStudies() {

    const [open, setOpen] = useState(false);
    const [isUpdateRequired, setIsUpdateRequired] = useState(false);
    const memberContext = useContext(MemberContext);
    const [ministryStudies, setMinistryStudies] = useState([])


    useEffect(() => {
        // If there is a selected member the tabs shoul be enabled
        setMinistryStudies(memberContext.currentMember.ministryStudies);
    }, []);

    const selectedMinistryStudy = (currentMinistryStudy) => {
        memberContext.setCurrentMinistryStudy(currentMinistryStudy)
        setOpen(true);
    }

    const handleOpen = () => {
        memberContext.setCurrentMinistryStudy(null);
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
                            <th><p>Título</p></th>
                            <th><p>Fecha Inicio</p></th>
                            <th><p>Fecha Fin</p></th>
                            <th><p>Estado</p></th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ministryStudies && ministryStudies.length > 0 ?
                            ministryStudies.map((ministryStudy, index) => {
                                return <tr>
                                    <td>{ministryStudy.name}</td>
                                    <td>{ministryStudy.startDate.split('T')[0]}</td>
                                    <td>{!ministryStudy.endDate || ministryStudy.endDate === '' ? <></> : ministryStudy.endDate.split('T')[0]}</td>
                                    <td>{ministryStudy.status}</td>
                                    <td>
                                        <div>
                                            <div className="tooltip right" onClick={(e) => { selectedMinistryStudy(ministryStudies[index]) }}>
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
            <MinistryStudiesForm
                open={open}
                setOpen={setOpen}
                setIsUpdateRequired={setIsUpdateRequired}
            />
        </div>
    )
}