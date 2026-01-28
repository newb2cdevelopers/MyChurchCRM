import React from "react";
import styles from "./home/home.module.css";
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

      {/* Support both JSX components and icon name strings */}
      {typeof iconName === 'string' ? (
        <Icon sx={{ fontSize: "70px" }}>{iconName}</Icon>
      ) : (
        <div style={{ fontSize: "70px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {iconName}
        </div>
      )}
      <div>
        <div className={styles.productCardDivider}></div>
        <Link to={path} onClick={() => {navigateToRoute(path, accesses)}} className="text-link">
          <p className={styles.text}>{name}</p>
        </Link>
      </div>
    </div>
  );
}
