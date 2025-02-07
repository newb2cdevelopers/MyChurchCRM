import React, { useState, useRef, useEffect, useContext } from 'react';
import styles from "../styles.module.css";
import AddicionalAcademicStudiesForm from './AdditionalAcademicStudiesForm'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import './toolTip.css'
import MemberContext from '../../../contexts/MemberContext';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

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
        <div className={styles.relativesContainer}>
            <div className={styles.createNewRelativesContainer}>
                <div className={styles.createNewButton} >
                    <div onClick={() => handleOpen()}>
                        <AddCircleIcon style={{ height: "40px", width: "40px",position: "absolute", top: "30px" }}></AddCircleIcon>
                    </div>
                </div>
            </div>
            <table className="table table-striped table-hover table-dark table-borderless">
                <thead>
                    <tr>
                        <th><p>Titulo</p></th>
                        <th><p>Institución</p></th>
                        <th><p>¿Finalizado?</p></th>
                        <th><p>Observaciones</p></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    {academicStudies && academicStudies.length > 0 ?
                        academicStudies.map((studie, index) => {
                            return <tr>
                                <td><p>{studie.name}</p></td>
                                <td><p>{studie.AcademicInstitutionName}</p></td>
                                <td><p>{studie.isFinished ? 'Si' : 'No'}</p></td>
                                <td><p>{studie.comments}</p></td>
                                <td>
                                    <div>
                                        <div onClick={(e) => { selectedAcademicStudy(academicStudies[index]) }}>
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
            <AddicionalAcademicStudiesForm
                open={open}
                setOpen={setOpen}
            />

        </div>
    )
}