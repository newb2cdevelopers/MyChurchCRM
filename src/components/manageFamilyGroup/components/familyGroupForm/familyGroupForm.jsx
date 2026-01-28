import { Box, IconButton } from '@mui/material'
import React, { useState, useEffect, useCallback } from 'react';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import styles from './styles.module.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {
  genericPostService,
  genericPutService,
  getAuthHeaders,
  genericGetService
} from '../../../../api/externalServices';
import { B2C_BASE_URL } from '../../../../constants';
import { useSelector } from 'react-redux';
export default function FamilyGroupForm({ open, setOpen, selectedItem }) {

  const isEditting = selectedItem !== null;
  const user = useSelector(state => state.user);
  const [membersList, setMembersList] = useState([]);
  const [zoneList, setZoneList] = useState([]);
  const [localityList, setLocalityList] = useState([]);
  const [allLocalityList, setAllLocalityList] = useState([]);
  const [neighborhoodList, setNeighborhoodList] = useState([]);
  const [allNeighborhoodList, setAllNeighborhoodList] = useState([]);
  const [zoneBind, setZoneBind] = useState(null);
  const BASE_URL = B2C_BASE_URL;
  const [enableSave, setEnableSave] = useState(false);
  const [errorCode, setErrorCode] = useState("");
  const [errorAddress, setErrorAddress] = useState("");
  const [errorZones, setErrorZones] = useState("");
  const [errorLocality, setErrorLocality] = useState("");
  const [errorNeighborhood, setErrorNeighborhood] = useState("");
  const [errorLeader, setErrorLeader] = useState("");
  const [startDateError, setStartDateError] = useState("");
  const [code, setCode] = useState();
  const [leader, setLeader] = useState();
  const [address, setAddress] = useState();
  const [neighborhood, setNeighborhood] = useState();
  const [day, setDay] = useState();
  const [time, setTime] = useState();
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");

  const getMembers = useCallback(async () => {
    const headers = getAuthHeaders(user.token);
    return await genericGetService(`${BASE_URL}/member?churchId=${user.selectedChurchId}`, headers);
  }, [user.token, user.selectedChurchId, BASE_URL]);

  const getZones = useCallback(async () => {
    return await genericGetService(`${BASE_URL}/zone`);
  }, [BASE_URL]);

  const getLocalities = useCallback(async () => {
    return await genericGetService(`${BASE_URL}/locality`);
  }, [BASE_URL]);

  const getNeighborhoods = useCallback(async () => {
    return await genericGetService(`${BASE_URL}/neighborhood`);
  }, [BASE_URL]);

  useEffect(() => {

    setErrorAddress("");
    setErrorZones("");
    setErrorLocality("");
    setErrorNeighborhood("");
    setErrorLeader("");
    setErrorCode("");

    if (open) {

      if (selectedItem) {
        setCode(selectedItem.code);
        setLeader(selectedItem.leader._id);
        setAddress(selectedItem.address);
        setNeighborhood(selectedItem.neighborhood._id);
        setDay(selectedItem.day);
        setTime(selectedItem.time);
        setStatus(selectedItem.status);
        setStartDate(selectedItem.startDate);
      }

      getMembers().then(data => {
        if (data[0]) {
          setMembersList(data[0])
          return;
        }
        alert("Error");
      });

      getZones().then(data => {
        //setLoading(false);
        if (data[0]) {
          setZoneList(data[0]);
          return;
        }
        alert("Error");
      });

      getLocalities().then(data => {
        //setLoading(false);
        if (data[0]) {
          if (selectedItem) {
            let zone = data[0].filter(locality => { return locality._id === selectedItem.neighborhood.locality })[0];
            setZoneBind(zone.zone._id)
            let localities = data[0].filter(locality => { return locality.zone._id === zone.zone._id })
            setAllLocalityList(localities)
            setLocalityList(localities);
            return;
          }
          else {
            setLocalityList(data[0]);
            setAllLocalityList(data[0]);
            return;
          }
        }
        alert("Error");
      });

      getNeighborhoods().then(data => {
        //setLoading(false);
        if (data[0]) {
          if (selectedItem) {
            let neighborhoods = data[0].filter(neighborhood => { return neighborhood.locality._id === selectedItem.neighborhood.locality })
            setAllNeighborhoodList(neighborhoods)
            setNeighborhoodList(neighborhoods);
          } else {
            setNeighborhoodList(data[0]);
            setAllNeighborhoodList(data[0]);
            return
          }
          return;
        }
        alert("Error");
      });

    }
  }, [open, selectedItem, getMembers, getZones, getLocalities, getNeighborhoods]);

  const closeModal = () => {
    setOpen(false);
  }

  const hundleChange = (event) => {
    if (event.target.id === "code") {
      if (event.target.value.length > 0) {
        setEnableSave(true);
        setCode(event.target.value);
        setErrorCode("");
      }
      else {
        setErrorCode("El código es obligatorio");
        setEnableSave(false);
      }
    }

    if (event.target.id === "address") {
      if (event.target.value.length > 0) {
        setEnableSave(true);
        setAddress(event.target.value);
        setErrorAddress("");
      }
      else {
        setErrorAddress("La dirección es obligatoria");
        setEnableSave(false);
      }
    }

    if (event.target.id === "startDate") {
      if (event.target.value.length > 0) {
        setEnableSave(true);
        setStartDate(event.target.value);
        setStartDateError("");
      }
      else {
        setStartDateError("La fecha de inicio es obligatoria");
        setEnableSave(false);
      }
    }

    if (event.target.id === "zoneItems") {
      if (event.target.value.length > 0) {
        setEnableSave(true);
        setErrorZones("");
      }
      else {
        setErrorZones("Seleccione una opción válida");
        setEnableSave(false);
      }
    }

    if (event.target.id === "localityItems") {
      if (event.target.value.length > 0) {
        setEnableSave(true);
        setErrorLocality("");
      }
      else {
        setErrorLocality("Seleccione una opcion válida");
        setEnableSave(false);
      }
    }

    if (event.target.id === "neighborhoodItems") {
      if (event.target.value.length > 0) {
        setNeighborhood(event.target.value);
        setEnableSave(true);
        setErrorNeighborhood("");
      }
      else {
        setErrorNeighborhood("Seleccione una opcion válida");
        setEnableSave(false);
      }
    }

    if (event.target.id === "leaderItems") {
      if (event.target.value.length > 0) {
        setLeader(event.target.value);
        setEnableSave(true);
        setErrorLeader("");
      }
      else {
        setErrorLeader("Seleccione una opcion válida");
        setEnableSave(false);
      }
    }

    if (event.target.id === "dayItems") {
      if (event.target.value.length > 0) {
        setDay(event.target.value);
        setEnableSave(true);
        setErrorLeader("");
      }
      else {
        setErrorLeader("Seleccione una opcion válida");
        setEnableSave(false);
      }
    }

    if (event.target.id === "hourItems") {
      if (event.target.value.length > 0) {
        setTime(event.target.value);
        setEnableSave(true);
        setErrorLeader("");
      }
      else {
        setErrorLeader("Seleccione una opcion válida");
        setEnableSave(false);
      }
    }

    if (event.target.id === "statusItems") {
      if (event.target.value.length > 0) {
        setStatus(event.target.value);
        setEnableSave(true);
        setErrorLeader("");
      }
      else {
        setErrorLeader("Seleccione una opcion válida");
        setEnableSave(false);
      }
    }
  }

  const hundleChangeZone = (event) => {
    setZoneBind(event.target.value);
    let localities = allLocalityList.filter(locality => { return locality.zone._id === event.target.value })
    setLocalityList(localities);
    setNeighborhoodList([]);
    if (localities.length > 0) {
      let neighborhoods = allNeighborhoodList.filter(neighborhood => { return neighborhood.locality._id === localities[0]._id })
      setNeighborhoodList(neighborhoods);
    }
  }

  const hundleChangeLocality = (event) => {
    let neighborhoods = allNeighborhoodList.filter(neighborhood => { return neighborhood.locality._id === event.target.value })
    setNeighborhoodList(neighborhoods);
  }


  const saveitem = async () => {

    if (code !== "" && address !== "" && startDate !== "" && leader !== ""
      && neighborhood !== "" && time !== "" && day !== "" && status !== "") {
      const payload = {
        code: code,
        address: address,
        startDate: startDate,
        leader: leader,
        neighborhood: neighborhood,
        time: time,
        day: day,
        status: status,
        created_by: "62b5eb1ab5f08f33e6de2c28",
        _id: isEditting ? selectedItem._id : null
      };

      if (isEditting) {

        const results = await genericPutService(`${B2C_BASE_URL}/familyGroup`, payload);

        if (results[1]) {
          alert("Se ha presentado un error")
        } else {
          if (results[0].isSuccessful) {
            alert("Guardado exitoso")
            closeModal();
          } else {
            alert(results[0].message)
          }
        }
      }
      else {
        const results = await genericPostService(`${B2C_BASE_URL}/familyGroup`, payload);

        if (results[1]) {
          alert("Se ha presentado un error")
        } else {
          if (results[0].isSuccessful) {
            alert("Guardado exitoso")
            closeModal();
          } else {
            alert(results[0].message)
          }
        }
      }
    }
    else{
      alert("Todos los campos son obligatorios");
      return;
    }
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"

      >
        <Box className={styles.familyGroupFormContainer}>
          <IconButton
            aria-label="close"
            onClick={closeModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <div>
            <div className={styles.form}>
              <h1>Datos del Grupo Familiar</h1>
              <div class="mb-3">
                <label for="code" class="form-label">Código *</label>
                <input type="text" class="form-control form-control-sm" id="code" placeholder="0001"
                  style={{ width: "80px" }} defaultValue={selectedItem ? code : ""}
                  onChange={(e) => { hundleChange(e) }} />
              </div>
              {errorCode ? (
                <p className={styles.errorMessage}>{errorCode}</p>
              ) : null}
              <div class="mb-3">
                <label for="address" class="form-label">Dirección</label>
                <input type="text" class="form-control form-control-sm" id="address" placeholder="calle 56..."
                  defaultValue={selectedItem ? address : ""}
                  onChange={(e) => { hundleChange(e) }} />
              </div>
              {errorAddress ? (
                <p className={styles.errorMessage}>{errorAddress}</p>
              ) : null}
              <div class="mb-3">
                <label for="startDate" class="form-label">Fecha de inicio</label>
                <input type="date" class="form-control form-control-sm" id="startDate"
                  defaultValue={selectedItem ? startDate : ""}
                  onChange={(e) => { hundleChange(e) }} />
              </div>
              {startDateError ? (
                <p className={styles.errorMessage}>{startDateError}</p>
              ) : null}
              <div class="mb-3">
                <label for="zone" class="form-label">Zona</label>
                <select class="form-select" style={{ height: "40px" }}
                  id="zoneItems" onChange={hundleChangeZone}
                  defaultValue={selectedItem ? zoneBind : ""}>
                  {zoneList && zoneList.length > 0 ?
                    zoneList.sort((a, b) => a.name.localeCompare(b.name)).map((zone, index) => {
                      return <option key={index} value={zone._id} >{zone.name.toUpperCase()}</option>;
                    }) : null}
                </select>
              </div>
              {errorCode ? (
                <p className={styles.errorMessage}>{errorZones}</p>
              ) : null}
              <div class="mb-3">
                <label for="locality" class="form-label">Comuna / Localidad</label>
                <select class="form-select" style={{ height: "40px" }}
                  id="localityItems" onChange={hundleChangeLocality}
                  defaultValue={selectedItem ? selectedItem?.neighborhood?.locality : ""}>
                  {localityList && localityList.length > 0 ?
                    localityList.sort((a, b) => a.name.localeCompare(b.name)).map((locality, index) => {
                      return <option key={index} value={locality._id} >{locality.name.toUpperCase()}</option>;
                    }) : null}
                </select>
              </div>
              {errorCode ? (
                <p className={styles.errorMessage}>{errorLocality}</p>
              ) : null}
              <div class="mb-3">
                <label for="neighborhood" class="form-label">Barrio</label>
                <select class="form-select" style={{ height: "40px" }}
                  id="neighborhoodItems" onChange={(e) => { hundleChange(e) }}
                  defaultValue={selectedItem ? neighborhood : ""}>
                  {neighborhoodList && neighborhoodList.length > 0 ?
                    neighborhoodList.sort((a, b) => a.name.localeCompare(b.name)).map((neighborhood, index) => {
                      return <option key={index} value={neighborhood._id} >{neighborhood.name.toUpperCase()}</option>;
                    }) : null}
                </select>
              </div>
              {errorCode ? (
                <p className={styles.errorMessage}>{errorNeighborhood}</p>
              ) : null}
              <div class="mb-3">
                <label for="mainLeader" class="form-label">Líder Principal</label>
                <select class="form-select" style={{ height: "40px" }}
                  id="leaderItems" onChange={(e) => { hundleChange(e) }}
                  defaultValue={selectedItem ? leader : ""}>
                  {membersList && membersList.length > 0 ?
                    membersList.sort((a, b) => a.fullName.localeCompare(b.fullName)).map((member, index) => {
                      return <option key={index} value={member._id} >{member.fullName.toUpperCase()}</option>;
                    }) : null}
                </select>
              </div>
              {errorCode ? (
                <p className={styles.errorMessage}>{errorLeader}</p>
              ) : null}
              <div class="mb-3">
                <label for="day" class="form-label">Día</label>
                <select class="form-select" style={{ height: "40px" }} id="dayItems"
                  onChange={(e) => { hundleChange(e) }}
                  defaultValue={selectedItem ? day : ""}>
                  <option value="">Seleccione un día</option>
                  <option value="Lunes">Lunes</option>
                  <option value="Martes">Martes</option>
                  <option value="Miércoles">Miércoles</option>
                  <option value="Jueves">Jueves</option>
                  <option value="Viernes">Viernes</option>
                  <option value="Sábado">Sábado</option>
                  <option value="Domingo">Domingo</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="hour" class="form-label">Hora</label>
                <select class="form-select" style={{ height: "40px" }} id="hourItems"
                  onChange={(e) => { hundleChange(e) }}
                  defaultValue={selectedItem ? time : ""}>
                  <option value="">Seleccione una hora</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="14:00">14:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                  <option value="19:00">19:00</option>
                  <option value="20:00">20:00</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="status" class="form-label">Estado</label>
                <select id="statusItems" class="form-select" style={{ height: "40px" }}
                  onChange={(e) => { hundleChange(e) }}
                  defaultValue={selectedItem ? status : ""}>
                  <option value="">Seleccione un estado</option>
                  <option value="Activo">Activo</option>
                  <option value="Cancelado">Cancelado</option>
                  <option value="Suspendido">Suspendido</option>
                </select>
              </div>
              <div className={`${styles.buttons} btn-group`} role="group" aria-label="Basic example">
                <button type="button" class="btn btn-secondary" onClick={() => closeModal()}>Cancelar</button>
                <button type="button" class="btn btn-success" disabled={!enableSave} onClick={saveitem}>Guardar</button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div >
  )
}