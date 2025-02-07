import { Box } from '@mui/material'
import React, { useState, useRef, useEffect, useContext } from 'react';
import Modal from '@mui/material/Modal';
import styles from './styles.module.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { style } from '@mui/system';

export default function FamilyGroupForm({ open, setOpen, setIsUpdateRequired }) {

  const closeModal = () => {
    setOpen(false);
  }

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"

      >
        <Box className={styles.familyGroupFormContainer}>
          <div className={styles.form}>
            <h1>Crea nuevo grupo familiar</h1>
            <div class="mb-3">
              <label for="code" class="form-label">Código</label>
              <input type="text" class="form-control form-control-sm" id="code" placeholder="0001"
                style={{ width: "80px" }} />
            </div>
            <div class="mb-3">
              <label for="direccion" class="form-label">Dirección</label>
              <input type="text" class="form-control form-control-sm" id="direccion" placeholder="calle 56..." />
            </div>
            <div class="mb-3">
              <label for="zone" class="form-label">Zona</label>
              <input class="form-control" list="zoneItems" id="zone" placeholder="Buscar..." />
              <datalist id="zoneItems">
                <option value="Zona Norte" />
                <option value="Zona Sur" />
              </datalist>
            </div>
            <div class="mb-3">
              <label for="locality" class="form-label">Comuna / Localidad</label>
              <input class="form-control" list="localityItems" id="locality" placeholder="Buscar..." />
              <datalist id="localityItems">
                <option value="Comuna 7" />
                <option value="Comuna 10" />
              </datalist>
            </div>
            <div class="mb-3">
              <label for="neighborhood" class="form-label">Barrio</label>
              <input class="form-control" list="neighborhoodItems" id="neighborhood" placeholder="Buscar..." />
              <datalist id="neighborhoodItems">
                <option value="Manrique" />
                <option value="Los Colores" />
                <option value="Aranjuez" />
              </datalist>
            </div>
            <div class="mb-3">
              <label for="mainLeader" class="form-label">Líder Principal</label>
              <input class="form-control" list="leaderItems" id="mainLeader" placeholder="Buscar..." />
              <datalist id="leaderItems">
                <option value="Danny Gómez" />
                <option value="Andrés Pérez" />
                <option value="Gloria Franco " />
                <option value="Javier Hernández" />
                <option value="Carmen Villa" />
              </datalist>
            </div>
            <div class="mb-3">
              <label for="status" class="form-label">Estado</label>
              <input class="form-control" list="statusItems" id="status" placeholder="Buscar..." />
              <datalist id="statusItems">
                <option value="Activo" />
                <option value="Cancelado" />
                <option value="Suspendido" />
              </datalist>
            </div>
            <div className={`${styles.buttons} btn-group`} role="group" aria-label="Basic example">
              <button type="button" class="btn btn-secondary" onClick={() => closeModal()}>Cancelar</button>
              <button type="button" class="btn btn-success" onClick={() => closeModal()}>Guardar</button>
            </div>
          </div>
        </Box>
      </Modal>
    </div >
  )
}