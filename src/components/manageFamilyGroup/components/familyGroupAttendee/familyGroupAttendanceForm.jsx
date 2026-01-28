import { Box, IconButton } from '@mui/material'
import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import styles from './styles.module.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Dropdown from "../../../../customComponents/dropdown/dropdown";
import { LIGTH_SEA_GREEN } from "../../../../styleConstanst";
import CloseIcon from '@mui/icons-material/Close';

export default function FamilyGroupAttendeeForm({ open, setOpen, setIsUpdateRequired, itemToEdit }) {

  const closeModal = () => {
    setOpen(false);
  }

  const [selectedAttendees, setSelecteAttendees] = useState([]);
  const [previewText, setPreviewText] = useState("");

  useEffect(() => {
    if (selectedAttendees.length > 0) {
      const previewHtml = (
        <>
          <ul>
            {selectedAttendees.map((selectedAttendees, index) => {
              return <li key={index}>{selectedAttendees.label}</li>;
            })}
          </ul>
        </>
      );
      setPreviewText(previewHtml);
    } else {
      const noSelectionText = <p>Sin selección</p>;
      setPreviewText(noSelectionText);
    }
  }, [selectedAttendees]);


  const anteendees = [
    {
      label: "Ana Pérez",
      value: "Ana pPérez"
    },
    {
      label: "Sandra Palacios",
      value: "Sandra Palacios"
    },
    {
      label: "Edison Higuita",
      value: "Edison Higuita"
    },
    {
      label: "Andrés Silva",
      value: "Andrés Silva"
    },
    {
      label: "Anderson López",
      value: "Anderson López"
    }
  ]

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
          <div className={styles.form}>
            <h1>Reporte asistencia grupo familiar</h1>
            <div class="mb-3">
              <label for="date" class="form-label"></label>
              <input type="date" class="form-control form-control-sm" id="date" placeholder="01/01/2025"
              />
            </div>
            <div class="mb-3">
              <label for="lesson" class="form-label"></label>
              <input type="text" class="form-control form-control-sm" id="lesson" placeholder="Sabio o insensato"
              />
            </div>
            <div class="mb-3">
              <label for="mainLeader" class="form-label">Asistentes</label>
              {/* <datalist id="leaderItems">
                <option value="Danny Gómez" />
                <option value="Andrés Pérez" />
                <option value="Gloria Franco " />
                <option value="Javier Hernández" />
                <option value="Carmen Villa" />
              </datalist> */}
              <Dropdown
                data={anteendees}
                value={selectedAttendees}
                onchange={(selectedAttendees) => {
                  setSelecteAttendees(selectedAttendees);
                }}
                multiple={true}
                placeholder='Seleccione usuarios'
                color={LIGTH_SEA_GREEN}
                style={{with:"100%"}}
              />
              <p className={styles.preview}>Previsualización</p>
              <div style={{background:"white", color:"black"}} className={styles.previewBox}>{previewText}</div>
            </div>
            <div class="mb-3">
              <label for="comments" class="form-label">Observaciones</label>
              <textarea class="form-control" aria-label="With textarea"
                name='comments'
                id='comments'
              ></textarea>
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