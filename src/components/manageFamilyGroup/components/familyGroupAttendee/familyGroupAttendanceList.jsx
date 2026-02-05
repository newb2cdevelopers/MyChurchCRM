import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import FamilyGroupAttendanceForm from '../familyGroupAttendee/familyGroupAttendanceForm';

const MOCK_ATTENDANCE = [
  {
    fecha: '01-02-2025',
    Clase: 'Hombre insensato ó sabio',
    Observaciones: 'Se realizó con exito, dos miembros nuevos',
    Integrantes: 'Camilo jímenez, Andrea Escobar, Orlando Cano, Isabella Pérez',
  },
  {
    fecha: '01-02-2025',
    Clase: 'Hombre insensato ó sabio',
    Observaciones: 'Se realizó con exito, dos miembros nuevos',
    Integrantes: 'Camilo jímenez, Andrea Escobar, Orlando Cano, Isabella Pérez',
  },
  {
    fecha: '01-02-2025',
    Clase: 'Hombre insensato ó sabio',
    Observaciones: 'Se realizó con exito, dos miembros nuevos',
    Integrantes: 'Camilo jímenez, Andrea Escobar, Orlando Cano, Isabella Pérez',
  },
  {
    fecha: '01-02-2025',
    Clase: 'Hombre insensato ó sabio',
    Observaciones: 'Se realizó con exito, dos miembros nuevos',
    Integrantes: 'Camilo jímenez, Andrea Escobar, Orlando Cano, Isabella Pérez',
  },
  {
    fecha: '01-02-2025',
    Clase: 'Hombre insensato ó sabio',
    Observaciones: 'Se realizó con exito, dos miembros nuevos',
    Integrantes: 'Camilo jímenez, Andrea Escobar, Orlando Cano, Isabella Pérez',
  },
  {
    fecha: '01-02-2025',
    Clase: 'Hombre insensato ó sabio',
    Observaciones: 'Se realizó con exito, dos miembros nuevos',
    Integrantes: 'Camilo jímenez, Andrea Escobar, Orlando Cano, Isabella Pérez',
  },
];

export default function FamilyGroupAttendanceList({ perfil, familyGroupId }) {
  const [open, setOpen] = useState(false);
  const [, setIsUpdateRequired] = useState(false);
  const [familyGroups, setFamilyGroups] = useState([]);
  const [familyGroupsList, setFamilyGroupsList] = useState([]);
  const [selecteditem, setSelectedItem] = useState(null);

  // `perfil` is currently used only for conditional rendering.

  const handleOpen = () => {
    setIsUpdateRequired(false);
    setOpen(true);
  };

  useEffect(() => {
    // Replace mocked data with API call when endpoint is ready.
    if (!familyGroupId) {
      setFamilyGroups([]);
      setFamilyGroupsList([]);
      return;
    }
    setFamilyGroups(MOCK_ATTENDANCE);
    setFamilyGroupsList(MOCK_ATTENDANCE);
  }, [familyGroupId]);

  const selectedFamilyGroupToEdit = item => {
    setSelectedItem(item);
    setIsUpdateRequired(false);
    setOpen(true);
  };

  const searchFamilyGroup = name => {
    if (name !== '' && name.length >= 3) {
      let _filteredFamilyGroups = familyGroups.filter(familyGroup => {
        return (
          familyGroup.Integrantes.toLowerCase().indexOf(name.toLowerCase()) >= 0
        );
      });

      if (_filteredFamilyGroups && _filteredFamilyGroups.length > 0) {
        setFamilyGroupsList(_filteredFamilyGroups);
      } else setFamilyGroupsList(familyGroups);
    } else setFamilyGroupsList(familyGroups);
  };

  return (
    <div className={styles.MainContainer}>
      <div>
        <div style={{ display: 'inline-block' }}>
          {perfil !== 'coordinator' ? (
            <div className={styles.detailsFamilyGroupContainer}>
              <div className="input-group-sm mb-3">
                <label style={{ fontWeight: '700' }}>
                  Código grupo familiar:&nbsp;&nbsp;
                </label>
                <label style={{ fontWeight: '400' }}>001&nbsp;</label>
                <label style={{ fontWeight: '700' }}>
                  Líder Pricipal:&nbsp;
                </label>
                <label style={{ fontWeight: '400' }}>
                  Javier Hernández&nbsp;
                </label>
                <label style={{ fontWeight: '700' }}>Dirección:&nbsp;</label>
                <label style={{ fontWeight: '400' }}>
                  Carrera 45 # 79-50 Barrio Manrique&nbsp;
                </label>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div>
            <div className="input-group flex-nowrap input-group-sm mb-3">
              <span
                className="input-group-text"
                id="inputGroup-sizing-sm"
                style={{ fontWeight: '700' }}
              >
                Buscar por nombre del integrante:
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese el nombre"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-sm"
                onChange={e => {
                  searchFamilyGroup(e.target.value);
                }}
              />
            </div>
            <span style={{ fontWeight: '700' }}>
              <p style={{ marginRight: '600px' }}>
                Cantidad de registros: {familyGroupsList.length}
              </p>
            </span>
          </div>
          <div>
            <div>
              <div
                className={styles.createNewContainer}
                onClick={() => handleOpen()}
              >
                <AddCircleIcon
                  style={{ height: '40px', width: '40px' }}
                ></AddCircleIcon>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.tableContainer} table-responsive-lg`}>
          <table
            className={`${styles.table} table table-striped table-hover table-dark table-borderless`}
          >
            <thead>
              <tr>
                <th>Acciones</th>
                <th>Fecha</th>
                <th>Clase Enseñada</th>
                <th>Asistentes</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {familyGroupsList && familyGroupsList.length > 0 ? (
                familyGroupsList.map((familyGroup, index) => {
                  return (
                    <tr key={familyGroup._id || familyGroup.fecha || index}>
                      <td>
                        <div
                          style={{ cursor: 'pointer' }}
                          onClick={e => {
                            selectedFamilyGroupToEdit(familyGroup);
                          }}
                        >
                          <ModeEditIcon />
                        </div>
                      </td>
                      <td>{familyGroup.fecha}</td>
                      <td>{familyGroup.Clase}</td>
                      <td>{familyGroup.Integrantes}</td>
                      <td>{familyGroup.Observaciones}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td style={{ textAlign: 'center' }}>Sin resultados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <FamilyGroupAttendanceForm
        open={open}
        setOpen={setOpen}
        setIsUpdateRequired={setIsUpdateRequired}
        itemToEdit={selecteditem}
      />
    </div>
  );
}
