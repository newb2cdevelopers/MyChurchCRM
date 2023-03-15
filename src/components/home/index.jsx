import React from "react";
import styles from "./home.module.css";
import WelcomeScreen from "./WelcomeScreen.jsx";


function Home() {
  return <div className={styles.containerHome}>
    <WelcomeScreen/>
  </div>;
}

export default Home;
