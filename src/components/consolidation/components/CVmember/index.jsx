import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./index.module.css";
export default function CvMember() {
  let selectedMember = useSelector((state) => state.members.selectedMemberData);
  const [currentMember, setCurrentMember] = useState();

  useEffect(() => {
    setCurrentMember(selectedMember);
  }, [selectedMember]);

  console.log(currentMember);

  if (!!currentMember === false) {
    return (
      <>
        <p>Cargando</p>
      </>
    );
  }

  return (
    <div className={styles.containerCv}>
      <div className={styles._containerHeader}>
        <div className={styles?._container_ProfilePhoto}>
          <div className={styles?._ProfilePhoto} />
        </div>

        <div className={styles?._DataProfile}>
          <p className={styles?._DataProfileFullName}>
            {currentMember?.fullName}
          </p>
          <p className={styles?._DataProfileDocumentNumber}>
            Cc: {currentMember?.documentNumber}
          </p>
        </div>
      </div>

      <div className={styles?._container_ProfileSummary}>
        <div className={styles?._container_ProfileContact}>
          <p>Email:</p>
          <p>{currentMember?.email}</p>
          <p>Celular: </p>
          <p>{currentMember?.mobilePhone}</p>
          <p>Dirección:</p>
          <p>{currentMember?.address}</p>
          <p>Ocupación: </p>
          <p>{currentMember?.occupation}</p>
          <p>Año de conversión: </p>
          <p>{currentMember?.conversionyear}</p>
          <p>Fecha de cumpleaños: </p>
          <p>{currentMember?.birthDate}</p>
        </div>
        <div className={styles?._MinisterialInformation}>
          <p>Información Ministerial</p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
        </div>
      </div>
    </div>
  );
}
