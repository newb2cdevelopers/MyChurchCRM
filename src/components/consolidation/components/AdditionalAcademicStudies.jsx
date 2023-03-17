import React, { useState, useRef, useEffect, useContext } from 'react';
import styles from "../styles.module.css";
import AddicionalAcademicStudiesForm from './AdditionalAcademicStudiesForm'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import './toolTip.css'
import MemberContext from '../../../contexts/MemberContext';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

export default function AdditionalAcademicStudies() {

    const [open, setOpen] = useState(false);

    const memberContext = useContext(MemberContext);
    const [academicStudies, setAcademicStudies] = useState([])

    useEffect(() => {
        // If there is a selected member the tabs shoul be enabled
        setAcademicStudies(memberContext.currentMember.additionalAcademicStudies);
    }, []);


    const handleOpen = () => {
        memberContext.setCurrentMemberAcademicStudy(null);
        setOpen(true);
    }

    const selectedAcademicStudy = (currentAcademicStudy) => {
        memberContext.setCurrentMemberAcademicStudy(currentAcademicStudy);
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
                            <th><p>Titulo</p></th>
                            <th><p>Institución</p></th>
                            <th><p>¿Finalizado?</p></th>
                            <th><p>Observaciones</p></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {academicStudies && academicStudies.length > 0 ?
                            academicStudies.map((studie, index) => {
                                return <tr>
                                    <td>{studie.name}</td>
                                    <td>{studie.AcademicInstitutionName}</td>
                                    <td>{studie.isFinished ? 'Si' : 'No'}</td>
                                    <td>{studie.comments}</td>
                                    <td>
                                        <div>
                                            <div className="tooltip right" onClick={(e) => { selectedAcademicStudy(academicStudies[index]) }}>
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
            <AddicionalAcademicStudiesForm
                open={open}
                setOpen={setOpen}
            />

        </div>
    )
}