/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import styles from "./home.module.css";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import PromotionalEvents from "../promotionalEvents";
import { setSelectedChurch } from "../../features/user/userSlice";

function MainOptionsScreen() {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    let navigate = useNavigate();
    
    useEffect(() => {
        if(user.selectedChurchId === ""){
            return navigate("/");
          }
    },[])

    const goBackToSelectChurch = () => {
      dispatch(
        setSelectedChurch({
            selectedChurchId: "",
        })
      );
      return navigate("/");
    }

    return (
      <div className={styles.mainContainer}>
        {user.userEmail === "" && <button className={styles.selectChurchButton} onClick={()=>{goBackToSelectChurch()}}>
          Seleccionar otra iglesia
        </button>
        }
      
        <div className={styles.containerHome}>
          <PromotionalEvents/>
        </div>
      </div>
    
    );
}

export default MainOptionsScreen