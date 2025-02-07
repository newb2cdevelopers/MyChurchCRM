import React, { useState, useRef, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import styles from "./styles.module.css";
import GeneralInfo from './components/GeneralInfo';
import Relatives from './components/Relatives';
import AdditionalAcademicStudies from './components/AdditionalAcademicStudies';
import MinistryStudies from './components/MinitryStudies';
import WorkFronts from './components/WorkFronts';
import MemberContext from '../../contexts/MemberContext';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

export default function Consolidation() {

    let selectedMember = useSelector(state => state.members.selectedMemberData);
    //selectedMember.birthDate = selectedMember.birthDate.split("T")[0]
    const [value, setValue] = useState(0);
    const [currentMember, setCurrentMember] = useState(selectedMember);
    const [currentMemberAcademicStudy, setCurrentMemberAcademicStudy] = useState(null);
    const [currentRelative, setCurrentrelative] = useState(null);
    const [currentMinistryStudy, setCurrentMinistryStudy] = useState(null);
    const [currentWrokFront, setCurrentWorkFront] = useState(null);
    const [areTabsDisabled, setAreTabsDisabled] = useState(true);
    const [showGeneralInfo, setShowGeneralInfo] = useState(true);
    const [showRelatives, setShowRelatives] = useState(true);
    const [showAdditionalStudies, setShowAdditionalStudies] = useState(true);
    const [showMinistryStudies, setShowMinistryStudies] = useState(true);
    const [showWorkFronts, setShowWorkFronts] = useState(true);

    let navigate = useNavigate();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        // If there is a selected member the tabs shoul be enabled
        if (selectedMember !== null) {
            setAreTabsDisabled(false);
        }
        setShowGeneralInfo(value === 0 ? true : false)
        setShowRelatives(value === 1 ? true : false)
        setShowAdditionalStudies(value === 2 ? true : false)
        setShowMinistryStudies(value === 3 ? true : false)
        setShowWorkFronts(value === 4 ? true : false)
    }, [value]);


    const navigateToRoute = (route) => {
        return navigate(route);
    }

    return (
        <div className={styles.mainContainer}>
            <Box>
                <button type="button" class="btn btn-dark"
                    onClick={() => navigateToRoute("/members")}>Volver al listado</button>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    aria-label="scrollable force tabs example"
                    className={styles.tabDetailsContainer}
                >
                    <Tab label="INFORMACIÓN GENERAL" className={styles.tabs} style={{borderRadius:" 4px 0px 0px 4px"}} />
                    <Tab label="INFORMACIÓN FAMILIAR" disabled={areTabsDisabled} className={styles.tabs} />
                    <Tab label="ESTUDIOS / OTRAS FORMACIONES" disabled={areTabsDisabled} className={styles.tabs} />
                    <Tab label="FORMACIÓN MINSTERIAL" disabled={areTabsDisabled} className={styles.tabs} style={{borderRadius:"0px 4px 4px 0px"}} />
                </Tabs>
                <div className={styles.tabContainer}>
                    <MemberContext.Provider value={{
                        areTabsDisabled: areTabsDisabled,
                        setAreTabsDisabled: setAreTabsDisabled,
                        value: value,
                        setValue: setValue,
                        currentMember: currentMember,
                        setCurrentMember: setCurrentMember,
                        currentMemberAcademicStudy: currentMemberAcademicStudy,
                        setCurrentMemberAcademicStudy: setCurrentMemberAcademicStudy,
                        currentRelative: currentRelative,
                        setCurrentRelative: setCurrentrelative,
                        currentMinistryStudy: currentMinistryStudy,
                        setCurrentMinistryStudy: setCurrentMinistryStudy,
                        currentWorkFront: currentWrokFront,
                        setCurrentWorkFront: setCurrentWorkFront
                    }}>
                        <div className={styles.showGeneralInfo}>
                            {showGeneralInfo ? <GeneralInfo /> :
                                showRelatives ? <Relatives /> :
                                    showAdditionalStudies ? <AdditionalAcademicStudies /> :
                                        showMinistryStudies ? <MinistryStudies /> :
                                            showWorkFronts ? <WorkFronts /> :
                                                <></>}
                        </div>
                    </MemberContext.Provider>
                </div>
            </Box>
        </div>
    )
}