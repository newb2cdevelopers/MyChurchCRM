import React, { useState, useRef, useEffect, useContext } from 'react';
import styles from "../styles.module.css";
import MinistryStudiesForm from './MinistryStudiesForm';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import './toolTip.css'
import MemberContext from '../../../contexts/MemberContext';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

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
        <div className={styles.relativesContainer}>
            <div className={styles.createNewRelativesContainer}>
                <div onClick={() => handleOpen()}>
                    <AddCircleIcon style={{ height: "40px", width: "40px",position: "absolute", top: "30px" }}></AddCircleIcon>
                </div>
            </div>
            <table className={`${styles.table} table table-striped table-hover table-dark table-borderless`}>
                <thead>
                    <tr>
                        <th><p>Título</p></th>
                        <th><p>Fecha Inicio</p></th>
                        <th><p>Fecha Fin</p></th>
                        <th><p>Estado</p></th>
                        <th><p>Observaciones</p></th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    {ministryStudies && ministryStudies.length > 0 ?
                        ministryStudies.map((ministryStudy, index) => {
                            return <tr>
                                <td><p>{ministryStudy.name}</p></td>
                                <td><p>{ministryStudy.startDate.split('T')[0]}</p></td>
                                <td><p>{!ministryStudy.endDate || ministryStudy.endDate === '' ? <></> : ministryStudy.endDate.split('T')[0]}</p></td>
                                <td><p>{ministryStudy.status}</p></td>
                                <td><p>{ministryStudy.comments}</p></td>
                                <td>
                                    <div>
                                        <div onClick={(e) => { selectedMinistryStudy(ministryStudies[index]) }}>
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
            <MinistryStudiesForm
                open={open}
                setOpen={setOpen}
                setIsUpdateRequired={setIsUpdateRequired}
            />
        </div>
    )
}