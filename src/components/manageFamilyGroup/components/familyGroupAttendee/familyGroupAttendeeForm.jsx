import { Box, IconButton } from '@mui/material'
import Modal from '@mui/material/Modal';
import styles from './styles.module.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import CloseIcon from '@mui/icons-material/Close';

export default function FamilyGroupAttendeeForm({ open, setOpen, setIsUpdateRequired, itemToEdit }) {

  const closeModal = () => {
    setOpen(false);
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
          <div className={styles.form}>
            <h1>Crea nuevo grupo familiar</h1>
            <div class="mb-3">
              <label for="name" class="form-label">Nombre</label>
              <input type="text" class="form-control form-control-sm" id="name" placeholder="Javier Hernández"
                />
            </div>
            <div class="mb-3">
              <label for="direccion" class="form-label">Dirección</label>
              <input type="text" class="form-control form-control-sm" id="direccion" placeholder="calle 56..." />
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
              <label for="phone" class="form-label">Número de teléfono</label>
              <input type="text" class="form-control form-control-sm" id="phone" placeholder="3125482154"
                 />
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