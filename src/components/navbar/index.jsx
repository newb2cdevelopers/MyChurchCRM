import React, { useState } from "react";
import Button from "@mui/material/Button";

import { Drawer } from '@mui/material';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { Link } from "react-router-dom";
import styles from "./navbar.module.css";
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../../features/user/userSlice'
import { setSelectedModuleRoutes } from "../../features/navigation/navigationSlice";
import { useNavigate } from "react-router-dom"


function Navbar() {
  const [open, setOpen] = useState(false)
  const { token } = useSelector(state => state.user)
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const closeSession = (e) => {
    dispatch(login({ userEmail: '', token: '' }));
    dispatch(setSelectedModuleRoutes({ selectedModuleRoutes: [] }));
    return navigate("/");
  };

  const resetDashboard = (e) => {
    handleDrawer()
    dispatch(setSelectedModuleRoutes({ selectedModuleRoutes: [] }));
  };

  const handleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div className={styles.containerNavBar}>
      <div className={styles.containerNavBarMobile}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawer}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Link to="/" className={styles.textLink}>
          <Button className={styles.navButton} color="inherit">Bienvenido a Sistema de gestión Mi Iglesia</Button>{" "}
        </Link>
        <Drawer
          variant="persistent"
          anchor="left"
          open={open}
        >
          <IconButton onClick={handleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
          <Divider />
          <List>
            <Link to="/manageBookings" className={styles.textLink} onClick={handleDrawer}>
              <Button className={styles.navButton} color="inherit">Gestionar mis reservas</Button>{" "}
            </Link>
            {token ?
              <div>
                <Link to="/dashboard" onClick={resetDashboard} className={styles.textLink}>
                  <Button className={styles.navButton} color="inherit">Inicio</Button>{" "}
                </Link>
                <Button className={styles.navButton} color="inherit" onClick={closeSession}>Cerrar Sesión</Button>{" "}
              </div>
              : <div>
                <Link to="/login" onClick={handleDrawer} className={styles.textLink}>
                  <Button className={styles.navButton} color="inherit">Ingresar</Button>{" "}
                </Link>
                {/* <Link to="/register" className="text-link">
                  <Button color="inherit">Registrarse</Button>{" "}
                </Link> */}
              </div>}
          </List>
          <Divider />
        </Drawer>
      </div>

      <div className={styles.containerNavBarDesktop}>
        <Link to="/" className={styles.textLink}>
          <Button className={styles.navButton} color="inherit">Bienvenido a Sistema de gestión Mi Iglesia</Button>{" "}
        </Link>
        <Link to="/manageBookings" className={styles.textLink}>
          <Button className={styles.navButton} color="inherit">Gestionar mis reservas</Button>{" "}
        </Link>
        {token ?
          <div>
            <Link to="/dashboard" onClick={resetDashboard} className={styles.textLink}>
              <Button className={styles.navButton} color="inherit">Inicio</Button>{" "}
            </Link>
            <Button className={styles.navButton} color="inherit" onClick={closeSession}>Cerrar Sesión</Button>{" "}
          </div>
          : <div>
            <Link to="/login" className={styles.textLink}>
              <Button className={styles.navButton} color="inherit">Ingresar</Button>{" "}
            </Link>
            {/* <Link to="/register" className="text-link">
          <Button color="inherit">Registrarse</Button>{" "}
        </Link> */}
          </div>}
      </div>

    </div>
  );
}

export default Navbar;
