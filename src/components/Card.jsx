import React from "react";
import styles from "./home/home.module.css";
import {useLocation, useNavigate} from 'react-router-dom';
import Icon from "@mui/material/Icon";
import { Link } from "react-router-dom";
import { useDispatch  } from 'react-redux'
import { setSelectedModuleRoutes } from "../features/navigation/navigationSlice";

export default function Card({ name, iconName, path, accesses }) {

  const dispatch = useDispatch();
  
  const navigateToRoute = (path, accesses) => {
    
    if (accesses) {
      dispatch(
        setSelectedModuleRoutes({
          selectedModuleRoutes: accesses
        })
      );
    }
  
  };

  return (
    <div className={styles.containerCard}>

      {/* Pendiente definir que clase de imagen o icono va a ir acá y la forma en que se va a cargar, si desde local o desde donde */}
      <Icon sx={{ fontSize: "70px" }}>{iconName}</Icon> 
      <div>
        <div className={styles.productCardDivider}></div>
        <Link to={path} onClick={() => {navigateToRoute(path, accesses)}} className="text-link">
          <p className={styles.text}>{name}</p>
        </Link>
      </div>
    </div>
  );
}
